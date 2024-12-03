import { Digested } from "./types";
import { SaltNotFoundError, genTargetHash } from "./hash";
import { checkProof } from "../shared/merkle";
import { decodeSalt } from "./salt";

export const validateDigest = <T extends Digested>(vc: T): vc is T => {
  if (!vc.proof) {
    return false;
  }

  // Remove proof from VC
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const { proof, ...vcWithoutProof } = vc;
  const decodedSalts = decodeSalt(vc.proof.salts);

  // Checks target hash
  try {
    const digest = genTargetHash(vcWithoutProof, decodedSalts, vc.proof.privacy.obfuscated);
    const targetHash = vc.proof.targetHash;
    if (digest !== targetHash) return false;

    // Calculates merkle root from target hash and proof, then compare to merkle root in VC
    return checkProof(vc.proof.proofs, vc.proof.merkleRoot, vc.proof.targetHash);
  } catch (error: unknown) {
    if (error instanceof SaltNotFoundError) {
      return false;
    }
    throw error;
  }
};
