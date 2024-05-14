import { v2ParseUnknownDocument } from "../../2.0/parseUnknownDocument";
import { v4ParseUnknownDocument } from "../../4.0/parseUnknownDocument";

const PARSERS = [v2ParseUnknownDocument, v4ParseUnknownDocument] as const satisfies ReadonlyArray<
  (document: unknown) => { version: string; type: string; document: unknown } | "invalid" | undefined
>;
export function parseUnknownDocument(document: unknown) {
  for (const parser of PARSERS) {
    const results = parser(document);
    if (results === "invalid") {
      throw new Error("Cannot determine version of document");
    }

    if (results) {
      return results;
    }
  }

  throw new Error("Cannot determine version of document");
}
