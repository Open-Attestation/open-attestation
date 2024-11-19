import { Digested } from "./types";
import { SaltNotFoundError, genTargetHash } from "./hash";
import { checkProof } from "../shared/merkle";
import { decodeSalt } from "./salt";

export const validateDigest = <T extends Digested>(document: T): document is T => {
  if (!document.proof) {
    return false;
  }

  // Remove proof from document
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const { proof, ...vcWithoutProof } = document;
  const decodedSalts = decodeSalt(document.proof.salts);

  // Checks target hash
  try {
    const digest = genTargetHash(vcWithoutProof, decodedSalts, document.proof.privacy.obfuscated);
    const targetHash = document.proof.targetHash;
    if (digest !== targetHash) return false;

    // Calculates merkle root from target hash and proof, then compare to merkle root in document
    return checkProof(document.proof.proofs, document.proof.merkleRoot, document.proof.targetHash);
  } catch (error: unknown) {
    if (error instanceof SaltNotFoundError) {
      return false;
    }
    throw error;
  }
};
