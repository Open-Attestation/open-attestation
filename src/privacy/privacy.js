import { cloneDeep, pick, unset, get } from "lodash";
import { flatten } from "../serialize/flatten";
import { toBuffer } from "../utils";
import { unsaltData } from "./salt";

export const getData = document => unsaltData(document.data);

export const setData = (document, data, obfuscatedData = []) => {
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

export const obfuscateData = (_data, fields) => {
  const data = cloneDeep(_data); // Prevents alteration of original data
  const fieldsToRemove = fields instanceof Array ? fields : [fields];

  // Obfuscate data by hashing them with the key
  const dataToObfuscate = flatten(pick(data, fieldsToRemove));
  const obfuscatedData = Object.keys(dataToObfuscate).map(k => {
    const obj = {};
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

export const obfuscateDocument = (_document, fields) => {
  const existingData = _document.data;
  const { data, obfuscatedData } = obfuscateData(existingData, fields);

  const currentObfuscatedData = get(_document, "privacy.obfuscatedData", []);
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);

  const document = setData(_document, data, newObfuscatedData);
  return document;
};
