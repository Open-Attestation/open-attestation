import { Salt } from "./types";
import randomBytes from "randombytes";
import { Base64 } from "js-base64";
import { traverseAndFlatten } from "./traverseAndFlatten";

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
/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/beta)
 */
export const secureRandomString = () => randomBytes(ENTROPY_IN_BYTES).toString("hex");

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/beta)
 */
export const salt = (data: any): Salt[] => {
  // Check for illegal characters e.g. '.', '[' or ']'
  illegalCharactersCheck(data);
  return traverseAndFlatten(data, { iteratee: ({ path }) => ({ value: secureRandomString(), path }) });
};

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/beta)
 */
export const encodeSalt = (salts: Salt[]): string => Base64.encode(JSON.stringify(salts));

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/beta)
 */
export const decodeSalt = (salts: string): Salt[] => {
  const decoded: Salt[] = JSON.parse(Base64.decode(salts));
  decoded.forEach((salt) => {
    if (salt.value.length !== ENTROPY_IN_BYTES * 2) throw new Error(`Salt must be ${ENTROPY_IN_BYTES} bytes`);
  });
  return decoded;
};
