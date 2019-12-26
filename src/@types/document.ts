export type SignatureProofAlgorithm = "SHA3MerkleProof";

export interface Signature {
  type: SignatureProofAlgorithm;
  targetHash: string;
  proof: string[];
  merkleRoot: string;
}

export interface ObfuscationMetadata {
  obfuscatedData?: string[];
}

export interface SchematisedDocument<T = any> {
  version: string;
  data: DeepStringify<T>;
  schema?: string;
  privacy?: ObfuscationMetadata;
}

export interface WrappedDocument<T = any> {
  version: string;
  signature: Signature;
  data: DeepStringify<T>;
  schema?: string;
  privacy?: ObfuscationMetadata;
}

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
    : string; // default to string
};
