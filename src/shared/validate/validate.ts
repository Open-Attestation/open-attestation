import Ajv from "ajv";
import { getLogger } from "../logger";
import openAttestationSchemav2 from "../../v2/schema/schema.json";
import openAttestationSchemav3 from "../../v3/schema/schema.json";
import { getData } from "../utils";
import { SchemaId } from "../@types/document";
import { OpenAttestationDocument } from "../../__generated__/schemaV3";
import { VerifiableCredential } from "../../shared/@types/document";
import { compact, expand } from "jsonld";

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

/* Based on https://tools.ietf.org/html/rfc3986 and https://github.com/ajv-validator/ajv/search?q=uri&unscoped_q=uri */
const uri = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
const rfc3986 = new RegExp(uri);

const isValidRFC3986 = (str: any) => {
  return rfc3986.test(str);
};

export async function validateW3C<T extends OpenAttestationDocument>(
  credential: VerifiableCredential<T>,
  validateTypeWithContext = true
): Promise<void> {
  // ensure first context is 'https://www.w3.org/2018/credentials/v1' as it's mandatory, see https://www.w3.org/TR/vc-data-model/#contexts
  if (
    !Array.isArray(credential["@context"]) ||
    (Array.isArray(credential["@context"]) && credential["@context"][0] !== "https://www.w3.org/2018/credentials/v1")
  ) {
    throw new Error("https://www.w3.org/2018/credentials/v1 needs to be first in the list of contexts");
  }

  // ensure issuer is a valid URI according to RFC3986 IF it is a string
  // TODO check if credential.issuer is string first, as it can be an object containing an id property
  const issuerId = getId(credential.issuer);
  if (!isValidRFC3986(issuerId)) {
    throw new Error("Property 'issuer' id must be a valid RFC 3986 URI");
  }

  // ensure issuanceDate is a valid RFC3339 date, see https://www.w3.org/TR/vc-data-model/#issuance-date
  if (!isValidRFC3339(credential.issuanceDate)) {
    throw new Error("Property 'issuanceDate' must be a valid RFC 3339 date");
  }
  // ensure expirationDate is a valid RFC3339 date, see https://www.w3.org/TR/vc-data-model/#expiration
  if (credential.expirationDate && !isValidRFC3339(credential.expirationDate)) {
    throw new Error("Property 'expirationDate' must be a valid RFC 3339 date");
  }

  // https://www.w3.org/TR/vc-data-model/#types
  if (!credential.type || !Array.isArray(credential.type)) {
    throw new Error("Property 'type' must exist and be an array");
  }
  if (!credential.type.includes("VerifiableCredential")) {
    throw new Error("Property 'type' must have VerifiableCredential as one of the items");
  }
  // if (credential["@context"].length > 1) {
  //   // e.g. type: ["VerifiableCredential"]
  //   if (Array.isArray(credential.type) && credential.type.length == 1) {
  //     throw new Error("Property 'type' must have VerifiableCredential as one of the items");
  //   }
  //   // e.g. type: "VerifiableCredential"
  //   if (typeof credential.type == "string") {
  //     throw new Error("Property 'type' must be string that is 'VerifiableCredential'");
  //   }
  // }
  // const compacted = await compact(credential, "https://www.w3.org/2018/credentials/v1");
  // console.log(JSON.stringify(compacted, null, 2));
  await compact(credential, "https://www.w3.org/2018/credentials/v1", {
    expansionMap: info => {
      console.log(info);
      if (info.unmappedProperty) {
        throw new Error("The property '" + info.unmappedProperty + "' in the input was not defined in the context");
      }
    }
  });

  // console.log(compacted);

  if (validateTypeWithContext) {
    // Check if we can use some other context other than https://w3id.org/security/v2
  }
}

const ajv = new Ajv({ allErrors: true });
ajv.compile(openAttestationSchemav2);
ajv.compile(openAttestationSchemav3);
export const getSchema = (key: string) => ajv.getSchema(key);
