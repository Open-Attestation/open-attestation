import { get } from "lodash";
import { keccak256 } from "js-sha3";
import { digestDocumentV2 } from "../shared/digest";
import { MerkleTree } from "../shared/merkle";
import { hashToBuffer, bufSortJoin } from "../shared/utils";
import { SchematisedDocument, Signature, WrappedDocument } from "../shared/@types/document";
import { OpenAttestationDocument } from "../__generated__/schemaV3";

export const verify = <T = any>(document: any): document is WrappedDocument<T> => {
    const signature = get(document, "signature");
    if (!signature) {
      return false;
    }
  
    // Checks target hash
    const digest = digestDocumentV2(document);
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