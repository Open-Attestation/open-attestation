import { ValidateFunction } from "ajv/dist/core";
import { ErrorObject } from "ajv";
import { getLogger } from "../logger";
import { SchemaId } from "../@types/document";
import { Kind } from "../utils/@types/diagnose";
import { ContextUrl } from "../../4.0/context";
import { getData } from "../../2.0/utils";

const logger = getLogger("validate");

export const validateSchema = (document: any, validator: ValidateFunction, kind?: Kind): ErrorObject[] => {
  if (!validator) {
    throw new Error("No schema validator provided");
  }

  // FIXME: Unable to use isWrappedV4OpenAttestationDocument() type guard here because it also calls validateSchema (endless recursive call)
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
