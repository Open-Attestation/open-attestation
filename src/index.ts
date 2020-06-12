import { getSchema, validateSchema as validate } from "./shared/validate";
import { verify } from "./2.0/verify";
import { verify as verifyV3 } from "./3.0/verify";
import { wrapDocument as wrapDocumentV2, wrapDocuments as wrapDocumentsV2 } from "./2.0/wrap";
import { wrapDocument as wrapDocumentV3, wrapsDocuments as wrapDocumentsV3 } from "./3.0/wrap";
import { OpenAttestationVerifiableCredential, SchemaId, WrappedDocument } from "./shared/@types/document";
import * as utils from "./shared/utils";
import * as v2 from "./__generated__/schema.2.0";
import { OpenAttestationDocument } from "./__generated__/schema.2.0";
import * as v3 from "./__generated__/schema.3.0";
import { OpenAttestationCredential } from "./__generated__/schema.3.0";
import { obfuscateDocument as obfuscateDocumentV2 } from "./2.0/obfuscate";
import { obfuscateDocument as obfuscateDocumentV3 } from "./3.0/obfuscate";
import {
  isWrapDocumentOptionV3,
  WrapDocumentOption,
  WrapDocumentOptionV2,
  WrapDocumentOptionV3
} from "./shared/@types/wrap";

export async function wrapDocument<T extends OpenAttestationDocument>(
  data: T,
  options?: WrapDocumentOptionV2
): Promise<WrappedDocument<T>>;
export async function wrapDocument<T extends OpenAttestationCredential>(
  data: T,
  options?: WrapDocumentOptionV3
): Promise<OpenAttestationVerifiableCredential<T>>;
export async function wrapDocument<T extends any>(data: T, options?: WrapDocumentOption): Promise<any> {
  if (isWrapDocumentOptionV3(options)) {
    return wrapDocumentV3(data as OpenAttestationCredential, options);
  } else {
    return wrapDocumentV2(data, { externalSchemaId: options?.externalSchemaId });
  }
}

export function wrapDocuments<T extends OpenAttestationDocument>(
  dataArray: T[],
  options?: WrapDocumentOptionV2
): Promise<WrappedDocument<T>>[];
export function wrapDocuments<T extends OpenAttestationCredential>(
  dataArray: T[],
  options?: WrapDocumentOptionV3
): Promise<OpenAttestationVerifiableCredential<T>[]>;
export function wrapDocuments<T extends any>(dataArray: T[], options?: WrapDocumentOption): any {
  if (isWrapDocumentOptionV3(options)) {
    return wrapDocumentsV3(dataArray as OpenAttestationCredential[], options);
  } else {
    return wrapDocumentsV2(dataArray, { externalSchemaId: options?.externalSchemaId });
  }
}

export const validateSchema = (document: WrappedDocument | OpenAttestationVerifiableCredential<any>): boolean => {
  return validate(document, getSchema(`${document?.version || SchemaId.v2}`)).length === 0;
};

export function verifySignature<T = any>(document: any): document is WrappedDocument<T>;
export function verifySignature<T extends OpenAttestationVerifiableCredential<OpenAttestationCredential>>(
  document: T
): document is OpenAttestationVerifiableCredential<T>;
export function verifySignature(document: any) {
  return document.version === SchemaId.v3 ? verifyV3(document) : verify(document);
}

export function obfuscate<T = any>(document: WrappedDocument<T>, fields: string[] | string): WrappedDocument<T>;
export function obfuscate<T extends OpenAttestationVerifiableCredential<OpenAttestationCredential>>(
  document: T,
  fields: string[] | string
): T;
export function obfuscate(document: any, fields: string[] | string) {
  return document.version === SchemaId.v3
    ? obfuscateDocumentV3(document, fields)
    : obfuscateDocumentV2(document, fields);
}

export { digestDocument as digestDocumentV2 } from "./2.0/digest";
export { digestDocument as digestDocumentV3 } from "./3.0/digest";
export { checkProof, MerkleTree } from "./shared/merkle";
export { obfuscate as obfuscateDocument };
export { sign } from "./2.0/sign";
export { utils };
export * from "./shared/@types/document";
export { getData } from "./shared/utils"; // keep it to avoid breaking change, moved from privacy to utils
export { v2 };
export { v3 };
