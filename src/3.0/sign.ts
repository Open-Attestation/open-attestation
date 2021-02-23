import {
  OpenAttestationDocument,
  SignedWrappedDocument,
  VerifiableCredentialProofSigned,
  WrappedDocument
} from "./types";
import { sign } from "../shared/signer";
import { SigningKey, SUPPORTED_SIGNING_ALGORITHM } from "../shared/@types/sign";
import { isSignedWrappedV3Document } from "../shared/utils";

export const signDocument = async <T extends OpenAttestationDocument>(
  document: SignedWrappedDocument<T> | WrappedDocument<T>,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  publicKey: string,
  privateKey: string
): Promise<SignedWrappedDocument<T>> => {
  if (isSignedWrappedV3Document(document)) throw new Error("Document has been signed");
  const signingKey: SigningKey = { private: privateKey, public: publicKey };
  const merkleRoot = `0x${document.proof.merkleRoot}`;
  const signature = await sign(algorithm, merkleRoot, signingKey);
  const proof: VerifiableCredentialProofSigned = {
    ...document.proof,
    key: publicKey,
    signature
  };
  return { ...document, proof };
};
