import { OpenAttestationDocument } from "../__generated__/schemaV3";
import { bufSortJoin, hashToBuffer } from "../shared/utils";
import { VerifiableCredential } from "../shared/@types/document";
import { keccak256 } from "js-sha3";
import { digestDocument as digestDocumentV3 } from "./digest";

export const verifyV3 = <T extends VerifiableCredential<OpenAttestationDocument>>(
  document: T
): document is VerifiableCredential<T> => {
  const signature = document.proof.signature;
  if (!signature) {
    return false;
  }

  // Checks target hash
  const bla = {
    ...document,
    proof: {
      ...document.proof,
      sinature: undefined
    }
  };
  const digest = digestDocumentV3(bla, document.proof.signature.salts, document.proof.signature.privacy.obfuscatedData);
  const targetHash = document.proof.signature.targetHash;
  if (digest !== targetHash) return false;

  // Calculates merkle root from target hash and proof, then compare to merkle root in document
  const merkleRoot = document.proof.signature.merkleRoot;
  const proof: string[] = document.proof.signature.proof;
  const calculatedMerkleRoot = proof.reduce((prev, current) => {
    const prevAsBuffer = hashToBuffer(prev);
    const currAsBuffer = hashToBuffer(current);
    const combineAsBuffer = bufSortJoin(prevAsBuffer, currAsBuffer);
    return keccak256(combineAsBuffer);
  }, digest);

  return calculatedMerkleRoot === merkleRoot;
};
