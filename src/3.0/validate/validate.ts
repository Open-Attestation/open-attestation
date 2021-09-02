import { OpenAttestationDocument } from "../../__generated__/schema.3.0";
import { WrappedDocument } from "../../3.0/types";
import { documentLoaders, expand } from "jsonld";
import fetch from "cross-fetch";

const getId = (objectOrString: string | { id: string }): string => {
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
  "".concat(timeHour.source, ":").concat(timeMinute.source, ":").concat(timeSecond.source).concat(timeSecFrac.source)
);
const fullDate = new RegExp("".concat(dateFullYear.source, "-").concat(dateMonth.source, "-").concat(dateMDay.source));
const fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
const rfc3339 = new RegExp("".concat(fullDate.source, "[ tT]").concat(fullTime.source));

const isValidRFC3339 = (str: any) => {
  return rfc3339.test(str);
};

/* Based on https://tools.ietf.org/html/rfc3986 and https://github.com/ajv-validator/ajv/search?q=uri&unscoped_q=uri */
const uri =
  /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
const rfc3986 = new RegExp(uri);

const isValidRFC3986 = (str: any) => {
  return rfc3986.test(str);
};

const preloadedContextList = [
  "https://www.w3.org/2018/credentials/v1",
  "https://www.w3.org/2018/credentials/examples/v1",
  "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
  "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
  "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
];
const contexts: Map<string, Promise<any>> = new Map();
const nodeDocumentLoader = documentLoaders.xhr ? documentLoaders.xhr() : documentLoaders.node();
let preload = true;

const documentLoader = async (url: string) => {
  if (preload) {
    preload = false;
    for (const url of preloadedContextList) {
      contexts.set(
        url,
        fetch(url, { headers: { accept: "application/json" } }).then((res: any) => res.json())
      );
    }
  }
  if (contexts.get(url)) {
    const promise = contexts.get(url);
    return {
      contextUrl: undefined, // this is for a context via a link header
      document: await promise, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  } else {
    const promise = nodeDocumentLoader(url);
    contexts.set(
      url,
      promise.then(({ document }) => document)
    );
    return promise;
  }
};

export async function validateW3C<T extends OpenAttestationDocument>(credential: WrappedDocument<T>): Promise<void> {
  // ensure first context is 'https://www.w3.org/2018/credentials/v1' as it's mandatory, see https://www.w3.org/TR/vc-data-model/#contexts
  if (
    !Array.isArray(credential["@context"]) ||
    (Array.isArray(credential["@context"]) && credential["@context"][0] !== "https://www.w3.org/2018/credentials/v1")
  ) {
    throw new Error("https://www.w3.org/2018/credentials/v1 needs to be first in the list of contexts");
  }

  // ensure issuer is a valid URI according to RFC3986
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

  await expand(credential, {
    expansionMap: (info) => {
      if (info.unmappedProperty) {
        throw new Error(
          `"The property ${info.activeProperty ? `${info.activeProperty}.` : ""}${
            info.unmappedProperty
          } in the input was not defined in the context"`
        );
      }
    },
    documentLoader,
  });
}
