import {
  OpenAttestationDocument,
  SignedWrappedDocument,
  VerifiableCredentialSignedProof,
  WrappedDocument,
} from "./types";
import { sign } from "../shared/signer";
import { SigningKey, SUPPORTED_SIGNING_ALGORITHM } from "../shared/@types/sign";
import { isSignedWrappedV3Document } from "../shared/utils";
import { Signer } from "@ethersproject/abstract-signer";

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export const signDocument = async <T extends OpenAttestationDocument>(
  document: SignedWrappedDocument<T> | WrappedDocument<T>,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  keyOrSigner: SigningKey | Signer
): Promise<SignedWrappedDocument<T>> => {
  if (isSignedWrappedV3Document(document)) throw new Error("Document has been signed");
  const merkleRoot = `0x${document.proof.merkleRoot}`;
  const signature = await sign(algorithm, merkleRoot, keyOrSigner);
  const proof: VerifiableCredentialSignedProof = {
    ...document.proof,
    key: SigningKey.guard(keyOrSigner) ? keyOrSigner.public : `did:ethr:${await keyOrSigner.getAddress()}#controller`,
    signature,
  };
  return { ...document, proof };
};
