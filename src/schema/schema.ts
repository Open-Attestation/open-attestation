import Ajv from "ajv";
import { getData } from "../privacy";
import { getLogger } from "../logger";
import openAttestationSchemav2 from "./2.0/schema.json";
import openAttestationSchemav3 from "./3.0/schema.json";

const logger = getLogger("validate");

export const validateSchema = (document: any, validator: Ajv.ValidateFunction): Ajv.ErrorObject[] => {
  if (!validator) {
    throw new Error("No schema validator provided");
  }
  const valid = validator(getData(document));
  if (!valid) {
    logger.debug("There are errors in the document");
    logger.debug(validator.errors);
    return validator.errors ?? [];
  }
  logger.debug(`Document is a valid open attestation document v${document.version}`);
  return [];
};

const ajv = new Ajv({ allErrors: true });
ajv.compile(openAttestationSchemav2);
ajv.compile(openAttestationSchemav3);
export const getSchema = (key: string) => ajv.getSchema(key);
