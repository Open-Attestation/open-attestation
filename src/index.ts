import Ajv from "ajv";
import { digestDocument } from "./digest";
import { getSchema, validateSchema as validate } from "./schema";
import { wrap } from "./signature";
import { SchematisedDocument, WrappedDocument } from "./@types/document";
import { saltData } from "./privacy/salt";
import * as utils from "./utils";
import openAttestationSchema from "./schema/3.0/schema.json";
import { setData } from "./privacy";
import * as v2 from "./__generated__/schemaV2";
import * as v3 from "./__generated__/schemaV3";

const createDocument = (data: any, schemaId?: string) => {
  const documentSchema: SchematisedDocument = {
    // throw error
    version: openAttestationSchema.$id,
    data: null
  };
  if (schemaId) {
    documentSchema.schema = schemaId;
  }
  return setData(documentSchema, saltData(data));
};

class SchemaValidationError extends Error {
  constructor(message: string, public validationErrors: Ajv.ErrorObject[], public document: any) {
    super(message);
  }
}
const isSchemaValidationError = (error: any): error is SchemaValidationError => {
  return !!error.validationErrors;
};

interface IssueDocumentOption {
  externalSchemaId?: string;
}
export const issueDocument = (
  data: unknown,
  options?: IssueDocumentOption
): WrappedDocument<v3.OpenAttestationDocument> => {
  const document: SchematisedDocument = createDocument(data, options?.externalSchemaId);
  const errors = validate(document, getSchema("open-attestation/3.0"));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, document);
  }
  return wrap(document, [digestDocument(document)]);
};

export const issueDocuments = (
  dataArray: unknown[],
  options?: IssueDocumentOption
): WrappedDocument<v3.OpenAttestationDocument>[] => {
  const documents = dataArray.map(data => createDocument(data, options?.externalSchemaId));
  documents.forEach(document => {
    const errors = validate(document, getSchema("open-attestation/3.0"));
    if (errors.length > 0) {
      throw new SchemaValidationError("Invalid document", errors, document);
    }
  });

  const batchHashes = documents.map(digestDocument);
  return documents.map(doc => wrap(doc, batchHashes));
};

export const validateSchema = (document: WrappedDocument): boolean => {
  return validate(document, getSchema(`${document?.version || "open-attestation/2.0"}`)).length === 0;
};

export { digestDocument } from "./digest";
export { getData, obfuscateDocument } from "./privacy";
export { checkProof, MerkleTree, wrap, verify as verifySignature } from "./signature";
export { utils, isSchemaValidationError };
export * from "./@types/document";
export * from "./schema/3.0/w3c";
export { v2 };
export { v3 };
