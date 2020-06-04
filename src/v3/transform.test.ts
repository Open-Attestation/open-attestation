import { mapWrappedDocumentToVerifiableCredential } from "./transform";
import sampleDocument from "../v2/schema/sample-document.json";
import { wrapDocument } from "../index";
import { OpenAttestationDocument } from "../__generated__/schemaV2";
const typedSampleDocument = sampleDocument as OpenAttestationDocument;

describe("", () => {
  it("should work", async () => {
    const wrappedDocument = await wrapDocument(typedSampleDocument);
    const x = mapWrappedDocumentToVerifiableCredential(wrappedDocument, { issuerId: "https://example.com" });
    console.log(JSON.stringify(x, null, 2));
    expect(true).toBeTruthy();
  });
});
