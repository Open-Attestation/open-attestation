import Ajv from "ajv";
import { digestDocument } from "./digest";
import { getSchema, validateSchema as validate } from "./schema";
import { wrap } from "./signature";
import {
  ProofPurpose,
  ProofType,
  SchemaId,
  SchematisedDocument,
  SignedWrappedDocument,
  WrappedDocument
} from "./@types/document";
import { saltData } from "./privacy/salt";
import * as utils from "./utils";
import * as v2 from "./__generated__/schemaV2";
import * as v3 from "./__generated__/schemaV3";

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

export const wrapDocument = <T = unknown>(data: T, options?: WrapDocumentOption): WrappedDocument<T> => {
  const document: SchematisedDocument = createDocument(data, options);
  const errors = validate(document, getSchema(options?.version ?? defaultVersion));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, document);
  }
  return wrap(document, [digestDocument(document)]);
};

export const wrapDocuments = <T = unknown>(dataArray: T[], options?: WrapDocumentOption): WrappedDocument<T>[] => {
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
  return validate(document, getSchema(`${document?.version || SchemaId.v2}`)).length === 0;
};

interface SignOptions {
  disableLint: boolean;
}

export function sign<T = v2.OpenAttestationDocument>(
  document: WrappedDocument<T>,
  options: SignOptions
): SignedWrappedDocument<T> {
  if (!options.disableLint) {
    throw new Error("BOOOM");
  }
  // TODO
  return {
    ...document,
    proof: {
      type: ProofType.EcdsaSecp256k1Signature2019,
      created: new Date().toISOString(),
      proofPurpose: ProofPurpose.AssertionMethod,
      publicKey: "0x44E682d207bcDDDAD0Bb3a650cCb9de0911B9D3A#owner",
      signature:
        "0x49898c7ded0bef0e3fb96b3f69b097dda45a474c62142d72a0834d814c092cbe458a16f44efe136614e74ffd69b8273688af347826b9efaccd6a12f200185eef1c"
    }
  };
}

export { digestDocument } from "./digest";
export { obfuscateDocument } from "./privacy";
export { checkProof, MerkleTree, wrap, verify as verifySignature } from "./signature";
export { utils, isSchemaValidationError };
export * from "./@types/document";
export * from "./schema/3.0/w3c";
export { getData } from "./utils"; // keep it to avoid breaking change, moved from privacy to utils
export { v2 };
export { v3 };
