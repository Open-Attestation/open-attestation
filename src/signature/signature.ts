import { get } from "lodash";
import { keccak256 } from "ethereumjs-util";
import { digestDocument } from "../digest";
import { MerkleTree } from "./merkle";
import { hashToBuffer, bufSortJoin } from "../utils";
import { SignedDocument, UnsignedDocument } from "../privacy";

export const sign = (document: UnsignedDocument, batch?: string[]) => {
  const digest = digestDocument(document);

  if (batch && !batch.includes(digest)) {
    throw new Error("Document is not in batch");
  }

  const batchBuffers = (batch || [digest]).map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));

  return Object.assign({}, document, {
    signature: {
      type: "SHA3MerkleProof",
      targetHash: digest,
      proof: merkleProof,
      merkleRoot
    }
  });
};

export const verify = (document: any): document is SignedDocument => {
  const signature = get(document, "signature");
  if (!signature) {
    return false;
  }

  // Checks target hash
  const digest = digestDocument(document);
  const targetHash: string = get(document, "signature.targetHash");
  if (digest !== targetHash) return false;

  // Calculates merkle root from target hash and proof, then compare to merkle root in document
  const merkleRoot = get(document, "signature.merkleRoot");
  const proof: string[] = get(document, "signature.proof", []);
  const calculatedMerkleRoot = proof.reduce((prev, current) => {
    const prevAsBuffer = hashToBuffer(prev);
    const currAsBuffer = hashToBuffer(current);
    const combineAsBuffer = bufSortJoin(prevAsBuffer, currAsBuffer);
    const newBuffer = keccak256(combineAsBuffer);
    return newBuffer.toString("hex");
  }, digest);

  return calculatedMerkleRoot === merkleRoot;
};
