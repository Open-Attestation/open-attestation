import Ajv from "ajv";
import { getLogger } from "../logger";
import openAttestationSchemav2 from "../../v2/schema/schema.json";
import openAttestationSchemav3 from "../../v3/schema/schema.json";
import { getData } from "../utils";
import { SchemaId } from "../@types/document";
import { OpenAttestationDocument } from "../../__generated__/schemaV3";
import { VerifiableCredential } from "../../shared/@types/document";
import { compact } from "jsonld";

const logger = getLogger("validate");

export const validateSchema = (document: any, validator: Ajv.ValidateFunction): Ajv.ErrorObject[] => {
  if (!validator) {
    throw new Error("No schema validator provided");
  }
  const valid = validator(document.version === SchemaId.v3 ? document : getData(document));
  // console.log(validator.errors);
  if (!valid) {
    logger.debug("There are errors in the document");
    logger.debug(validator.errors);
    return validator.errors ?? [];
  }
  logger.debug(`Document is a valid open attestation document v${document.version}`);
  return [];
};

const getId = (objectOrString: any) => {
  if (typeof objectOrString === "string") {
    return objectOrString;
  }
  return objectOrString.id;
};
/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */
const dateFullYear = /[0-9]{4}/;
const dateMonth = /(0[1-9]|1[0-2])/;
const dateMDay = /([12]\d|0[1-9]|3[01])/;
const timeHour = /([01][0-9]|2[0-3])/;
const timeMinute = /[0-5][0-9]/;
const timeSecond = /([0-5][0-9]|60)/;
const timeSecFrac = /(\.[0-9]+)?/;
const timeNumOffset = new RegExp("[-+]".concat(timeHour.source, ":").concat(timeMinute.source));
const timeOffset = new RegExp("([zZ]|".concat(timeNumOffset.source, ")"));
const partialTime = new RegExp(
  ""
    .concat(timeHour.source, ":")
    .concat(timeMinute.source, ":")
    .concat(timeSecond.source)
    .concat(timeSecFrac.source)
);
const fullDate = new RegExp(
  ""
    .concat(dateFullYear.source, "-")
    .concat(dateMonth.source, "-")
    .concat(dateMDay.source)
);
const fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
const rfc3339 = new RegExp("".concat(fullDate.source, "[ tT]").concat(fullTime.source));

const isValidRFC3339 = (str: any) => {
  return rfc3339.test(str);
};

/* Based on https://tools.ietf.org/html/rfc3986 and https://stackoverflow.com/a/37249519/950462 */
const uri = `(?:[A-Za-z][A-Za-z0-9+.-]*:\/{2})?(?:(?:[A-Za-z0-9-._~]|%[A-Fa-f0-9]{2})+(?::([A-Za-z0-9-._~]?|[%][A-Fa-f0-9]{2})+)?@)?(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.){1,126}[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?::[0-9]+)?(?:\/(?:[A-Za-z0-9-._~]|%[A-Fa-f0-9]{2})*)*(?:\\?(?:[A-Za-z0-9-._~]+(?:=(?:[A-Za-z0-9-._~+]|%[A-Fa-f0-9]{2})+)?)(?:&|;[A-Za-z0-9-._~]+(?:=(?:[A-Za-z0-9-._~+]|%[A-Fa-f0-9]{2})+)?)*)?`;
const rfc3986 = new RegExp(uri);

const isValidRFC3986 = (str: any) => {
  return rfc3986.test(str);
};

export async function validateW3C<T extends OpenAttestationDocument>(
  credential: VerifiableCredential<T>
): Promise<void> {
  // ensure first context is 'https://www.w3.org/2018/credentials/v1' as it's mandatory, see https://www.w3.org/TR/vc-data-model/#contexts
  if (
    !Array.isArray(credential["@context"]) ||
    (Array.isArray(credential["@context"]) && credential["@context"][0] !== "https://www.w3.org/2018/credentials/v1")
  ) {
    throw new Error("https://www.w3.org/2018/credentials/v1 needs to be first in the list of contexts.");
  }

  // ensure issuer is a valid URI according to RFC3986 IF it is a string
  // TODO check if credential.issuer is string first, as it can be an object containing an id property
  const issuerId = getId(credential.issuer);
  if (!isValidRFC3986(issuerId)) {
    throw new Error("Property `issuer` id must be a valid RFC 3986 URI");
  }

  // ensure issuanceDate is a valid RFC3339 date, see https://www.w3.org/TR/vc-data-model/#issuance-date
  if (!isValidRFC3339(credential.issuanceDate)) {
    throw new Error("Property `issuanceDate` must be a valid RFC 3339 date");
  }
  // ensure expirationDate is a valid RFC3339 date, see https://www.w3.org/TR/vc-data-model/#expiration
  if (credential.expirationDate && !isValidRFC3339(credential.expirationDate)) {
    throw new Error("Property `expirationDate` must be a valid RFC 3339 date");
  }

  // https://www.w3.org/TR/vc-data-model/#types
  if (!credential.type || !Array.isArray(credential.type)) {
    throw new Error("Property `type` must exist and be an array");
  }
  if (!credential.type.includes("VerifiableCredential")) {
    throw new Error("Property `type` must have VerifiableCredential as one of the items");
  }

  // Check if we can use some other context other than https://w3id.org/security/v2
  await compact(credential, "https://w3id.org/security/v2", {
    expansionMap: info => {
      // console.log(credential);
      if (info.unmappedProperty) {
        throw new Error(
          'The property "' + info.unmappedProperty + '" in the input ' + "was not defined in the context."
        );
      }
    }
  });
}

const ajv = new Ajv({ allErrors: true });
ajv.compile(openAttestationSchemav2);
ajv.compile(openAttestationSchemav3);
export const getSchema = (key: string) => ajv.getSchema(key);
