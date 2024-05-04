import type { Diagnose } from "../shared/utils/@types/diagnose";
import { V4WrappedDocument, V4SignedWrappedDocument, V4Document } from "./types";

export const v4Diagnose: Diagnose = ({ document, kind, debug }) => {
  let Validator: typeof V4Document | typeof V4WrappedDocument | typeof V4SignedWrappedDocument = V4Document;
  if (kind === "raw") {
    Validator = V4Document;
  } else if (kind === "wrapped") {
    Validator = V4WrappedDocument;
  } else {
    Validator = V4SignedWrappedDocument;
  }

  const results = Validator.safeParse(document);

  if (results.success) {
    return [];
  }

  return results.error.errors.map(({ code, message, path }) => {
    const errorMessage = `${code}: ${message} at ${path.join(".")}`;
    if (debug) {
      console.debug(errorMessage);
    }
    return {
      message: errorMessage,
    };
  });
};
