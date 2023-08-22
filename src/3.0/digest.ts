import { get, sortBy } from "lodash";
import { keccak256 } from "js-sha3";
import { Salt } from "./types";
import { OpenAttestationDocument } from "../__generated__/schema.3.0";

export const digestCredential = (document: OpenAttestationDocument, salts: Salt[], obfuscatedData: string[]) => {
  // Prepare array of hashes from visible data
  const hashedUnhashedDataArray = salts
    .filter((salt) => get(document, salt.path))
    .map((salt) => {
      return keccak256(JSON.stringify({ [salt.path]: `${salt.value}:${get(document, salt.path)}` }));
    });

  // Combine both array and sort them to ensure determinism
  const combinedHashes = [...obfuscatedData, ...hashedUnhashedDataArray];
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};
