import { cloneDeep, pick, unset } from "lodash";
import { flatten } from "../serialize/flatten";
import { toBuffer } from "../utils";
import { unsaltData } from "./salt";
import { DeepStringify, SchematisedDocument, WrappedDocument } from "../@types/document";

type Extract<P> = P extends WrappedDocument<infer T> ? T : never;
export const getData = <T extends { data: any }>(document: T): Extract<T> => {
  return unsaltData(document.data);
};

/**
 * Takes a partial originating document, possibly only with a schema.id and returns a document with the given data and obfuscated data
 * @param document the metadata container
 * @param data the data
 * @param obfuscatedData hashes of replaced data to put into the privacy field
 */

// TODO: split into two separate functions for the two different use cases
export const setData = <T extends SchematisedDocument<U> | WrappedDocument<U>, U = any>(
  document: T,
  data: DeepStringify<U>,
  obfuscatedData: string[] = []
) => {
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

// TODO to improve user experience and provide better feedback on what's wrong for non typescript user we might consider performing validation on the object provided
export const obfuscateDocument = <T = any>(
  document: WrappedDocument<T>,
  fields: string[] | string
): WrappedDocument<T> => {
  const existingData = document.data;
  const { data, obfuscatedData } = obfuscateData(existingData, fields);

  const currentObfuscatedData = document?.privacy?.obfuscatedData ?? [];
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);

  return setData(document, data, newObfuscatedData);
};
