import { get, cloneDeep, pick, unset } from "lodash";
import { flatten } from "../serialize/flatten";
import { toBuffer } from "../utils";
import { unsaltData } from "./salt";
import { Signature } from "../signature";

export interface SignedDocument extends SchematisedDocument {
  signature: Signature;
}

export interface ObfuscationMetadata {
  obfuscatedData?: string[];
}

export interface SchematisedDocument extends Document {
  schema: string;
}

export interface Document {
  data: any;
  privacy?: ObfuscationMetadata;
  schema?: string;
}

export type OpenAttestationData = any; // input data can take any format

export const getData = (document: Document) => unsaltData(document.data);

/**
 * Takes a partial originating document, possibly only with a schema.id and returns a document with the given data and obfuscated data
 * @param document the metadata container
 * @param data the data
 * @param obfuscatedData hashes of replaced data to put into the privacy field
 */

// TODO: split into two separate functions for the two different use cases
export const setData = <T extends SchematisedDocument | SignedDocument>(
  document: T,
  data: OpenAttestationData,
  obfuscatedData: string[] = []
): T => {
  const privacy = {
    ...document.privacy,
    obfuscatedData: obfuscatedData && obfuscatedData.length > 0 ? obfuscatedData : []
  };
  return {
    ...document,
    data,
    privacy
  };
};

export const obfuscateData = (_data: any, fields: string[] | string) => {
  const data = cloneDeep(_data); // Prevents alteration of original data
  const fieldsToRemove = Array.isArray(fields) ? fields : [fields];

  // Obfuscate data by hashing them with the key
  const dataToObfuscate: any = flatten(pick(data, fieldsToRemove));
  const obfuscatedData = Object.keys(dataToObfuscate).map(k => {
    const obj: any = {};
    obj[k] = dataToObfuscate[k];
    return toBuffer(obj).toString("hex");
  });

  // Return remaining data
  fieldsToRemove.forEach(path => {
    unset(data, path);
  });

  return {
    data,
    obfuscatedData
  };
};

export const obfuscateDocument = (document: SignedDocument, fields: string[] | string): SignedDocument => {
  const existingData = document.data;
  const { data, obfuscatedData } = obfuscateData(existingData, fields);

  // we use lodash.get because document might not have the correct fields when coming from external input
  const currentObfuscatedData = get(document, "privacy.obfuscatedData", []);
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);

  return setData(document, data, newObfuscatedData);
};
