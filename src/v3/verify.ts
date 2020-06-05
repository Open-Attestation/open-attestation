import { OpenAttestationVerifiableCredential } from "../shared/@types/document";
import { digestDocument } from "./digest";
import { checkProof } from "../shared/merkle";
import { decodeSalt } from "./wrap";

export const verify = <T extends OpenAttestationVerifiableCredential>(
  document: T
): document is OpenAttestationVerifiableCredential<T> => {
  if (!document.proof) {
    return false;
  }

  // remove proof from document
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const { proof, ...documentWithoutProof } = document;

  // Checks target hash
  const digest = digestDocument(
    documentWithoutProof,
    decodeSalt(document.proof.salts),
    document.proof.privacy.obfuscated
  );
  const targetHash = document.proof.targetHash;
  if (digest !== targetHash) return false;

  // Calculates merkle root from target hash and proof, then compare to merkle root in document
  return checkProof(document.proof.proofs, document.proof.merkleRoot, document.proof.targetHash);
};
