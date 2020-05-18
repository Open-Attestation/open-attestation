import { get, omitBy, sortBy } from "lodash";
import { keccak256 } from "js-sha3";
import { flatten } from "../serialize/flatten";
import { Salt, SchematisedDocument, VerifiableCredential } from "../../shared/@types/document";
import { OpenAttestationDocument } from "../../__generated__/schemaV3";

const isKeyOrValueUndefined = (value: any, key: any) => value === undefined || key === undefined;

export const flattenHashArray = (data: any) => {
  const flattenedData = omitBy(flatten(data), isKeyOrValueUndefined);
  return Object.keys(flattenedData).map(k => {
    const obj: any = {};
    obj[k] = flattenedData[k];
    return keccak256(JSON.stringify(obj));
  });
};

export const digestDocumentV2 = (document: SchematisedDocument) => {
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

export const digestDocumentV3 = (
  document: VerifiableCredential<OpenAttestationDocument>,
  salts: Salt[],
  obfuscatedData: string[]
) => {
  // Prepare array of hashes from filtered data
  // const hashedDataArray = document.proof.signature.privacy.obfuscatedData;

  // console.log(JSON.stringify(salts, null, 2));
  // Prepare array of hashes from visible data
  const hashedUnhashedDataArray = salts
    .filter(salt => get(document, salt.path))
    .map(salt => {
      // console.log(`[${salt.path}] = ${get(document, salt.path)}`);
      return keccak256(JSON.stringify(`${salt.value}:${get(document, salt.path)}`));
    });

  // Combine both array and sort them to ensure determinism
  const combinedHashes = obfuscatedData.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};
