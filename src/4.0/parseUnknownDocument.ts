import {
  PartialDeep,
  V4OpenAttestationDocument,
  V4SignedWrappedDocument,
  V4WrappedDocument,
  isV4OpenAttestationDocument,
  isV4SignedWrappedDocument,
  isV4WrappedDocument,
} from "./types";

type V4ParsedDocument =
  | {
      version: "4.0";
      type: "raw";
      document: V4OpenAttestationDocument;
    }
  | {
      version: "4.0";
      type: "wrapped";
      document: V4WrappedDocument;
    }
  | {
      version: "4.0";
      type: "signedWrapped";
      document: V4SignedWrappedDocument;
    };
const isPotentialV4 = (document: unknown): document is PartialDeep<V4SignedWrappedDocument> => {
  return V4OpenAttestationDocument.pick({ "@context": true }).passthrough().safeParse(document).success;
};
export function v4ParseUnknownDocument(document: unknown): V4ParsedDocument | null {
  if (isPotentialV4(document)) {
    if (document.proof) {
      // only wrapped/signedWrapped document has proof
      if (document.proof.signature) {
        // only signedWrapped document has signature
        if (isV4SignedWrappedDocument(document)) {
          return {
            version: "4.0",
            type: "signedWrapped",
            document,
          };
        }
        return null;
      }
      if (isV4WrappedDocument(document)) {
        return {
          version: "4.0",
          type: "wrapped",
          document,
        };
      }
      return null;
    }
    if (isV4OpenAttestationDocument(document)) {
      return {
        version: "4.0",
        type: "raw",
        document,
      };
    }
    return null;
  }
  return null;
}
