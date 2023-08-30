import { OpenAttestationDocument, WrappedDocument, SignedWrappedDocument, SignedWrappedProof } from "./types";
import { sign } from "../shared/signer";
import { SigningKey, SUPPORTED_SIGNING_ALGORITHM } from "../shared/@types/sign";
import { isSignedWrappedV4Document } from "../shared/utils";
import { ethers } from "ethers";

export const signDocument = async <T extends OpenAttestationDocument>(
  document: SignedWrappedDocument<T> | WrappedDocument<T>,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  keyOrSigner: SigningKey | ethers.Signer
): Promise<SignedWrappedDocument<T>> => {
  if (isSignedWrappedV4Document(document)) throw new Error("Document has been signed");
  const merkleRoot = `0x${document.proof.merkleRoot}`;
  const signature = await sign(algorithm, merkleRoot, keyOrSigner);
  const proof: SignedWrappedProof = {
    ...document.proof,
    key: SigningKey.guard(keyOrSigner) ? keyOrSigner.public : `did:ethr:${await keyOrSigner.getAddress()}#controller`,
    signature,
  };
  return { ...document, proof };
};
