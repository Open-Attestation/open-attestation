import { WrappedDocument, ProofSigningOptions, SignedWrappedDocument } from "../@types/document";
/**
 * The document must already be wrapped including a signature block and a targetHash.
 * It is the targetHash that will be signed.
 * @param document
 * @param options
 */
export declare function sign<T = any>(document: WrappedDocument<T>, options: ProofSigningOptions): Promise<SignedWrappedDocument<T>>;
