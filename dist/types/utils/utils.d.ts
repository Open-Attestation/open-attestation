/// <reference types="node" />
import { OpenAttestationDocument as v2OpenAttestationDocument } from "../__generated__/schemaV2";
import { OpenAttestationDocument as v3OpenAttestationDocument } from "../__generated__/schemaV3";
import { WrappedDocument, VerifiableCredential } from "../@types/document";
export declare type Hash = string | Buffer;
declare type Extract<P> = P extends WrappedDocument<infer T> ? T : never;
export declare const getData: <T extends {
    data: any;
}>(document: T) => Extract<T>;
/**
 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
 */
export declare function bufSortJoin(...args: Buffer[]): Buffer;
export declare function hashToBuffer(hash: Hash): Buffer;
export declare function toBuffer(element: any): Buffer;
/**
 * Turns array of data into sorted array of hashes
 */
export declare function hashArray(arr: any[]): Buffer[];
/**
 * Returns the keccak hash of two buffers after concatenating them and sorting them
 * If either hash is not given, the input is returned
 */
export declare function combineHashBuffers(first?: Buffer, second?: Buffer): Buffer;
/**
 * Returns the keccak hash of two string after concatenating them and sorting them
 * If either hash is not given, the input is returned
 * @param first A string to be hashed (without 0x)
 * @param second A string to be hashed (without 0x)
 * @returns Resulting string after the hash is combined (without 0x)
 */
export declare function combineHashString(first?: string, second?: string): string;
export declare const isWrappedV3Document: (document: any) => document is VerifiableCredential<v3OpenAttestationDocument>;
export declare const isWrappedV2Document: (document: any) => document is WrappedDocument<v2OpenAttestationDocument>;
export declare function getIssuerAddress(param: WrappedDocument<v2OpenAttestationDocument>): string[];
export declare function getIssuerAddress(param: VerifiableCredential<v3OpenAttestationDocument>): string;
export { keccak256 } from "js-sha3";
