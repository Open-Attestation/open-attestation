import { get, sortBy } from "lodash";
import { keccak256 } from "js-sha3";
import { Salt } from "./types";
import { OpenAttestationDocument } from "../__generated__/schema.4.0";

export const digestCredential = (document: OpenAttestationDocument, salts: Salt[], obfuscatedData: string[]) => {
  // Prepare array of hashes from visible data
  const hashedUnhashedDataArray = salts
    // Explictly allow falsy values (e.g. false, 0, etc.) as they can exist in the document
    .filter((salt) => get(document, salt.path) !== undefined)
    .map((salt) => {
      return keccak256(JSON.stringify({ [salt.path]: `${salt.value}:${get(document, salt.path)}` }));
    });

  // Combine both array and sort them to ensure determinism
  const combinedHashes = obfuscatedData.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};
