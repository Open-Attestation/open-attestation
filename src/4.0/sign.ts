import { sign } from "../shared/signer";
import { SigningKey, SUPPORTED_SIGNING_ALGORITHM } from "../shared/@types/sign";
import { isSignedWrappedV4Document } from "../shared/utils";
import { ethers } from "ethers";
import { V4Document, V4WrappedDocument, V4SignedWrappedDocument } from "./types";

export const signDocument = async <T extends V4Document>(
  document: V4SignedWrappedDocument<T> | V4WrappedDocument<T>,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  keyOrSigner: SigningKey | ethers.Signer
): Promise<V4SignedWrappedDocument<T>> => {
  if (isSignedWrappedV4Document(document)) throw new Error("Document has been signed");
  const merkleRoot = `0x${document.proof.merkleRoot}`;
  const signature = await sign(algorithm, merkleRoot, keyOrSigner);
  const proof: V4SignedWrappedDocument["proof"] = {
    ...document.proof,
    key: SigningKey.guard(keyOrSigner) ? keyOrSigner.public : `did:ethr:${await keyOrSigner.getAddress()}#controller`,
    signature,
  };
  return { ...document, proof };
};
