import { OpenAttestationCredential } from "../__generated__/schema.3.0";
import { toBuffer } from "../shared/utils";
import { OpenAttestationVerifiableCredential } from "../shared/@types/document";
import { cloneDeep, get, unset } from "lodash";
import { decodeSalt, encodeSalt } from "./wrap";

export const obfuscateData = (
  _data: OpenAttestationVerifiableCredential<OpenAttestationCredential>,
  fields: string[] | string
) => {
  const data = cloneDeep(_data); // Prevents alteration of original data
  const fieldsToRemove = Array.isArray(fields) ? fields : [fields];
  const salts = decodeSalt(_data.proof.salts);
  let modifiedSalts = cloneDeep(salts);
  // Obfuscate data by hashing them with the key
  const obfuscatedData = fieldsToRemove.map(field => {
    const value = get(data, field);
    const salt = salts.find(s => s.path === field);

    if (!salt) {
      throw new Error(`Salt not found for ${field}`);
    }
    unset(data, field);

    return toBuffer({ [salt.path]: `${salt.value}:${value}` }).toString("hex");
  });

  modifiedSalts = salts.filter(s => !fieldsToRemove.includes(s.path));
  data.proof.salts = encodeSalt(modifiedSalts);
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
