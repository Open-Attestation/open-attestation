import { getSchema, validateSchema as validate } from "./shared/validate";
import { verify } from "./2.0/verify";
import { verify as verifyV3 } from "./3.0/verify";
import { wrapDocument as wrapV2Document, wrapDocuments as wrapV2Documents } from "./2.0/wrap";
import { signDocument as signV2Document } from "./2.0/sign";
import { WrappedDocument as WrappedDocumentV2 } from "./2.0/types";
import { WrappedDocument as WrappedDocumentV3 } from "./3.0/types";
import { wrapDocument as wrapV3Document, wrapDocuments as wrapV3Documents } from "./3.0/wrap";
import { signDocument as signV3Document } from "./3.0/sign";
import { SchemaId, WrappedDocument, OpenAttestationDocument } from "./shared/@types/document";
import * as utils from "./shared/utils";
import * as v2 from "./2.0/types";
import { OpenAttestationDocument as OpenAttestationDocumentV2 } from "./__generated__/schema.2.0";
import * as v3 from "./3.0/types";
import { OpenAttestationDocument as OpenAttestationDocumentV3 } from "./__generated__/schema.3.0";
import { obfuscateDocument as obfuscateDocumentV2 } from "./2.0/obfuscate";
import { obfuscateVerifiableCredential } from "./3.0/obfuscate";
import { WrapDocumentOptionV2, WrapDocumentOptionV3 } from "./shared/@types/wrap";
import { SchemaValidationError } from "./shared/utils";
import { SUPPORTED_SIGNING_ALGORITHM } from "./shared/@types/sign";

// eslint-disable-next-line @typescript-eslint/camelcase
export function __unsafe__use__it__at__your__own__risks__wrapDocument<T extends OpenAttestationDocumentV3>(
  data: T,
  options?: WrapDocumentOptionV3
): Promise<WrappedDocumentV3<T>> {
  return wrapV3Document(data, options ?? { version: SchemaId.v3 });
}

// eslint-disable-next-line @typescript-eslint/camelcase
export function __unsafe__use__it__at__your__own__risks__wrapDocuments<T extends OpenAttestationDocumentV3>(
  dataArray: T[],
  options?: WrapDocumentOptionV3
): Promise<WrappedDocumentV3<T>[]> {
  return wrapV3Documents(dataArray, options ?? { version: SchemaId.v3 });
}

export function wrapDocument<T extends OpenAttestationDocumentV2>(
  data: T,
  options?: WrapDocumentOptionV2
): WrappedDocumentV2<T> {
  return wrapV2Document(data, { externalSchemaId: options?.externalSchemaId });
}

export function wrapDocuments<T extends OpenAttestationDocumentV2>(
  dataArray: T[],
  options?: WrapDocumentOptionV2
): WrappedDocumentV2<T>[] {
  return wrapV2Documents(dataArray, { externalSchemaId: options?.externalSchemaId });
}

export const validateSchema = (document: WrappedDocument<any>): boolean => {
  return validate(document, getSchema(`${document?.version || SchemaId.v2}`)).length === 0;
};

export function verifySignature<T extends WrappedDocument<OpenAttestationDocument>>(document: T) {
  return utils.isWrappedV3Document(document) ? verifyV3(document) : verify(document);
}

export function obfuscate<T extends OpenAttestationDocumentV2>(
  document: WrappedDocument<T>,
  fields: string[] | string
): WrappedDocument<T>;
export function obfuscate<T extends OpenAttestationDocumentV3>(
  document: WrappedDocument<T>,
  fields: string[] | string
): WrappedDocument<T>;
export function obfuscate(document: any, fields: string[] | string) {
  return document.version === SchemaId.v3
    ? obfuscateVerifiableCredential(document, fields)
    : obfuscateDocumentV2(document, fields);
}

export const isSchemaValidationError = (error: any): error is SchemaValidationError => {
  return !!error.validationErrors;
};

export async function signDocument<T extends v3.OpenAttestationDocument>(
  document: v3.SignedWrappedDocument<T> | v3.WrappedDocument<T>,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  publicKey: string,
  privateKey: string
): Promise<v3.SignedWrappedDocument<T>>;
export async function signDocument<T extends v2.OpenAttestationDocument>(
  document: v2.SignedWrappedDocument<T> | v2.WrappedDocument<T>,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  publicKey: string,
  privateKey: string
): Promise<v2.SignedWrappedDocument<T>>;
export async function signDocument(
  document: any,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  publicKey: string,
  privateKey: string
) {
  switch (true) {
    case utils.isWrappedV2Document(document):
      return signV2Document(document, algorithm, publicKey, privateKey);
    case utils.isWrappedV3Document(document):
      return signV3Document(document, algorithm, publicKey, privateKey);
    default:
      // Unreachable code atm until utils.isWrappedV2Document & utils.isWrappedV3Document becomes more strict
      throw new Error("Unsupported document type: Only OpenAttestation v2 & v3 documents can be signed");
  }
}

export { digestDocument } from "./2.0/digest";
export { digestCredential } from "./3.0/digest";
export { checkProof, MerkleTree } from "./shared/merkle";
export { obfuscate as obfuscateDocument };
export { utils };
export * from "./shared/@types/document";
export { getData } from "./shared/utils"; // keep it to avoid breaking change, moved from privacy to utils
export { v2 };
export { v3 };
