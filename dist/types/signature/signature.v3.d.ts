import { OpenAttestationDocument } from "../__generated__/schemaV3";
import { VerifiableCredential } from "../@types/document";
export declare function validateV3<T extends OpenAttestationDocument>(credential: VerifiableCredential<T>): Promise<void>;
export declare const wrapV3: <T extends OpenAttestationDocument>(document: any) => VerifiableCredential<T>;
export declare const wrapsV3: <T extends OpenAttestationDocument>(documents: any[]) => VerifiableCredential<T>[];
export declare const verifyV3: <T extends VerifiableCredential<OpenAttestationDocument>>(document: T) => document is VerifiableCredential<T>;
export declare const obfuscateV3: (document: VerifiableCredential<OpenAttestationDocument>, fields: string | string[]) => VerifiableCredential<OpenAttestationDocument>;
