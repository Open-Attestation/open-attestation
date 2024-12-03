import { Signer } from "@ethersproject/abstract-signer";

import { sign } from "../shared/signer";
import { SigningKey } from "../shared/@types/sign";
import { digestVc } from "./digest";
import { Digested, OAVerifiableCredential, W3cVerifiableCredential, Signed } from "./types";

export const signVc = async <T extends OAVerifiableCredential | W3cVerifiableCredential>(
  unsignedVc: T,
  algorithm: "Secp256k1VerificationKey2018",
  keyOrSigner: SigningKey | Signer
): Promise<Signed<T>> => {
  /* 1. Input VC needs to be digested first */
  let validatedProof: Digested["proof"];
  if (!unsignedVc.proof) {
    const digestedVc = await digestVc(unsignedVc);
    validatedProof = digestedVc.proof;
  } else {
    // Do not accept a VC that already has proof object defined
    throw new VcProofNotEmptyError(new Error("Either an unsigned or undigested VC must be provided"));
  }

  const merkleRoot = `0x${validatedProof.merkleRoot}`;

  /* 2. Check if input keyOrSigner is valid */
  if (!SigningKey.guard(keyOrSigner) && keyOrSigner.signMessage === undefined) {
    throw new Error(`Either a keypair or ethers.js Signer must be provided`);
  }

  /* 3. Perform signing */
  try {
    const signature = await sign(algorithm, merkleRoot, keyOrSigner);
    const proof: Signed["proof"] = {
      ...validatedProof,
      key: "public" in keyOrSigner ? keyOrSigner.public : `did:ethr:${await keyOrSigner.getAddress()}#controller`,
      signature,
    };
    return { ...unsignedVc, proof } as Signed<T>;
  } catch (error) {
    throw new CouldNotSignVcError(error);
  }
};

class VcProofNotEmptyError extends Error {
  constructor(public error: unknown) {
    super(
      `VC has already has proof object defined:\n${
        error instanceof Error ? error.message : JSON.stringify(error, null, 2)
      }`
    );
    Object.setPrototypeOf(this, VcProofNotEmptyError.prototype);
  }
}

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
  VcProofNotEmptyError,
  CouldNotSignVcError,
};
