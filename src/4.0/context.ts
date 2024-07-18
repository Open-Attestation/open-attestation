import { expand, Options, JsonLdDocument } from "jsonld";
import { fetch } from "cross-fetch";

export const ContextUrl = {
  w3c_vc_v2: "https://www.w3.org/ns/credentials/v2",
  oa_vc_v4: "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
} as const;

export const ContextType = {
  BaseContext: "VerifiableCredential",
  OAV4Context: "OpenAttestationCredential",
} as const;

const preloadedContextList = [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4];
const contexts: Map<string, any> = new Map();

// Preload frequently used contexts
// https://github.com/digitalbazaar/jsonld.js?tab=readme-ov-file#custom-document-loader
let isFirstLoad = true;
// FIXME: @types/json-ld seems to be outdated as callback is supposed to be options
const documentLoader: Options.DocLoader["documentLoader"] = async (url, _) => {
  if (isFirstLoad) {
    isFirstLoad = false;
    for (const url of preloadedContextList) {
      const document = await fetch(url).then((res) => res.json());
      contexts.set(url, document);
    }
  }
  if (contexts.get(url)) {
    return {
      contextUrl: undefined, // this is for a context via a link header
      document: contexts.get(url), // this is the actual document that was loaded
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
