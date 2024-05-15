import { sortBy } from "lodash";
import { keccak256 } from "js-sha3";
import { W3cVerifiableCredential, Salt } from "./types";
import { LeafValue, traverseAndFlatten } from "./traverseAndFlatten";
import { hashToBuffer } from "../shared/utils/hashing";

export const digestCredential = (document: W3cVerifiableCredential, salts: Salt[], obfuscatedData: string[]) => {
  // find all leaf nodes in the document and hash them
  // proof is not part of the digest
  const { proof: _, ...documentWithoutProof } = document;
  const saltsMap = new Map(salts.map((salt) => [salt.path, salt.value]));
  const isEmptyDocument = Object.keys(documentWithoutProof).length === 0;
  const hashedLeafNodes =
    // skip if document without proof is empty as it will treat the empty document as a leaf node
    isEmptyDocument
      ? []
      : traverseAndFlatten(documentWithoutProof, ({ value, path }) => {
          const salt = saltsMap.get(path);
          if (!salt) throw new SaltNotFoundError(path);
          return hashLeafNode({ path, salt, value });
        });

  // combine both array and sort them to ensure determinism
  const combinedHashes = obfuscatedData.concat(hashedLeafNodes);
  const sortedHashes = sortBy(combinedHashes);

  // finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};

type HashParams = {
  salt: string;
  value: LeafValue;
  path: string;
};
type HashOptions = {
  toHexString: true;
};
export function hashLeafNode({ path, salt, value }: HashParams, options?: HashOptions) {
  const type = deriveType(value);
  const hash = keccak256(JSON.stringify({ [path]: `${salt}:${type}:${value}` }));
  return !options?.toHexString ? hash : hashToBuffer(hash).toString("hex");
}

export function deriveType(value: unknown): "string" | "number" | "boolean" | "null" | "object" | "array" {
  if (Array.isArray(value)) {
    return "array";
  } else if (value === null) {
    return "null";
  } else {
    switch (typeof value) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "object":
        return "object";
      case "boolean":
        return "boolean";
      default:
        throw new Error(`Unsupported type ${typeof value}`);
    }
  }
}

export class SaltNotFoundError extends Error {
  constructor(public path: string) {
    super(`Salt not found for ${path}`);

    // we shd consider changing the compilation target to >= es6
    // https://www.dannyguo.com/blog/how-to-fix-instanceof-not-working-for-custom-errors-in-typescript
    Object.setPrototypeOf(this, SaltNotFoundError.prototype);
  }
}
