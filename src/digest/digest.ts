import { get, omitBy, sortBy } from "lodash";
import { flatten } from "flat";
import { keccak256 } from "ethereumjs-util";
import { SchematisedDocument } from "../privacy";

const isKeyOrValueUndefined = (value: any, key: any) => value === undefined || key === undefined

export const flattenHashArray = (data: any) => {
  const flattenedData = omitBy(
    flatten(data), isKeyOrValueUndefined);
  return Object.keys(flattenedData).map(k => {
    const obj: any = {};
    obj[k] = flattenedData[k];
    return keccak256(JSON.stringify(obj)).toString("hex");
  });
};

export const digestDocument = (document: SchematisedDocument) => {
  // Prepare array of hashes from filtered data
  const hashedDataArray = get(document, "privacy.obfuscatedData", []);

  // Prepare array of hashes from visible data
  const unhashedData = get(document, "data");
  const hashedUnhashedDataArray = flattenHashArray(unhashedData);

  // Combine both array and sort them to ensure determinism
  const combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  const digest = keccak256(JSON.stringify(sortedHashes)).toString("hex");
  return digest;
};
