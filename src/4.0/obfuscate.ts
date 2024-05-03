import { cloneDeep, get, unset, pick, toPath } from "lodash";
import { decodeSalt, encodeSalt } from "./salt";
import { traverseAndFlatten } from "./traverseAndFlatten";
import { Override, PartialDeep, V4SignedWrappedDocument, V4WrappedDocument } from "./types";
import { hashLeafNode } from "./digest";

const obfuscate = (_data: V4WrappedDocument, fields: string[] | string) => {
  const data = cloneDeep(_data); // Prevents alteration of original data
  const fieldsAsArray = ([] as string[]).concat(fields);

  // fields to remove will contain the list of each expanded keys from the fields passed in parameter, it's for instance useful in case of
  // object obfuscation, where the object itself is not part of the salts, but each individual keys are
  const toBeRemovedLeafNodes = traverseAndFlatten(pick(data, fieldsAsArray), ({ path }) => path);
  const salts = decodeSalt(data.proof.salts);

  const obfuscatedData = toBeRemovedLeafNodes.map((field) => {
    const value = get(data, field);
    const salt = salts.find((s) => s.path === field);

    if (!salt) {
      throw new Error(`Salt not found for ${field}`);
    }

    return hashLeafNode({ value, salt: salt.value, path: salt.path }, { toHexString: true });
  });

  // remove fields from the object
  for (const field of fieldsAsArray) {
    const path = toPath(field);
    const isRemoved = unset(data, path);
    if (isRemoved) {
      // assertions to ensure that obfuscation does not result in additional leaf nodes
      // that would render the resultant document as invalid
      path.pop();
      if (path.length > 0) {
        const parent = get(data, path);
        if (Array.isArray(parent)) {
          // Why removing elements in an array is not supported?
          // removing an item from an array leaves an empty item/undefined in the array
          // but when serialized to JSON, empty items are converted to null
          // null is a leaf node and will lead to a problem similar to what is described below
          throw new CannotObfuscateArrayItemError(field);
        } else if (typeof parent === "object") {
          // Why removing elements that lead to empty objects is not supported?
          // our obfucsation algoritm works as such:
          // given an object { a: { b: 1 }, c: [{ d: 2, e: 3 }] }
          // the leaf nodes will be [a.b, c[0].d, c[0].e]
          // and the hash, lets call it X, is computed over these leaf nodes
          // when we obfuscate say c[0].d, we prehash c[0].d and add it to obfuscatedData and remove c[0].d from the object
          // now the hash is computed over [a.b, c[0].e] and prehash(c[0].d) and still equates to X
          // the problem comes when we remove both c[0].d and c[0].e, or a.b, which in both cases leaves an empty object behind
          // empty objects are considered leaf nodes. so given we obfuscate a.b, a will be an empty object, a leaf node
          // the hash now is computed over [a, c[0].d, c[0].e] and prehash(a.b), which does not equate to X
          if (Object.keys(parent).length === 0) {
            throw new CannotResultInEmptyObjectError(field);
          }
        }
      }
    }
  }

  data.proof.salts = encodeSalt(salts.filter((s) => !toBeRemovedLeafNodes.includes(s.path)));
  return {
    data,
    obfuscatedData,
  };
};

export type ObfuscateVerifiableCredentialResult<T extends V4WrappedDocument | V4SignedWrappedDocument> = Override<
  T extends V4SignedWrappedDocument ? V4SignedWrappedDocument : V4WrappedDocument,
  Required<PartialDeep<Pick<T, "credentialSubject">>>
>;
export const obfuscateVerifiableCredential = <T extends V4WrappedDocument | V4SignedWrappedDocument>(
  document: T,
  fields: string[] | string
): ObfuscateVerifiableCredentialResult<T> => {
  const { data, obfuscatedData } = obfuscate(document, fields);
  const currentObfuscatedData = document.proof.privacy.obfuscated;
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);

  // assert that obfuscated is still compliant to our schema
  const parsedResults = V4WrappedDocument.safeParse({
    ...data,
    proof: {
      ...data.proof,
      privacy: {
        ...data.proof.privacy,
        obfuscated: newObfuscatedData,
      },
    },
  });
  if (!parsedResults.success) {
    const paths = parsedResults.error.errors.map(({ path }) => path.join("."));
    throw new CannotObfuscateProtectedPathsError(paths);
  }
  return parsedResults.data as ObfuscateVerifiableCredentialResult<T>;
};

class CannotObfuscateProtectedPathsError extends Error {
  constructor(public paths: string[]) {
    super(
      `The resultant obfuscated document is not V4 Wrapped Document compliant, please ensure that the following path(s) are not obfuscated: ${paths
        .map((val) => `"${val}"`)
        .join(", ")}`
    );
    // https://www.dannyguo.com/blog/how-to-fix-instanceof-not-working-for-custom-errors-in-typescript
    Object.setPrototypeOf(this, CannotObfuscateProtectedPathsError.prototype);
  }
}

class CannotObfuscateArrayItemError extends Error {
  constructor(public field: string) {
    super("Obfuscation of an array item is not supported");
    Object.setPrototypeOf(this, CannotObfuscateArrayItemError.prototype);
  }
}

class CannotResultInEmptyObjectError extends Error {
  constructor(public field: string) {
    super(
      `Obfuscation of "${field}" has resulted in an empty {}, this is currently not supported. Alternatively, if the object is not part of an array, you may choose to obfuscate the parent of "${field}".`
    );
    Object.setPrototypeOf(this, CannotResultInEmptyObjectError.prototype);
  }
}

export const obfuscateErrors = {
  CannotObfuscateProtectedPathsError,
  CannotObfuscateArrayItemError,
  CannotResultInEmptyObjectError,
};
