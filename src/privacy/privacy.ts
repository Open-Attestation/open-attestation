import { get, cloneDeep, pick, unset } from "lodash";
import { flatten } from "flat";
import { toBuffer } from "../utils";
import { unsaltData } from "./salt";

export interface SignedDocument {
  data: any;
  privacy: {
    obfuscatedData?: string[];
  };
  schema: string;
  signature: {
    type: string;
    targetHash: string;
    merkleRoot: string;
    proof: string[];
  };
}

export interface UnsignedDocument {
  data: any;
}

export const getData = (document: SignedDocument) => unsaltData(document.data);

export const setData = (
  document: SignedDocument,
  data: UnsignedDocument,
  obfuscatedData: string[] = []
): SignedDocument => {
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

export const obfuscateDocument = (document: SignedDocument, fields: any): SignedDocument => {
  const existingData = document.data;
  const { data, obfuscatedData } = obfuscateData(existingData, fields);

  // we use lodash.get because document might not have the correct fields when coming from external input
  const currentObfuscatedData = get(document, "privacy.obfuscatedData", []);
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);

  return setData(document, data, newObfuscatedData);
};
