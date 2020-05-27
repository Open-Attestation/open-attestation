import { get } from "lodash";
import { keccak256 } from "js-sha3";
import { digestDocument } from "./digest";
import { hashToBuffer, bufSortJoin } from "../shared/utils";
import { WrappedDocument } from "../shared/@types/document";

export const verify = <T = any>(document: any): document is WrappedDocument<T> => {
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
    return keccak256(combineAsBuffer);
  }, digest);

  return calculatedMerkleRoot === merkleRoot;
};
