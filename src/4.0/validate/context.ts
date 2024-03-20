import jsonld, { expand, Options, JsonLdDocument } from "jsonld";
import { ContextUrl } from "../../shared/@types/document";

const preloadedContextList = [ContextUrl.v2_vc, ContextUrl.v4_alpha];
const contexts: Map<string, any> = new Map();

// FIXME: @types/json-ld seems to be outdated as documentLoaders is not typed
const nodeDocumentLoader = (jsonld as any).documentLoaders.node();

// Preload frequently used contexts
// https://github.com/digitalbazaar/jsonld.js?tab=readme-ov-file#custom-document-loader
let isFirstLoad = true;
const documentLoader: Options.DocLoader["documentLoader"] = async (url, callback) => {
  if (isFirstLoad) {
    isFirstLoad = false;
    for (const url of preloadedContextList) {
      contexts.set(url, (await nodeDocumentLoader(url)).document);
    }
  }
  if (contexts.get(url)) {
    return {
      contextUrl: undefined, // this is for a context via a link header
      document: contexts.get(url), // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  } else {
    return nodeDocumentLoader(url);
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
