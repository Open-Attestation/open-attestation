import { OpenAttestationDocument, Proof as ProofV3 } from "../__generated__/schemaV3";
export declare type SignatureProofAlgorithm = "SHA3MerkleProof";
export declare enum SchemaId {
    v2 = "https://schema.openattestation.com/2.0/schema.json",
    v3 = "https://schema.openattestation.com/3.0/schema.json"
}
export interface Signature {
    type: SignatureProofAlgorithm;
    targetHash: string;
    proof: string[];
    merkleRoot: string;
}
export interface ProofSigningOptions {
    privateKey: string;
    verificationMethod: string;
    type: ProofType;
    proofPurpose?: ProofPurpose;
}
export interface ObfuscationMetadata {
    obfuscatedData?: string[];
}
export interface SchematisedDocument<T = any> {
    version: SchemaId;
    data: DeepStringify<T>;
    schema?: string;
    privacy?: ObfuscationMetadata;
}
export interface WrappedDocument<T = any> {
    version: SchemaId;
    signature: Signature;
    data: DeepStringify<T>;
    schema?: string;
    privacy?: ObfuscationMetadata;
}
export declare enum ProofType {
    EcdsaSecp256k1Signature2019 = "EcdsaSecp256k1Signature2019"
}
export declare enum ProofPurpose {
    AssertionMethod = "assertionMethod"
}
export interface Proof {
    type: ProofType;
    created: string;
    proofPurpose: ProofPurpose;
    verificationMethod: string;
    signature: string;
}
export interface SignedWrappedDocument<T = any> extends WrappedDocument<T> {
    proof: Proof;
}
export interface SignatureV3 {
    type: SignatureProofAlgorithm;
    targetHash: string;
    proof: string[];
    merkleRoot: string;
    salts: Salt[];
    privacy: {
        obfuscatedData: string[];
    };
}
export interface Salt {
    value: string;
    path: string;
}
export interface VerifiableCredentialProof extends ProofV3 {
    signature: SignatureV3;
}
export declare type VerifiableCredential<T extends OpenAttestationDocument> = T & {
    version: SchemaId.v3;
    schema?: string;
    proof: VerifiableCredentialProof;
};
export declare type DeepStringify<T> = {
    [P in keyof T]: T[P] extends Array<number> ? Array<string> : T[P] extends Array<string> ? Array<string> : T[P] extends Record<string, any> ? DeepStringify<T[P]> : T[P] extends Array<Record<string, infer U>> ? DeepStringify<U> : number extends T[P] ? string : undefined extends T[P] ? DeepStringify<T[P]> : T[P] extends string ? string : DeepStringify<T[P]>;
};
