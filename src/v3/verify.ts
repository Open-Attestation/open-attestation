import { OpenAttestationVerifiableCredential } from "../shared/@types/document";
import { digestDocument } from "./digest";
import { checkProof } from "../shared/merkle";
import { decodeSalt, salt } from "./wrap";

export const verify = <T extends OpenAttestationVerifiableCredential>(
  document: T
): document is OpenAttestationVerifiableCredential<T> => {
  if (!document.proof) {
    return false;
  }

  // Remove proof from document
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const { proof, ...documentWithoutProof } = document;
  const decodedSalts = decodeSalt(document.proof.salts);

  // Count number of hashes: count(visible) + count(obfuscated) should match count(decodedSalts)
  const countVisible = salt(documentWithoutProof).length;
  const countObfuscated = document.proof.privacy.obfuscated.length;
  const count = countVisible + countObfuscated;

  if (count !== decodedSalts.length) return false;

  // Checks target hash
  const digest = digestDocument(documentWithoutProof, decodedSalts, document.proof.privacy.obfuscated);
  const targetHash = document.proof.targetHash;

  if (digest !== targetHash) return false;

  // Calculates merkle root from target hash and proof, then compare to merkle root in document
  return checkProof(document.proof.proofs, document.proof.merkleRoot, document.proof.targetHash);
};
