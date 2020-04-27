import { Salt } from "..";
import { v4 as uuid } from "uuid";
import { Base64 } from "js-base64";
import { traverseAndFlatten } from "./traverseAndFlatten";

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

export const salt = (data: any): Salt[] => {
  // Check for illegal characters e.g. '.', '[' or ']'
  illegalCharactersCheck(data);
  return traverseAndFlatten(data, { iteratee: ({ path }) => ({ value: uuid(), path }) });
};

export const encodeSalt = (salts: Salt[]): string => Base64.encode(JSON.stringify(salts));
export const decodeSalt = (salts: string): Salt[] => JSON.parse(Base64.decode(salts));
