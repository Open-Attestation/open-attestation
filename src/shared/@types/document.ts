import { Issuer, OpenAttestationCredential } from "../../__generated__/schema.3.0";

export enum SignatureAlgorithm {
  OpenAttestationMerkleProofSignature2018 = "OpenAttestationMerkleProofSignature2018"
}

export enum SchemaId {
  v2 = "https://schema.openattestation.com/2.0/schema.json",
  v3 = "https://schema.openattestation.com/3.0/schema.json"
}

export interface OpenAttestationCredentialWithInnerIssuer extends OpenAttestationCredential {
  issuer: Issuer;
}

export interface Signature {
  type: "SHA3MerkleProof";
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
export enum ProofType {
  EcdsaSecp256k1Signature2019 = "EcdsaSecp256k1Signature2019"
}
export enum ProofPurpose {
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

export interface Salt {
  value: string;
  path: string;
}
export interface VerifiableCredentialProof {
  type: SignatureAlgorithm;
  targetHash: string;
  merkleRoot: string;
  proofs: string[];
  salts: string;
  privacy: { obfuscated: string[] };
}
export type OpenAttestationVerifiableCredential<T extends OpenAttestationCredential = OpenAttestationCredential> = T & {
  version: SchemaId.v3;
  schema?: string;
  proof: VerifiableCredentialProof;
};

// feel free to improve, as long as this project compile without changes :)
// once salted, every property is turned into a string
export type DeepStringify<T> = {
  [P in keyof T]: T[P] extends Array<number> // if it's a []number
    ? Array<string> // return []string
    : T[P] extends Array<string> // if it's []string
    ? Array<string> // return []string
    : T[P] extends Record<string, any> // if it's an object
    ? DeepStringify<T[P]> // apply stringify on the object
    : T[P] extends Array<Record<string, infer U>> // if it's an array of object
    ? DeepStringify<U> // apply stringify on the array
    : number extends T[P] // if it's a number
    ? string // make it a string
    : undefined extends T[P] // if it's an optional field
    ? DeepStringify<T[P]> // stringify the type
    : T[P] extends string // if it's a string
    ? string // make it a string
    : DeepStringify<T[P]>; // unknown case => apply stringify, known use case: union (Issuer | string)
};
