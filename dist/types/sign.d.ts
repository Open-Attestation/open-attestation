import { WrappedDocument, ProofSigningOptions, SignedWrappedDocument } from "./@types/document";
export declare function sign<T = any>(document: WrappedDocument<T>, options: ProofSigningOptions): Promise<SignedWrappedDocument<T>>;
