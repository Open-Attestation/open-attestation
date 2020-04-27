import Ajv from "ajv";
import { digestDocument } from "./digest";
import { getSchema, validateSchema as validate } from "./schema";
import { verify, wrap } from "./signature";
import { SchemaId, SchematisedDocument, VerifiableCredential, WrappedDocument } from "./@types/document";
import { saltData } from "./privacy/salt";
import * as utils from "./utils";
import * as v2 from "./__generated__/schemaV2";
import * as v3 from "./__generated__/schemaV3";
import { OpenAttestationDocument } from "./__generated__/schemaV3";
import { obfuscateV3, verifyV3, wrapsV3, wrapV3 } from "./signature/signature.v3";
import { obfuscateDocument } from "./privacy";

interface WrapDocumentOption {
  externalSchemaId?: string;
  version?: SchemaId;
}
const defaultVersion = SchemaId.v2;

const createDocument = (data: any, option?: WrapDocumentOption) => {
  const documentSchema: SchematisedDocument = {
    version: option?.version ?? defaultVersion,
    data: saltData(data)
  };
  if (option?.externalSchemaId) {
    documentSchema.schema = option.externalSchemaId;
  }
  return documentSchema;
};

class SchemaValidationError extends Error {
  constructor(message: string, public validationErrors: Ajv.ErrorObject[], public document: any) {
    super(message);
  }
}
const isSchemaValidationError = (error: any): error is SchemaValidationError => {
  return !!error.validationErrors;
};

interface WrapDocumentOptionV2 {
  externalSchemaId?: string;
  version?: SchemaId.v2;
}
interface WrapDocumentOptionV3 {
  externalSchemaId?: string;
  version?: SchemaId.v3;
}

export function wrapDocument<T = unknown>(data: T, options?: WrapDocumentOptionV2): WrappedDocument<T>;
export function wrapDocument<T extends OpenAttestationDocument>(
  data: T,
  options?: WrapDocumentOptionV3
): VerifiableCredential<T>;
export function wrapDocument<T = unknown>(data: T, options?: WrapDocumentOption): any {
  if (options?.version === SchemaId.v3) {
    const wrappedDocument = options.externalSchemaId
      ? wrapV3({ schema: options.externalSchemaId, version: SchemaId.v3, ...data })
      : wrapV3({ version: SchemaId.v3, ...data });
    const errors = validate(wrappedDocument, getSchema(SchemaId.v3));
    if (errors.length > 0) {
      console.log(errors);
      throw new SchemaValidationError("Invalid document", errors, wrappedDocument);
    }
    return wrappedDocument;
  }
  const document: SchematisedDocument = createDocument(data, options);
  const errors = validate(document, getSchema(options?.version ?? defaultVersion));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, document);
  }
  return wrap(document, [digestDocument(document)]);
}

export function wrapDocuments<T = unknown>(dataArray: T[], options?: WrapDocumentOptionV2): WrappedDocument<T>[];
export function wrapDocuments<T extends OpenAttestationDocument>(
  dataArray: T[],
  options?: WrapDocumentOptionV3
): VerifiableCredential<T>[];
export function wrapDocuments<T>(dataArray: T[], options?: WrapDocumentOption): any {
  if (options?.version === SchemaId.v3) {
    const documents = dataArray.map(data => {
      return options.externalSchemaId
        ? { schema: options.externalSchemaId, version: SchemaId.v3, ...data }
        : { version: SchemaId.v3, ...data };
    });
    const wrappedDocument = wrapsV3(documents);
    wrappedDocument.forEach(document => {
      const errors = validate(document, getSchema(options?.version ?? defaultVersion));
      if (errors.length > 0) {
        throw new SchemaValidationError("Invalid document", errors, document);
      }
    });
    return wrappedDocument;
  }
  const documents = dataArray.map(data => createDocument(data, options));
  documents.forEach(document => {
    const errors = validate(document, getSchema(options?.version ?? defaultVersion));
    if (errors.length > 0) {
      throw new SchemaValidationError("Invalid document", errors, document);
    }
  });

  const batchHashes = documents.map(digestDocument);
  return documents.map(doc => wrap(doc, batchHashes));
}

export const validateSchema = (document: WrappedDocument | VerifiableCredential<any>): boolean => {
  return validate(document, getSchema(`${document?.version || SchemaId.v2}`)).length === 0;
};

export function verifySignature<T = any>(document: any): document is WrappedDocument<T>;
export function verifySignature<T extends VerifiableCredential<OpenAttestationDocument>>(
  document: T
): document is VerifiableCredential<T>;
export function verifySignature(document: any) {
  return document.version === SchemaId.v3 ? verifyV3(document) : verify(document);
}

export function obfuscate<T = any>(document: WrappedDocument<T>, fields: string[] | string): WrappedDocument<T>;
export function obfuscate<T extends VerifiableCredential<OpenAttestationDocument>>(
  document: T,
  fields: string[] | string
): T;
export function obfuscate(document: any, fields: string[] | string) {
  return document.version === SchemaId.v3 ? obfuscateV3(document, fields) : obfuscateDocument(document, fields);
}

export { digestDocument } from "./digest";
export { checkProof, MerkleTree } from "./signature";
export { utils, isSchemaValidationError };
export * from "./@types/document";
export * from "./schema/3.0/w3c";
export { getData } from "./utils"; // keep it to avoid breaking change, moved from privacy to utils
export { v2 };
export { v3 };
