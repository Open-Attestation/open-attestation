import { digestDocument } from "./digest";
import { MerkleTree } from "../shared/merkle";
import { hashToBuffer, SchemaValidationError } from "../shared/utils";
import { SchemaId } from "../shared/@types/document";
import { SchematisedDocument, Signature, WrappedDocument } from "./types";
import { OpenAttestationDocument } from "../__generated__/schema.2.0";
import { validateSchema as validate } from "../shared/validate";
import { saltData } from "./salt";
import { WrapDocumentOption, WrapDocumentOptionV2 } from "../shared/@types/wrap";
import { getSchema } from "../shared/ajv";

const createDocument = <T extends OpenAttestationDocument = OpenAttestationDocument>(
  data: any,
  option?: WrapDocumentOption
): SchematisedDocument<T> => {
  const documentSchema: SchematisedDocument<T> = {
    version: SchemaId.v2,
    data: saltData(data),
  };
  if (option?.externalSchemaId) {
    documentSchema.schema = option.externalSchemaId;
  }
  return documentSchema;
};

export const wrapDocument = <T extends OpenAttestationDocument = OpenAttestationDocument>(
  data: T,
  options?: WrapDocumentOptionV2
): WrappedDocument<T> => {
  const document: SchematisedDocument<T> = createDocument(data, options);
  const errors = validate(document, getSchema(options?.version ?? SchemaId.v2));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, document);
  }
  const digest = digestDocument(document);

  const signature: Signature = {
    type: "SHA3MerkleProof",
    targetHash: digest,
    proof: [],
    merkleRoot: digest,
  };

  return { ...document, signature };
};

export const wrapDocuments = <T extends OpenAttestationDocument = OpenAttestationDocument>(
  data: T[],
  options?: WrapDocumentOptionV2
): WrappedDocument<T>[] => {
  // wrap documents individually
  const documents = data.map((d) => wrapDocument(d, options));

  // get all the target hashes to compute the merkle tree and the merkle root
  const merkleTree = new MerkleTree(documents.map((document) => document.signature.targetHash).map(hashToBuffer));
  const merkleRoot = merkleTree.getRoot().toString("hex");

  // for each document, update the merkle root and add the proofs needed
  return documents.map((document) => {
    const merkleProof = merkleTree
      .getProof(hashToBuffer(document.signature.targetHash))
      .map((buffer: Buffer) => buffer.toString("hex"));
    return {
      ...document,
      signature: {
        ...document.signature,
        proof: merkleProof,
        merkleRoot,
      },
    };
  });
};
