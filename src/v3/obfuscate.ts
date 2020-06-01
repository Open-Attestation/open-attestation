import { OpenAttestationCredential } from "../__generated__/schemaV3";
import { toBuffer } from "../shared/utils";
import { OpenAttestationVerifiableCredential } from "../shared/@types/document";
import { cloneDeep, get, unset } from "lodash";

export const obfuscateData = (
  _data: OpenAttestationVerifiableCredential<OpenAttestationCredential>,
  fields: string[] | string
) => {
  const data = cloneDeep(_data); // Prevents alteration of original data
  const fieldsToRemove = Array.isArray(fields) ? fields : [fields];
  const salts = _data.proof.salts;

  // Obfuscate data by hashing them with the key
  const obfuscatedData = fieldsToRemove
    .filter(field => get(data, field))
    .map(field => {
      const value = get(data, field);
      const salt = salts.find(s => s.path === field);
      if (!salt) {
        throw new Error(`Salt not found for ${field}`);
      }
      return toBuffer(`${salt.value}:${value}`).toString("hex");
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

export const obfuscateDocument = (
  document: OpenAttestationVerifiableCredential<OpenAttestationCredential>,
  fields: string[] | string
): OpenAttestationVerifiableCredential<OpenAttestationCredential> => {
  const { data, obfuscatedData } = obfuscateData(document, fields);

  const currentObfuscatedData = document.proof.privacy.obfuscated;
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
  return {
    ...data,
    proof: {
      ...data.proof,
      privacy: {
        ...data.proof.privacy,
        obfuscated: newObfuscatedData
      }
    }
  };
};
