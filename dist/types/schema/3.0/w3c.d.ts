import { WrappedDocument } from "../../@types/document";
import { OpenAttestationDocument } from "../../__generated__/schemaV3";
/**
 * This function is not production ready and is a simple POC to demonstrate that we are able to transform our document to W3C VC
 * https://www.w3.org/TR/vc-data-model/#types
 */
export declare const __unsafe__mapToW3cVc: (document: WrappedDocument<OpenAttestationDocument>) => any;
