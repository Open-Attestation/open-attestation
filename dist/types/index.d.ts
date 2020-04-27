import Ajv from "ajv";
import { SchemaId, VerifiableCredential, WrappedDocument } from "./@types/document";
import * as utils from "./utils";
import * as v2 from "./__generated__/schemaV2";
import * as v3 from "./__generated__/schemaV3";
import { OpenAttestationDocument } from "./__generated__/schemaV3";
declare class SchemaValidationError extends Error {
    validationErrors: Ajv.ErrorObject[];
    document: any;
    constructor(message: string, validationErrors: Ajv.ErrorObject[], document: any);
}
declare const isSchemaValidationError: (error: any) => error is SchemaValidationError;
interface WrapDocumentOptionV2 {
    externalSchemaId?: string;
    version?: SchemaId.v2;
}
interface WrapDocumentOptionV3 {
    externalSchemaId?: string;
    version?: SchemaId.v3;
}
export declare function wrapDocument<T = unknown>(data: T, options?: WrapDocumentOptionV2): Promise<WrappedDocument<T>>;
export declare function wrapDocument<T extends OpenAttestationDocument>(data: T, options?: WrapDocumentOptionV3): Promise<VerifiableCredential<T>>;
export declare function wrapDocuments<T = unknown>(dataArray: T[], options?: WrapDocumentOptionV2): WrappedDocument<T>[];
export declare function wrapDocuments<T extends OpenAttestationDocument>(dataArray: T[], options?: WrapDocumentOptionV3): VerifiableCredential<T>[];
export declare const validateSchema: (document: any) => boolean;
export declare function verifySignature<T = any>(document: any): document is WrappedDocument<T>;
export declare function verifySignature<T extends VerifiableCredential<OpenAttestationDocument>>(document: T): document is VerifiableCredential<T>;
export declare function obfuscate<T = any>(document: WrappedDocument<T>, fields: string[] | string): WrappedDocument<T>;
export declare function obfuscate<T extends VerifiableCredential<OpenAttestationDocument>>(document: T, fields: string[] | string): T;
export { digestDocument } from "./digest";
export { checkProof, MerkleTree } from "./signature";
export { obfuscateDocument } from "./privacy";
export { sign } from "./sign";
export { utils, isSchemaValidationError };
export * from "./@types/document";
export * from "./schema/3.0/w3c";
export { getData } from "./utils";
export { v2 };
export { v3 };
