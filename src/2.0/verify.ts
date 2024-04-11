import { get } from "lodash";
import { digestDocument } from "./digest";
import { OpenAttestationDocument } from "../__generated__/schema.2.0";
import { WrappedDocument } from "./types";
import { checkProof } from "../shared/merkle";

export const verify = <T extends OpenAttestationDocument = OpenAttestationDocument>(
  document: any,
): document is WrappedDocument<T> => {
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
