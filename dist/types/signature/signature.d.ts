import { SchematisedDocument, WrappedDocument } from "../@types/document";
import { OpenAttestationDocument } from "../__generated__/schemaV3";
export declare const wrap: <T = OpenAttestationDocument>(document: SchematisedDocument<T>, batch?: string[] | undefined) => WrappedDocument<T>;
export declare const verify: <T = any>(document: any) => document is WrappedDocument<T>;
