import { Signer } from "@ethersproject/abstract-signer";

import { sign } from "../shared/signer";
import { SigningKey } from "../shared/@types/sign";
import { digestVc, wrapVcErrors } from "./digest";
import { OASigned, UnsignedW3cVerifiableCredential, UnsignedOAVerifiableCredential } from "./types";

export const signVc = async <T extends UnsignedW3cVerifiableCredential = UnsignedOAVerifiableCredential>(
  unsignedVc: T,
  algorithm: "Secp256k1VerificationKey2018",
  keyOrSigner: SigningKey | Signer
): Promise<OASigned<T>> => {
  /* 1. Input VC needs to be digested first */
  const digestedVc = await digestVc(unsignedVc);
  const validatedProof = digestedVc.proof;

  const merkleRoot = `0x${validatedProof.merkleRoot}`;

  /* 2. Check if input keyOrSigner is valid */
  if (!SigningKey.guard(keyOrSigner) && keyOrSigner.signMessage === undefined) {
    throw new Error(`Either a keypair or ethers.js Signer must be provided`);
  }

  /* 3. Perform signing */
  try {
    const signature = await sign(algorithm, merkleRoot, keyOrSigner);
    const proof: OASigned["proof"] = {
      ...validatedProof,
      key: "public" in keyOrSigner ? keyOrSigner.public : `did:ethr:${await keyOrSigner.getAddress()}#controller`,
      signature,
    };
    return { ...unsignedVc, proof } as OASigned<T>;
  } catch (error) {
    throw new CouldNotSignVcError(error);
  }
};

/**
 * Cases where this can be thrown includes: network error, invalid keys or signer
 */
class CouldNotSignVcError extends Error {
  constructor(public error: unknown) {
    super(`Could not sign VC:\n${error instanceof Error ? error.message : JSON.stringify(error, null, 2)}`);
    Object.setPrototypeOf(this, CouldNotSignVcError.prototype);
  }
}

export const signVcErrors = {
  CouldNotSignVcError,
  ...wrapVcErrors,
};
