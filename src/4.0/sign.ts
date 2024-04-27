import { sign } from "../shared/signer";
import { SigningKey, SUPPORTED_SIGNING_ALGORITHM } from "../shared/@types/sign";
import { ethers } from "ethers";
import { V4Document, V4WrappedDocument, V4SignedWrappedDocument } from "./types";

export const signDocument = async <T extends V4Document>(
  document: V4SignedWrappedDocument<T> | V4WrappedDocument<T>,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  keyOrSigner: SigningKey | ethers.Signer
): Promise<V4SignedWrappedDocument<T>> => {
  const parsedResults = V4WrappedDocument.pick({ proof: true }).passthrough().safeParse(document);
  if (!parsedResults.success) {
    throw new Error("Document has not been properly wrapped " + JSON.stringify(parsedResults.error));
  }
  const { proof: validatedProof } = parsedResults.data;
  const merkleRoot = `0x${validatedProof.merkleRoot}`;
  const signature = await sign(algorithm, merkleRoot, keyOrSigner);
  const proof: V4SignedWrappedDocument["proof"] = {
    ...validatedProof,
    key: SigningKey.guard(keyOrSigner) ? keyOrSigner.public : `did:ethr:${await keyOrSigner.getAddress()}#controller`,
    signature,
  };
  return { ...document, proof };
};
