import { get, sortBy } from "lodash";
import { keccak256 } from "js-sha3";
import { Salt, VerifiableCredential } from "../../shared/@types/document";
import { OpenAttestationDocument } from "../../__generated__/schemaV3";

export const digestDocument = (
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
