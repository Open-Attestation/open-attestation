import { bufSortJoin, hashToBuffer } from "../shared/utils";
import { OpenAttestationVerifiableCredential } from "../shared/@types/document";
import { keccak256 } from "js-sha3";
import { digestDocument as digestDocumentV3 } from "./digest";

export const verifyV3 = <T extends OpenAttestationVerifiableCredential>(
  document: T
): document is OpenAttestationVerifiableCredential<T> => {
  const signature = document.proof;
  if (!signature) {
    return false;
  }

  // Checks target hash
  const bla = {
    ...document,
    proof: {
      ...document.proof,
      signature: undefined
    }
  };
  const digest = digestDocumentV3(bla, document.proof.salts, document.proof.privacy.obfuscated);
  const targetHash = document.proof.targetHash;
  if (digest !== targetHash) return false;

  // Calculates merkle root from target hash and proof, then compare to merkle root in document
  const merkleRoot = document.proof.merkleRoot;
  const proofs: string[] = document.proof.proofs;
  const calculatedMerkleRoot = proofs.reduce((prev, current) => {
    const prevAsBuffer = hashToBuffer(prev);
    const currAsBuffer = hashToBuffer(current);
    const combineAsBuffer = bufSortJoin(prevAsBuffer, currAsBuffer);
    return keccak256(combineAsBuffer);
  }, digest);

  return calculatedMerkleRoot === merkleRoot;
};
