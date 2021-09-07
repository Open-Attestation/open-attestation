import { ErrorObject, ValidateFunction } from "ajv";
import { getLogger } from "../logger";
import { SchemaId } from "../@types/document";
// don't change this otherwise there is a cycle
import { getData } from "../utils/utils";
import { Kind } from "../utils/@types/diagnose";
const logger = getLogger("validate");

export const validateSchema = (document: any, validator: ValidateFunction, kind?: Kind): ErrorObject[] => {
  if (!validator) {
    throw new Error("No schema validator provided");
  }

  const valid = validator(document.version === SchemaId.v3 || kind === "raw" ? document : getData(document));

  if (!valid) {
    logger.debug(`There are errors in the document: ${JSON.stringify(validator.errors)}`);
    return validator.errors ?? [];
  }
  logger.debug(`Document is a valid open attestation document v${document.version}`);
  return [];
};
