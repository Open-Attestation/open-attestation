import { Signer } from "@ethersproject/abstract-signer";

import { getSchema } from "./shared/ajv";
import * as utils from "./shared/utils";
import { validateSchema as validate } from "./shared/validate";
import { SchemaId, WrappedDocument, OpenAttestationDocument, SignedWrappedDocument } from "./shared/@types/document";
import { WrapDocumentOptionV2, WrapDocumentOptionV3 } from "./shared/@types/wrap";
import { SigningKey, SUPPORTED_SIGNING_ALGORITHM } from "./shared/@types/sign";

import * as v2 from "./2.0/types";
import { WrappedDocument as WrappedDocumentV2 } from "./2.0/types";
import { wrapDocument as wrapDocumentV2, wrapDocuments as wrapDocumentsV2 } from "./2.0/wrap";
import { signDocument as signDocumentV2 } from "./2.0/sign";
import { verify } from "./2.0/verify";
import { obfuscateDocument as obfuscateDocumentV2 } from "./2.0/obfuscate";
import { OpenAttestationDocument as OpenAttestationDocumentV2 } from "./__generated__/schema.2.0";

import * as v3 from "./3.0/types";
import { WrappedDocument as WrappedDocumentV3 } from "./3.0/types";
import { wrapDocument as wrapDocumentV3, wrapDocuments as wrapDocumentsV3 } from "./3.0/wrap";
import { signDocument as signDocumentV3 } from "./3.0/sign";
import { verify as verifyV3 } from "./3.0/verify";
import { digestCredential as digestCredentialV3 } from "./3.0/digest";
import { obfuscateVerifiableCredential as obfuscateVerifiableCredentialV3 } from "./3.0/obfuscate";
import { OpenAttestationDocument as OpenAttestationDocumentV3 } from "./__generated__/schema.3.0";

import * as v4 from "./4.0/exports";

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

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/beta)
 */
export function __unsafe__use__it__at__your__own__risks__wrapDocument<T extends OpenAttestationDocumentV3>(
  data: T,
  options?: WrapDocumentOptionV3
): Promise<WrappedDocumentV3<T>> {
  return wrapDocumentV3(data, options ?? { version: SchemaId.v3 });
}

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/beta)
 */
export function __unsafe__use__it__at__your__own__risks__wrapDocuments<T extends OpenAttestationDocumentV3>(
  dataArray: T[],
  options?: WrapDocumentOptionV3
): Promise<WrappedDocumentV3<T>[]> {
  return wrapDocumentsV3(dataArray, options ?? { version: SchemaId.v3 });
}

export const validateSchema = (document: WrappedDocument<any>): boolean => {
  if (utils.isWrappedV2Document(document) || document?.version === SchemaId.v2)
    return validate(document, getSchema(SchemaId.v2)).length === 0;
  else if (utils.isWrappedV3Document(document) || document?.version === SchemaId.v3)
    return validate(document, getSchema(SchemaId.v3)).length === 0;

  return validate(document, getSchema(`${document?.version || SchemaId.v2}`)).length === 0;
};

export function verifySignature<T extends WrappedDocument<OpenAttestationDocument>>(document: T) {
  if (utils.isWrappedV2Document(document)) return verify(document);
  else if (utils.isWrappedV3Document(document)) return verifyV3(document);

  throw new Error(
    "Unsupported document type: Only OpenAttestation v2 or v3 documents can be signature verified with this function"
  );
}

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/beta)
 */
export function digest(document: OpenAttestationDocumentV3, salts: v3.Salt[], obfuscatedData: string[]): string {
  if (utils.isRawV3Document(document)) return digestCredentialV3(document, salts, obfuscatedData);
  throw new Error(
    "Unsupported credential type: This function only supports digest generation for OpenAttestation v3 credentials"
  );
}

export function obfuscate<T extends WrappedDocument<OpenAttestationDocument>>(
  document: T,
  fields: string[] | string
): T {
  if (utils.isWrappedV2Document(document)) return obfuscateDocumentV2(document, fields) as T;
  else if (utils.isWrappedV3Document(document)) {
    return obfuscateVerifiableCredentialV3(document, fields) as T;
  }

  throw new Error(
    "Unsupported document type: Only OpenAttestation v2 or v3 documents can be obfuscated with this function"
  );
}

export async function signDocument<T extends v2.OpenAttestationDocument | v3.OpenAttestationDocument>(
  document: WrappedDocument<T> | SignedWrappedDocument<T>,
  algorithm: SUPPORTED_SIGNING_ALGORITHM,
  keyOrSigner: SigningKey | Signer
): Promise<SignedWrappedDocument<T>> {
  // rj was worried it could happen deep in the code, so I moved it to the boundaries
  if (!SigningKey.guard(keyOrSigner) && !Signer.isSigner(keyOrSigner)) {
    throw new Error(`Either a keypair or ethers.js Signer must be provided`);
  }

  let results: unknown;
  if (utils.isWrappedV2Document(document)) results = signDocumentV2(document, algorithm, keyOrSigner);
  else if (utils.isWrappedV3Document(document)) results = signDocumentV3(document, algorithm, keyOrSigner);

  if (results) return results as SignedWrappedDocument<T>;

  throw new Error(
    "Unsupported document type: Only OpenAttestation v2 or v3 documents can be signed with this function"
  );
}

export { digestDocument } from "./2.0/digest";
export { checkProof, MerkleTree } from "./shared/merkle";
export { digest as digestCredential };
export { obfuscate as obfuscateDocument };
export { utils };
export * from "./shared/@types/document";
export * from "./shared/@types/sign";
export * from "./shared/signer";
export { getData } from "./shared/utils"; // keep it to avoid breaking change, moved from privacy to utils
export { v2 };
export { v3 };
export { v4 };
