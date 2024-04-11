import { get, omitBy, sortBy } from "lodash";
import { keccak256 } from "js-sha3";
import { flatten } from "../shared/serialize/flatten";
import { OpenAttestationDocument } from "../__generated__/schema.2.0";
import { SchematisedDocument } from "./types";

const isKeyOrValueUndefined = (value: any, key: any) => value === undefined || key === undefined;

export const flattenHashArray = (data: any) => {
  const flattenedData = omitBy(flatten(data), isKeyOrValueUndefined);
  return Object.keys(flattenedData).map((k) => {
    const obj: any = {};
    obj[k] = flattenedData[k];
    return keccak256(JSON.stringify(obj));
  });
};

export const digestDocument = <T extends OpenAttestationDocument = OpenAttestationDocument>(
  document: SchematisedDocument<T>,
) => {
  // Prepare array of hashes from filtered data
  const hashedDataArray: string[] = get(document, "privacy.obfuscatedData", []);

  // Prepare array of hashes from visible data
  const unhashedData = get(document, "data");
  const hashedUnhashedDataArray = flattenHashArray(unhashedData);

  // Combine both array and sort them to ensure determinism
  const combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};
