const _ = require("lodash");
const { sha3 } = require("ethereumjs-util");
const { digestDocument } = require("../digest");
const { MerkleTree } = require("./merkle");
const { hashToBuffer, bufSortJoin } = require("../utils");

const sign = (document, batch) => {
  const digest = digestDocument(document);

  if (batch && !batch.includes(digest)) {
    throw new Error("Document is not in batch");
  }

  const batchBuffers = (batch || [digest]).map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree
    .getProof(hashToBuffer(digest))
    .map(buffer => buffer.toString("hex"));

  return {
    ...document,
    signature: {
      type: "SHA3MerkleProof",
      targetHash: digest,
      proof: merkleProof,
      merkleRoot
    }
  };
};

const verify = document => {
  const signature = _.get(document, "signature");
  if (!signature) {
    return false;
  }

  // Checks target hash
  const digest = digestDocument(document);
  const targetHash = _.get(document, "signature.targetHash");
  if (digest !== targetHash) return false;

  // Calculates merkle root from target hash and proof, then compare to merkle root in document
  const merkleRoot = _.get(document, "signature.merkleRoot");
  const proof = _.get(document, "signature.proof", []);
  const calculatedMerkleRoot = proof.reduce((prev, current) => {
    const prevAsBuffer = hashToBuffer(prev);
    const currAsBuffer = hashToBuffer(current);
    const combineAsBuffer = bufSortJoin(prevAsBuffer, currAsBuffer);
    const newBuffer = sha3(combineAsBuffer);
    return newBuffer.toString("hex");
  }, digest);

  return calculatedMerkleRoot === merkleRoot;
};

module.exports = {
  sign,
  verify
};
