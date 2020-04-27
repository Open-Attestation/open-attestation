import { WrappedDocument } from "../@types/document";
export declare const obfuscateData: (_data: any, fields: string | string[]) => {
    data: any;
    obfuscatedData: string[];
};
export declare const obfuscateDocument: <T = any>(document: WrappedDocument<T>, fields: string | string[]) => WrappedDocument<T>;
