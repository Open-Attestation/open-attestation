import Ajv, { ErrorObject, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { getLogger } from "../logger";
import openAttestationSchemav2 from "../../2.0/schema/schema.json";
import openAttestationSchemav3 from "../../3.0/schema/schema.json";
import { getData } from "../utils";
import { SchemaId } from "../@types/document";

const logger = getLogger("validate");

export const validateSchema = (document: any, validator: ValidateFunction): ErrorObject[] => {
  if (!validator) {
    throw new Error("No schema validator provided");
  }
  const valid = validator(document.version === SchemaId.v3 ? document : getData(document));
  if (!valid) {
    logger.debug("There are errors in the document");
    logger.debug(validator.errors);
    return validator.errors ?? [];
  }
  logger.debug(`Document is a valid open attestation document v${document.version}`);
  return [];
};
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);
ajv.addKeyword("deprecationMessage");
ajv.compile(openAttestationSchemav2);
ajv.compile(openAttestationSchemav3);
export const getSchema = (key: string) => {
  const schema = ajv.getSchema(key);
  if (!schema) throw new Error(`Could not find ${key} schema`);
  return schema;
};
