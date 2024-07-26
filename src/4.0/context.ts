import { fetch } from "cross-fetch";
import { expand, Options, JsonLdDocument } from "jsonld";
import { contextsMap } from "./contexts/__generated__";

export const ContextUrl = {
  w3c_vc_v2: "https://www.w3.org/ns/credentials/v2",
  oa_vc_v4: "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
} as const;

export const ContextType = {
  BaseContext: "VerifiableCredential",
  OAV4Context: "OpenAttestationCredential",
} as const;

const contextCache: Map<string, Record<any, any>> = new Map();

let isFirstLoad = true;
// https://github.com/digitalbazaar/jsonld.js?tab=readme-ov-file#custom-document-loader
// FIXME: @types/json-ld seems to be outdated as callback is supposed to be options
const documentLoader: Options.DocLoader["documentLoader"] = async (url, _) => {
  // On first load: Preload hardcoded contexts so that no network call is necessary
  if (isFirstLoad) {
    isFirstLoad = false;
    for (const [url, value] of contextsMap) {
      const parsed = JSON.parse(value);
      contextCache.set(url, parsed);
    }
  }
  if (contextCache.get(url)) {
    return {
      contextUrl: undefined, // this is for a context via a link header
      document: contextCache.get(url), // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  } else {
    const document = await fetch(url).then((res) => res.json());
    return { contextUrl: undefined, document, documentUrl: url };
  }
};

export const interpretContexts = async (input: JsonLdDocument) => {
  const expanded = await expand(input, { documentLoader }).catch((e) => {
    throw new UnableToInterpretContextError(JSON.stringify(e, null, 2));
  });

  const type = (expanded[0]["@type"] as string[]) || [];
  const unknownTypes = type.filter((t) => t.startsWith("https://www.w3.org/ns/credentials/issuer-dependent#")); // Workaround as expansionMap no longer supported

  if (unknownTypes.length > 0) {
    throw new UnableToInterpretContextError(`Unknown types found: ${unknownTypes.map((t) => t.split("#")[1])}`);
  }
};

export class UnableToInterpretContextError extends Error {
  constructor(details: string) {
    super(`Unable to interpret @context:\n${details}`);
    Object.setPrototypeOf(this, UnableToInterpretContextError.prototype);
  }
}

/**
 * Convert URL to a filename-safe string
 * @param url string
 * @returns string
 */
export function urlToSafeFilename(url: string) {
  return url.replace(/[/\\?%*:|"<>]/g, "-");
}
