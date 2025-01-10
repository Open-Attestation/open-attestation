import { OASalt } from "./types";
import { Base64 } from "js-base64";
import { traverseAndFlatten } from "./traverseAndFlatten";
import randomBytes from "randombytes";

const ENTROPY_IN_BYTES = 32;

const illegalCharactersCheck = (data: Record<string, any>) => {
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

// Using 32 bytes of entropy as compared to 16 bytes in uuid
// Using hex encoding as compared to base64 for constant string length
export const secureRandomString = () => randomBytes(ENTROPY_IN_BYTES).toString("hex");

export const salt = (data: any): OASalt[] => {
  // Check for illegal characters e.g. '.', '[' or ']'
  illegalCharactersCheck(data);
  return traverseAndFlatten(data, ({ path }) => ({ value: secureRandomString(), path }));
};

export const encodeSalt = (salts: OASalt[]): string => Base64.encode(JSON.stringify(salts));
export const decodeSalt = (salts: string): OASalt[] => {
  const decoded: OASalt[] = JSON.parse(Base64.decode(salts));
  decoded.forEach((salt) => {
    if (salt.value.length !== ENTROPY_IN_BYTES * 2) throw new Error(`Salt must be ${ENTROPY_IN_BYTES} bytes`);
  });
  return decoded;
};
