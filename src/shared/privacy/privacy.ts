import { cloneDeep, pick, unset } from "lodash";
import { flatten } from "../serialize/flatten";
import { toBuffer } from "../utils";
import { WrappedDocument } from "../../shared/@types/document";

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

// TODO to improve user experience and provide better feedback on what's wrong for non typescript user we might consider performing validation on the object provided
export const obfuscateDocument = <T = any>(
  document: WrappedDocument<T>,
  fields: string[] | string
): WrappedDocument<T> => {
  const existingData = document.data;
  const { data, obfuscatedData } = obfuscateData(existingData, fields);

  const currentObfuscatedData = document?.privacy?.obfuscatedData ?? [];
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
  return {
    ...document,
    data,
    privacy: {
      ...document.privacy,
      obfuscatedData: newObfuscatedData
    }
  };
};
