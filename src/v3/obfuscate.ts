import { OpenAttestationDocument } from "../__generated__/schemaV3";
import { toBuffer } from "../shared/utils";
import { Salt, VerifiableCredential } from "../shared/@types/document";
import { cloneDeep, get, unset } from "lodash";
import { compact } from "jsonld";

export const obfuscateData = (_data: VerifiableCredential<OpenAttestationDocument>, fields: string[] | string) => {
  const data = cloneDeep(_data); // Prevents alteration of original data
  const fieldsToRemove = Array.isArray(fields) ? fields : [fields];
  const salts = _data.proof.signature.salts;

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
  document: VerifiableCredential<OpenAttestationDocument>,
  fields: string[] | string
): VerifiableCredential<OpenAttestationDocument> => {
  const { data, obfuscatedData } = obfuscateData(document, fields);

  const currentObfuscatedData = document.proof.signature.privacy.obfuscatedData;
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
  return {
    ...data,
    proof: {
      ...data.proof,
      signature: {
        ...data.proof.signature,
        privacy: {
          ...data.proof.signature.privacy,
          obfuscatedData: newObfuscatedData
        }
      }
    }
  };
};