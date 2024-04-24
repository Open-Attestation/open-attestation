import { expand, Options, JsonLdDocument } from "jsonld";
import { fetch } from "cross-fetch";

export const ContextUrl = {
  v2_vc: "https://www.w3.org/ns/credentials/v2",
  v4_alpha: "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
} as const;

export const ContextType = {
  BaseContext: "VerifiableCredential",
  V4AlphaContext: "OpenAttestationCredential",
} as const;

export const REQUIRED_CONTEXT_LIST = [ContextUrl.v2_vc, ContextUrl.v4_alpha] as const;

const contexts: Map<string, any> = new Map();

// Preload frequently used contexts
// https://github.com/digitalbazaar/jsonld.js?tab=readme-ov-file#custom-document-loader
let isFirstLoad = true;
// FIXME: @types/json-ld seems to be outdated as callback is supposed to be options
const documentLoader: Options.DocLoader["documentLoader"] = async (url, _) => {
  if (isFirstLoad) {
    isFirstLoad = false;
    for (const url of REQUIRED_CONTEXT_LIST) {
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
    throw new Error(`Unable to interpret @context: ${JSON.stringify(e)}`);
  });

  const type = (expanded[0]["@type"] as string[]) || [];
  const unknownTypes = type.filter((t) => t.startsWith("https://www.w3.org/ns/credentials/issuer-dependent#")); // Workaround as expansionMap no longer supported

  if (unknownTypes.length > 0) {
    throw new Error(`Unable to interpret @context: type (${unknownTypes.map((t) => t.split("#")[1])}) is not mapped`);
  }
};
