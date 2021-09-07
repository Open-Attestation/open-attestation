import { SignedWrappedDocument } from "../@types/document";
import {
  OpenAttestationDocument as OpenAttestationDocumentV3,
  WrappedDocument as WrappedDocumentV3,
} from "../../3.0/types";
import {
  OpenAttestationDocument as OpenAttestationDocumentV2,
  WrappedDocument as WrappedDocumentV2,
} from "../../2.0/types";
import { diagnose } from "./diagnose";
import { Mode } from "./@types/diagnose";

/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export const isRawV2Document = (
  document: any,
  { mode }: { mode: Mode } = { mode: "non-strict" }
): document is OpenAttestationDocumentV2 => {
  return diagnose({ version: "2.0", kind: "raw", document, debug: false, mode }).length === 0;
};

/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export const isRawV3Document = (
  document: any,
  { mode }: { mode: Mode } = { mode: "non-strict" }
): document is OpenAttestationDocumentV3 => {
  return diagnose({ version: "3.0", kind: "raw", document, debug: false, mode }).length === 0;
};

/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export const isWrappedV3Document = (
  document: any,
  { mode }: { mode: Mode } = { mode: "non-strict" }
): document is WrappedDocumentV3<OpenAttestationDocumentV3> => {
  return diagnose({ version: "3.0", kind: "wrapped", document, debug: false, mode }).length === 0;
};

/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export const isWrappedV2Document = (
  document: any,
  { mode }: { mode: Mode } = { mode: "non-strict" }
): document is WrappedDocumentV2<OpenAttestationDocumentV2> => {
  return diagnose({ version: "2.0", kind: "wrapped", document, debug: false, mode }).length === 0;
};

/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export const isSignedWrappedV2Document = (
  document: any,
  { mode }: { mode: Mode } = { mode: "non-strict" }
): document is SignedWrappedDocument<OpenAttestationDocumentV2> => {
  return diagnose({ version: "2.0", kind: "signed", document, debug: false, mode }).length === 0;
};

/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export const isSignedWrappedV3Document = (
  document: any,
  { mode }: { mode: Mode } = { mode: "non-strict" }
): document is SignedWrappedDocument<OpenAttestationDocumentV3> => {
  return diagnose({ version: "3.0", kind: "signed", document, debug: false, mode }).length === 0;
};
