import { digestDocument as digestDocumentV2 } from "./digest";
import { MerkleTree } from "../shared/merkle";
import { hashToBuffer } from "../shared/utils";
import { SchematisedDocument, Signature, WrappedDocument } from "../shared/@types/document";
import { OpenAttestationDocument } from "../__generated__/schemaV2";

export const wrap = <T = OpenAttestationDocument>(
  document: SchematisedDocument<T>,
  batch?: string[]
): WrappedDocument<T> => {
  const digest = digestDocumentV2(document);

  if (batch && !batch.includes(digest)) {
    throw new Error("Document is not in batch");
  }

  const batchBuffers = (batch || [digest]).map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));

  const signature: Signature = {
    type: "SHA3MerkleProof",
    targetHash: digest,
    proof: merkleProof,
    merkleRoot
  };

  return { ...document, signature };
};
