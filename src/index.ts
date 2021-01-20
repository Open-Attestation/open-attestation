import { getSchema, validateSchema as validate } from "./shared/validate";
import { verify } from "./2.0/verify";
import { verify as verifyV3 } from "./3.0/verify";
import { wrapDocument as wrapDocumentV2, wrapDocuments as wrapDocumentsV2 } from "./2.0/wrap";
import { WrappedDocument as WrappedDocumentV2 } from "./2.0/types";
import { WrappedDocument as WrappedDocumentV3 } from "./3.0/types";
import { wrapDocument as wrapDocumentV3, wrapDocuments as wrapDocumentsV3 } from "./3.0/wrap";
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

// eslint-disable-next-line @typescript-eslint/camelcase
export function __unsafe__use__it__at__your__own__risks__wrapDocument<T extends OpenAttestationDocumentV3>(
  data: T,
  options?: WrapDocumentOptionV3
): Promise<WrappedDocumentV3<T>> {
  return wrapDocumentV3(data, options ?? { version: SchemaId.v3 });
}

// eslint-disable-next-line @typescript-eslint/camelcase
export function __unsafe__use__it__at__your__own__risks__wrapDocuments<T extends OpenAttestationDocumentV3>(
  dataArray: T[],
  options?: WrapDocumentOptionV3
): Promise<WrappedDocumentV3<T>[]> {
  return wrapDocumentsV3(dataArray, options ?? { version: SchemaId.v3 });
}

export function wrapDocument<T extends OpenAttestationDocumentV2>(
  data: T,
  options?: WrapDocumentOptionV2
): WrappedDocumentV2<T> {
  return wrapDocumentV2(data, { externalSchemaId: options?.externalSchemaId });
}

export function wrapDocuments<T extends OpenAttestationDocumentV2>(
  dataArray: T[],
  options?: WrapDocumentOptionV2
): WrappedDocumentV2<T>[] {
  return wrapDocumentsV2(dataArray, { externalSchemaId: options?.externalSchemaId });
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

export { digestDocument } from "./2.0/digest";
export { digestCredential } from "./3.0/digest";
export { checkProof, MerkleTree } from "./shared/merkle";
export { obfuscate as obfuscateDocument };
export { utils };
export * from "./shared/@types/document";
export { getData } from "./shared/utils"; // keep it to avoid breaking change, moved from privacy to utils
export { v2 };
export { v3 };
