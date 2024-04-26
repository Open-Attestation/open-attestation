import { V4WrappedDocument } from "./types";
import { digestCredential } from "./digest";
import { checkProof } from "../shared/merkle";
import { decodeSalt, salt } from "./salt";

export const verify = <T extends V4WrappedDocument>(document: T): document is T => {
  if (!document.proof) {
    return false;
  }

  // Remove proof from document
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const { proof, ...documentWithoutProof } = document;
  const decodedSalts = decodeSalt(document.proof.salts);

  // Checks to ensure there are no added/removed values, so visibleSalts.length must match decodedSalts.length
  const visibleSalts = salt(documentWithoutProof);
  if (visibleSalts.length !== decodedSalts.length) return false;

  // Checks target hash
  const digest = digestCredential(documentWithoutProof, decodedSalts, document.proof.privacy.obfuscated);
  const targetHash = document.proof.targetHash;
  if (digest !== targetHash) return false;

  // Calculates merkle root from target hash and proof, then compare to merkle root in document
  return checkProof(document.proof.proofs, document.proof.merkleRoot, document.proof.targetHash);
};
