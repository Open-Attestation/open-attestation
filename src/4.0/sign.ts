import { sign } from "../shared/signer";
import { SigningKey } from "../shared/@types/sign";
import { Signer } from "@ethersproject/abstract-signer";
import { V4OpenAttestationDocument, V4WrappedDocument, V4SignedWrappedDocument } from "./types";
import type { ZodError } from "zod";

export const signVC = async <T extends V4OpenAttestationDocument>(
  document: V4SignedWrappedDocument<T> | V4WrappedDocument<T>,
  algorithm: "Secp256k1VerificationKey2018",
  keyOrSigner: SigningKey | Signer
): Promise<V4SignedWrappedDocument<T>> => {
  const parsedResults = V4WrappedDocument.pick({ proof: true }).passthrough().safeParse(document);
  if (!parsedResults.success) {
    throw new WrappedDocumentValidationError(parsedResults.error);
  }

  if (!SigningKey.guard(keyOrSigner) && keyOrSigner.signMessage === undefined) {
    throw new Error(`Either a keypair or ethers.js Signer must be provided`);
  }

  const { proof: validatedProof } = parsedResults.data;
  const merkleRoot = `0x${validatedProof.merkleRoot}`;

  try {
    const signature = await sign(algorithm, merkleRoot, keyOrSigner);
    const proof: V4SignedWrappedDocument["proof"] = {
      ...validatedProof,
      key: "public" in keyOrSigner ? keyOrSigner.public : `did:ethr:${await keyOrSigner.getAddress()}#controller`,
      signature,
    };
    return { ...document, proof };
  } catch (error) {
    throw new CouldNotSignDocumentError(error);
  }
};

class WrappedDocumentValidationError extends Error {
  constructor(public error: ZodError) {
    super(`Document has not been properly wrapped:\n${JSON.stringify(error.format(), null, 2)}`);
    Object.setPrototypeOf(this, WrappedDocumentValidationError.prototype);
  }
}

/**
 * Cases where this can be thrown includes: network error, invalid keys or signer
 */
class CouldNotSignDocumentError extends Error {
  constructor(public error: unknown) {
    super(`Could not sign document:\n${error instanceof Error ? error.message : JSON.stringify(error, null, 2)}`);
    Object.setPrototypeOf(this, CouldNotSignDocumentError.prototype);
  }
}

export const signDocumentErrors = {
  WrappedDocumentValidationError,
  CouldNotSignDocumentError,
};
