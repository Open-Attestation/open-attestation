import { toBuffer } from "../shared/utils";
import { cloneDeep, get, unset, pick } from "lodash";
import { decodeSalt, encodeSalt } from "./salt";
import { traverseAndFlatten } from "./traverseAndFlatten";
import { Override, PartialDeep, V4SignedWrappedDocument, V4WrappedDocument } from "./types";

const obfuscate = (_data: V4WrappedDocument, fields: string[] | string) => {
  const data = cloneDeep(_data); // Prevents alteration of original data

  const fieldsAsArray = ([] as string[]).concat(fields);
  // fields to remove will contain the list of each expanded keys from the fields passed in parameter, it's for instance useful in case of
  // object obfuscation, where the object itself is not part of the salts, but each individual keys are
  const fieldsToRemove: string[] = traverseAndFlatten(pick(data, fieldsAsArray), {
    iteratee: ({ path }) => path,
  });
  const salts = decodeSalt(data.proof.salts);

  // Obfuscate data by hashing them with the key
  const obfuscatedData = fieldsToRemove.map((field) => {
    const value = get(data, field);
    const salt = salts.find((s) => s.path === field);

    if (!salt) {
      throw new Error(`Salt not found for ${field}`);
    }

    return toBuffer({ [salt.path]: `${salt.value}:${value}` }).toString("hex");
  });
  // remove fields from the object
  fieldsAsArray.forEach((field) => unset(data, field));

  data.proof.salts = encodeSalt(salts.filter((s) => !fieldsToRemove.includes(s.path)));
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
    throw new ObfuscatedInvalidPaths(paths);
  }
  return parsedResults.data as ObfuscateVerifiableCredentialResult<T>;
};

export class ObfuscatedInvalidPaths extends Error {
  constructor(public paths: string[]) {
    super(
      `The resultant obfuscated document is not V4 Wrapped Document compliant, please ensure that the following path(s) are not obfuscated: ${paths
        .map((val) => `"${val}"`)
        .join(", ")}`
    );
  }
}
