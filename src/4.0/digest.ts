import { sortBy } from "lodash";
import { keccak256 } from "js-sha3";
import { V4Document, Salt } from "./types";
import { LeafValue, traverseAndFlatten } from "./traverseAndFlatten";
import { hashToBuffer } from "../shared/utils";

export const digestCredential = (document: V4Document, salts: Salt[], obfuscatedData: string[]) => {
  const saltsMap = new Map(salts.map((salt) => [salt.path, salt.value]));
  const hashedLeafNodes = traverseAndFlatten(document, ({ value, path }) => {
    const salt = saltsMap.get(path);
    if (!salt) throw new Error(`Salt not found for ${path}`);
    return hashLeafNode({ path, salt, value });
  });

  // Combine both array and sort them to ensure determinism
  const combinedHashes = obfuscatedData.concat(hashedLeafNodes);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
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
