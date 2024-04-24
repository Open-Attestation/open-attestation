import { sign } from "../shared/signer";
import { SigningKey } from "../shared/@types/sign";
import { isSignedWrappedV4Document } from "../shared/utils";
import { ethers } from "ethers";
import { V4RawDocument, V4WrappedDocument, V4SignedDocument } from "./types";

export const signDocument = async <T extends V4RawDocument>(
  document: V4SignedDocument<T> | V4WrappedDocument<T>,
  algorithm: "Secp256k1VerificationKey2018",
  keyOrSigner: SigningKey | ethers.Signer
): Promise<V4SignedDocument<T>> => {
  if (isSignedWrappedV4Document(document)) throw new Error("Document has been signed");

  const merkleRoot = `0x${document.proof.merkleRoot}`;
  const signature = await sign(algorithm, merkleRoot, keyOrSigner);
  const proof: V4SignedDocument["proof"] = {
    ...document.proof,
    key:
      keyOrSigner instanceof ethers.Signer
        ? `did:ethr:${await keyOrSigner.getAddress()}#controller`
        : keyOrSigner.public,
    signature,
  };
  return { ...document, proof };
};
