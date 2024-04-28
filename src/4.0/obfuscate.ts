import { toBuffer } from "../shared/utils";
import { cloneDeep, get, unset, pick } from "lodash";
import { decodeSalt, encodeSalt } from "./salt";
import { traverseAndFlatten } from "./traverseAndFlatten";
import { V4WrappedDocument } from "./types";

const obfuscate = (_data: V4WrappedDocument, fields: string[] | string) => {
  const data = cloneDeep(_data); // Prevents alteration of original data

  const fieldsAsArray = ([] as string[]).concat(fields);
  // fields to remove will contain the list of each expanded keys from the fields passed in parameter, it's for instance useful in case of
  // object obfuscation, where the object itself is not part of the salts, but each individual keys are
  const fieldsToRemove: string[] = traverseAndFlatten(pick(data, fieldsAsArray), {
    iteratee: ({ path }) => path,
  });
  const salts = decodeSalt(data.proof.salts);

  // Obfuscate data by hashing them with the key
  const obfuscatedData = fieldsToRemove.map((field) => {
    const value = get(data, field);
    const salt = salts.find((s) => s.path === field);

    if (!salt) {
      throw new Error(`Salt not found for ${field}`);
    }

    return toBuffer({ [salt.path]: `${salt.value}:${value}` }).toString("hex");
  });
  // remove fields from the object
  fieldsAsArray.forEach((field) => unset(data, field));

  data.proof.salts = encodeSalt(salts.filter((s) => !fieldsToRemove.includes(s.path)));
  return {
    data,
    obfuscatedData,
  };
};

export const obfuscateVerifiableCredential = <T extends V4WrappedDocument>(
  document: T,
  fields: string[] | string
): T => {
  const { data, obfuscatedData } = obfuscate(document, fields);
  const currentObfuscatedData = document.proof.privacy.obfuscated;
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
  return {
    ...data,
    proof: {
      ...data.proof,
      privacy: {
        ...data.proof.privacy,
        obfuscated: newObfuscatedData,
      },
    },
  } satisfies V4WrappedDocument as T;
};
