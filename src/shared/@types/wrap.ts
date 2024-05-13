import { SchemaId } from "./document";

export interface WrapDocumentOption {
  externalSchemaId?: string;
  version?: SchemaId;
}

export interface WrapDocumentOptionV2 {
  externalSchemaId?: string;
  version?: SchemaId.v2;
}

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export interface WrapDocumentOptionV3 {
  externalSchemaId?: string;
  version: SchemaId.v3;
}

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export const isWrapDocumentOptionV3 = (options: any): options is WrapDocumentOptionV3 => {
  return options?.version === SchemaId.v3;
};
