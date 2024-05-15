import { SUPPORTED_SIGNING_ALGORITHM } from "../../shared/@types/sign";
import { RAW_DOCUMENT_DID } from "../fixtures";
import { signDocument } from "../sign";
import {
  W3cVerifiableCredential,
  V4OpenAttestationDocument,
  V4WrappedDocument,
  V4SignedWrappedDocument,
} from "../types";
import { wrapDocument } from "../wrap";

const RAW_DOCUMENT = {
  ...RAW_DOCUMENT_DID,
  credentialSubject: {
    ...RAW_DOCUMENT_DID.credentialSubject,
    attachments: [
      {
        mimeType: "image/png",
        filename: "aaa",
        data: "abcd",
      },
    ],
  },
} satisfies V4OpenAttestationDocument;

describe("V4.0 guard", () => {
  let WRAPPED_DOCUMENT: V4WrappedDocument;
  let SIGNED_WRAPPED_DOCUMENT: V4SignedWrappedDocument;
  beforeAll(async () => {
    WRAPPED_DOCUMENT = await wrapDocument(RAW_DOCUMENT);
    SIGNED_WRAPPED_DOCUMENT = await signDocument(
      WRAPPED_DOCUMENT,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      {
        public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
      }
    );
  });

  describe("given a raw document", () => {
    test("should pass w3c vc validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = RAW_DOCUMENT_DID;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(RAW_DOCUMENT_DID);
    });

    test("should pass document validation without removal of any data", () => {
      const results = V4OpenAttestationDocument.parse(RAW_DOCUMENT_DID);
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
      const w3cVerifiableCredential: W3cVerifiableCredential = WRAPPED_DOCUMENT;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(WRAPPED_DOCUMENT);
    });

    test("should pass document validation without removal of any data", () => {
      const v4Document: V4OpenAttestationDocument = WRAPPED_DOCUMENT;
      const results = V4OpenAttestationDocument.parse(v4Document);
      expect(results).toEqual(WRAPPED_DOCUMENT);
    });

    test("should pass wrapped document validation without removal of any data", () => {
      const results = V4WrappedDocument.parse(WRAPPED_DOCUMENT);
      expect(results).toEqual(WRAPPED_DOCUMENT);
    });

    test("should fail signed wrapped document validation", () => {
      const results = V4SignedWrappedDocument.safeParse(WRAPPED_DOCUMENT);
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
      const w3cVerifiableCredential: W3cVerifiableCredential = SIGNED_WRAPPED_DOCUMENT;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT);
    });

    test("should pass document validation without removal of any data", () => {
      const v4Document: V4OpenAttestationDocument = SIGNED_WRAPPED_DOCUMENT;
      const results = V4OpenAttestationDocument.parse(v4Document);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT);
    });

    test("should pass wrapped document validation without removal of any data", () => {
      const v4WrappedDocument: V4WrappedDocument = SIGNED_WRAPPED_DOCUMENT;
      const results = V4WrappedDocument.parse(v4WrappedDocument);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT);
    });

    test("should pass signed wrapped document validation without removal of any data", () => {
      const results = V4SignedWrappedDocument.parse(SIGNED_WRAPPED_DOCUMENT);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT);
    });
  });
});
