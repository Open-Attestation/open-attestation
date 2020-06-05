import { get } from "lodash";
import { digestDocument } from "./digest";
import { WrappedDocument } from "../shared/@types/document";
import { checkProof } from "../shared/merkle";

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
  return checkProof(document?.signature?.proof ?? [], document?.signature?.merkleRoot, document?.signature?.targetHash);
};
