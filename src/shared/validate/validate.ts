import { ErrorObject, ValidateFunction } from "ajv";
import { getLogger } from "../logger";
import { ContextUrl, SchemaId } from "../@types/document";
// don't change this otherwise there is a cycle
import { getData } from "../utils/utils";
import { Kind } from "../utils/@types/diagnose";

const logger = getLogger("validate");

export const validateSchema = (document: any, validator: ValidateFunction, kind?: Kind): ErrorObject[] => {
  if (!validator) {
    throw new Error("No schema validator provided");
  }

  // FIXME: Unable to use isWrappedV4Document() type guard here because it also calls validateSchema (endless recursive call)
  // Need a better way to determine whether a document needs to be unwrapped first
  const valid = validator(
    (Array.isArray(document["@context"]) && document["@context"].includes(ContextUrl.v2_vc)) ||
      (Array.isArray(document["@context"]) && document["@context"].includes(ContextUrl.v4_alpha)) ||
      document.version === SchemaId.v3 ||
      kind === "raw"
      ? document
      : getData(document)
  );

  if (!valid) {
    logger.debug(`There are errors in the document: ${JSON.stringify(validator.errors)}`);
    return validator.errors ?? [];
  }
  logger.debug(`Document is a valid open attestation document v${document.version}`);
  return [];
};
