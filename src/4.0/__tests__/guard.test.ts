import { SUPPORTED_SIGNING_ALGORITHM } from "../../shared/@types/sign";
import { RAW_DOCUMENT_DID } from "../fixtures";
import { digestVc } from "../digest";
import { signVc } from "../sign";
import {
  W3cVerifiableCredential,
  OAVerifiableCredential,
  Digested,
  DigestedOAVerifiableCredential,
  Signed,
  SignedOAVerifiableCredential,
} from "../types";

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
} satisfies OAVerifiableCredential;

describe("V4.0 guard", () => {
  let WRAPPED_DOCUMENT: Digested;
  let SIGNED_WRAPPED_DOCUMENT: Signed;
  beforeAll(async () => {
    WRAPPED_DOCUMENT = await digestVc(RAW_DOCUMENT);
    SIGNED_WRAPPED_DOCUMENT = await signVc(RAW_DOCUMENT, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
      public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
    });
  });

  describe("given a raw document", () => {
    test("should pass w3c vc validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = RAW_DOCUMENT_DID;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(RAW_DOCUMENT_DID);
    });

    test("should pass document validation without removal of any data", () => {
      const results = OAVerifiableCredential.parse(RAW_DOCUMENT_DID);
      expect(results).toEqual(RAW_DOCUMENT_DID);
    });

    test("should fail wrapped document validation", () => {
      const results = DigestedOAVerifiableCredential.safeParse(RAW_DOCUMENT_DID);
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
      const results = SignedOAVerifiableCredential.safeParse(RAW_DOCUMENT_DID);
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
      const v4Document: OAVerifiableCredential = WRAPPED_DOCUMENT;
      const results = OAVerifiableCredential.parse(v4Document);
      expect(results).toEqual(WRAPPED_DOCUMENT);
    });

    test("should pass wrapped document validation without removal of any data", () => {
      const results = DigestedOAVerifiableCredential.parse(WRAPPED_DOCUMENT);
      expect(results).toEqual(WRAPPED_DOCUMENT);
    });

    test("should fail signed wrapped document validation", () => {
      const results = SignedOAVerifiableCredential.safeParse(WRAPPED_DOCUMENT);
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
      const v4Document: OAVerifiableCredential = SIGNED_WRAPPED_DOCUMENT;
      const results = OAVerifiableCredential.parse(v4Document);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT);
    });

    test("should pass wrapped document validation without removal of any data", () => {
      const v4WrappedDocument: Digested = SIGNED_WRAPPED_DOCUMENT;
      const results = DigestedOAVerifiableCredential.parse(v4WrappedDocument);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT);
    });

    test("should pass signed wrapped document validation without removal of any data", () => {
      const results = SignedOAVerifiableCredential.parse(SIGNED_WRAPPED_DOCUMENT);
      expect(results).toEqual(SIGNED_WRAPPED_DOCUMENT);
    });
  });
});
