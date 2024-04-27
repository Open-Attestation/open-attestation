import { W3cVerifiableCredential, V4Document, V4WrappedDocument, V4SignedWrappedDocument } from "../types";
import { RAW_DOCUMENT_DID, SIGNED_WRAPPED_DOCUMENT_DID, WRAPPED_DOCUMENT_DID } from "../fixtures";

describe("V4.0 guard", () => {
  describe("given a raw document", () => {
    test("should pass w3c vc validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = RAW_DOCUMENT_DID;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(RAW_DOCUMENT_DID);
    });

    test("should pass document validation without removal of any data", () => {
      const results = V4Document.parse(RAW_DOCUMENT_DID);
      expect(results).toEqual(RAW_DOCUMENT_DID);
    });

    test("should fail wrapped document validation", () => {
      const results = V4WrappedDocument.safeParse(RAW_DOCUMENT_DID);
      expect(results.success).toBe(false);
      expect((results as { error: unknown }).error).toMatchInlineSnapshot(`
          [ZodError: [
            {
              "code": "invalid_type",
              "expected": "object",
              "received": "undefined",
              "path": [
                "proof"
              ],
              "message": "Required"
            }
          ]]
        `);
    });

    test("should fail signed wrapped document validation", () => {
      const results = V4SignedWrappedDocument.safeParse(RAW_DOCUMENT_DID);
      expect(results.success).toBe(false);
      expect((results as { error: unknown }).error).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_type",
            "expected": "object",
            "received": "undefined",
            "path": [
              "proof"
            ],
            "message": "Required"
          }
        ]]
      `);
    });
  });

  describe("given a wrapped document", () => {
    test("should pass w3c vc validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = WRAPPED_DOCUMENT_DID;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(WRAPPED_DOCUMENT_DID);
    });

    test("should pass document validation without removal of any data", () => {
      const v4Document: V4Document = WRAPPED_DOCUMENT_DID;
      const results = V4Document.parse(v4Document);
      expect(results).toEqual(WRAPPED_DOCUMENT_DID);
    });

    test("should pass wrapped document validation without removal of any data", () => {
      const results = V4WrappedDocument.parse(WRAPPED_DOCUMENT_DID);
      expect(results).toEqual(WRAPPED_DOCUMENT_DID);
    });

    test("should fail signed wrapped document validation", () => {
      const results = V4SignedWrappedDocument.safeParse(WRAPPED_DOCUMENT_DID);
      expect(results.success).toBe(false);
      expect((results as { error: unknown }).error).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "proof",
              "key"
            ],
            "message": "Required"
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "proof",
              "signature"
            ],
            "message": "Required"
          }
        ]]
      `);
    });
  });

  describe("given a signed wrapped document", () => {
    test("should pass w3c vc validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = SIGNED_WRAPPED_DOCUMENT_DID;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT_DID);
    });

    test("should pass document validation without removal of any data", () => {
      const v4Document: V4Document = SIGNED_WRAPPED_DOCUMENT_DID;
      const results = V4Document.parse(v4Document);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT_DID);
    });

    test("should pass wrapped document validation without removal of any data", () => {
      const v4WrappedDocument: V4WrappedDocument = SIGNED_WRAPPED_DOCUMENT_DID;
      const results = V4WrappedDocument.parse(v4WrappedDocument);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT_DID);
    });

    test("should pass signed wrapped document validation without removal of any data", () => {
      const results = V4SignedWrappedDocument.parse(SIGNED_WRAPPED_DOCUMENT_DID);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT_DID);
    });
  });
});
