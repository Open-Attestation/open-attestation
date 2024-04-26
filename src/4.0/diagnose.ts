import { Diagnose } from "src/shared/utils/@types/diagnose";
import { V4WrappedDocument, V4SignedWrappedDocument } from "./types";

export const v4Diagnose: Diagnose = ({ document, kind, debug }) => {
  const Validator = kind === "signed" ? V4SignedWrappedDocument : V4WrappedDocument;

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
