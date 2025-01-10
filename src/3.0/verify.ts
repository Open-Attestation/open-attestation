import { WrappedDocument } from "./types";
import { digestCredential } from "./digest";
import { checkProof } from "../shared/merkle";
import { decodeSalt, salt } from "./salt";

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/beta)
 */
export const verify = <T extends WrappedDocument>(document: T): document is WrappedDocument<T> => {
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
