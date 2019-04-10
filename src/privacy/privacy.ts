import { cloneDeep, get, pick, unset } from "lodash";
import { flatten } from "flat";
import { toBuffer } from "../utils";
import { unsaltData } from "./salt";

export interface Document {
  data?: any;
  privacy?: any;
  schema?: string;
  signature?: any;
}

export const getData = (document: Document) => unsaltData(document.data);

export const setData = (document: Document, data: any, obfuscatedData: string[] = []) => {
  const privacy = Object.assign(
    {},
    document.privacy,
    obfuscatedData && obfuscatedData.length > 0 ? { obfuscatedData } : {}
  );
  return Object.assign({}, document, {
    data,
    privacy
  });
};

export const obfuscateData = (_data: any, fields: any) => {
  const data = cloneDeep(_data); // Prevents alteration of original data
  const fieldsToRemove = fields instanceof Array ? fields : [fields];

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

export const obfuscateDocument = (_document: Document, fields: any) => {
  const existingData = _document.data;
  const { data, obfuscatedData } = obfuscateData(existingData, fields);

  const currentObfuscatedData = get(_document, "privacy.obfuscatedData", []);
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);

  return setData(_document, data, newObfuscatedData);
};
