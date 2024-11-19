import type { Diagnose } from "../shared/utils/@types/diagnose";
import { OAVerifiableCredential, DigestedOAVerifiableCredential, SignedOAVerifiableCredential } from "./types";

export const v4Diagnose: Diagnose = ({ document, kind, debug }) => {
  let Validator:
    | typeof OAVerifiableCredential
    | typeof DigestedOAVerifiableCredential
    | typeof SignedOAVerifiableCredential = OAVerifiableCredential;
  if (kind === "raw") {
    Validator = OAVerifiableCredential;
  } else if (kind === "wrapped") {
    Validator = DigestedOAVerifiableCredential;
  } else {
    Validator = SignedOAVerifiableCredential;
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
