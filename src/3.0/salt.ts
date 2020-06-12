import { Salt } from "..";
import { v4 as uuid } from "uuid";
import { Base64 } from "js-base64";

const deepMap = (value: any, path: string): Salt[] => {
  if (Array.isArray(value)) {
    return value.flatMap((v, index) => deepMap(v, `${path}[${index}]`));
  }
  // Since null values are allowed but typeof null === "object", the "&& value" is used to skip this
  if (typeof value === "object" && value) {
    return Object.keys(value).flatMap(key => deepMap(value[key], path ? `${path}.${key}` : key));
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
    return [{ value: uuid(), path }];
  }
  throw new Error(`Unexpected value '${value}' in '${path}'`);
};

const illegalCharactersCheck = (data: object) => {
  Object.entries(data).forEach(([key, value]) => {
    if (key.includes(".")) {
      throw new Error("Key names must not have . in them");
    }
    if (key.includes("[") || key.includes("]")) {
      throw new Error("Key names must not have '[' or ']' in them");
    }
    if (value && typeof value === "object") {
      return illegalCharactersCheck(value); // Recursively search if property contains sub-properties
    }
  });
};

export const salt = (data: any) => {
  // Check for illegal characters e.g. '.', '[' or ']'
  illegalCharactersCheck(data);
  return deepMap(data, "");
};

export const encodeSalt = (salts: Salt[]): string => Base64.encode(JSON.stringify(salts));
export const decodeSalt = (salts: string): Salt[] => JSON.parse(Base64.decode(salts));
