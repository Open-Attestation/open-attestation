import Ajv from "ajv";
import { digestDocument } from "./digest";
import { getSchema, validateSchema as validate } from "./schema";
import { wrap } from "./signature";
import { SchematisedDocument, WrappedDocument } from "./@types/document";
import { saltData } from "./privacy/salt";
import * as utils from "./utils";
import { setData } from "./privacy";
import * as v2 from "./__generated__/schemaV2";
import * as v3 from "./__generated__/schemaV3";

interface IssueDocumentOption {
  externalSchemaId?: string;
  version?: "open-attestation/2.0" | "open-attestation/3.0";
}
const defaultVersion = "open-attestation/2.0";

const createDocument = (data: any, option?: IssueDocumentOption) => {
  const documentSchema: SchematisedDocument = {
    version: option?.version ?? defaultVersion,
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore SchematisedDocument is not completely correct and causes typescript to complain here ... we need to have a better look on what's really SchematisedDocument is.
    data: null
  };
  if (option?.externalSchemaId) {
    documentSchema.schema = option.externalSchemaId;
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

export const issueDocument = <T = unknown>(data: T, options?: IssueDocumentOption): WrappedDocument<T> => {
  const document: SchematisedDocument = createDocument(data, options);
  const errors = validate(document, getSchema(options?.version ?? defaultVersion));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, document);
  }
  return wrap(document, [digestDocument(document)]);
};

export const issueDocuments = <T = unknown>(dataArray: T[], options?: IssueDocumentOption): WrappedDocument<T>[] => {
  const documents = dataArray.map(data => createDocument(data, options));
  documents.forEach(document => {
    const errors = validate(document, getSchema(options?.version ?? defaultVersion));
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
