import { get, omitBy, sortBy } from "lodash";
import { keccak256 } from "js-sha3";
import { flatten } from "../serialize/flatten";
import { OpenAttestationDocument, SchematisedDocument } from "../@types/document";

const isEmptyObject = (value: any) => typeof value === "object" && Object.keys(value).length === 0;

export const flattenHashArray = (data: any) => {
  // remove values or keys if undefined and empty object (with no keys)
  const flattenedData = omitBy(
    flatten(data),
    (value: any, key: any) => value === undefined || key === undefined || isEmptyObject(value)
  );
  return Object.keys(flattenedData).map(k => {
    const obj: any = {};
    obj[k] = flattenedData[k];
    return keccak256(JSON.stringify(obj));
  });
};

export const digestDocument = <T extends OpenAttestationDocument = OpenAttestationDocument>(
  document: SchematisedDocument<T>
) => {
  // Prepare array of hashes from filtered data
  const hashedDataArray = get(document, "privacy.obfuscatedData", []);

  // Prepare array of hashes from visible data
  const unhashedData = get(document, "data");
  const hashedUnhashedDataArray = flattenHashArray(unhashedData);

  // Combine both array and sort them to ensure determinism
  const combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};
