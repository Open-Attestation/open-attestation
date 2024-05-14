import { OpenAttestationDocument, WrappedDocument, SignedWrappedDocument } from "./types";
import { isRawV2Document, isSignedWrappedV2Document, isWrappedV2Document } from "../shared/utils/guard";
import { SchemaId } from "../shared/@types/document";
import { PartialDeep } from "../4.0/types";

type V2ParsedDocument =
  | {
      version: "2.0";
      type: "raw";
      document: OpenAttestationDocument;
    }
  | {
      version: "2.0";
      type: "wrapped";
      document: WrappedDocument;
    }
  | {
      version: "2.0";
      type: "signedWrapped";
      document: SignedWrappedDocument;
    };

const isPotentialV2 = (document: unknown): document is PartialDeep<SignedWrappedDocument> => {
  return (document as SignedWrappedDocument)?.version === SchemaId.v2;
};
const isPotentialV2OpenAttestationDocument = (document: unknown): document is PartialDeep<OpenAttestationDocument> => {
  return (document as OpenAttestationDocument).$template !== undefined;
};
export function v2ParseUnknownDocument(document: unknown): V2ParsedDocument | null {
  if (isPotentialV2(document)) {
    if (document.proof) {
      if (isSignedWrappedV2Document(document)) {
        return {
          version: "2.0",
          type: "signedWrapped",
          document,
        };
      }
      return null;
    }
    if (isWrappedV2Document(document)) {
      return {
        version: "2.0",
        type: "wrapped",
        document,
      };
    }
    return null;
  }

  if (isPotentialV2OpenAttestationDocument(document)) {
    if (isRawV2Document(document)) {
      return {
        version: "2.0",
        type: "raw",
        document,
      };
    }
  }

  return null;
}
