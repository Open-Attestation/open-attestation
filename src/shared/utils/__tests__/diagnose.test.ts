import { diagnose } from "../diagnose";
import { signDocument, SUPPORTED_SIGNING_ALGORITHM } from "../../..";
import * as v2 from "../../../2.0/types";
import { omit } from "lodash";
import * as v2RawDocument from "../../../../test/fixtures/v2/raw-document.json";
import * as v3RawDocument from "../../../../test/fixtures/v3/raw-document.json";
import * as v2WrappedVerifiableDocument from "../../../../test/fixtures/v2/not-obfuscated-wrapped.json";
import * as v3WrappedVerifiableDocument from "../../../../test/fixtures/v3/not-obfuscated-wrapped.json";
describe("diagnose", () => {
  let v2SignedDocument: v2.SignedWrappedDocument;

  beforeAll(async () => {
    const wrappedDocument: v2.WrappedDocument<v2.OpenAttestationDocument> = v2WrappedVerifiableDocument as any;
    v2SignedDocument = await signDocument(wrappedDocument, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
      public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
    });
  });

  describe("3.0", () => {
    it("should return an error when document is empty", () => {
      expect(diagnose({ version: "3.0", kind: "wrapped", document: null, mode: "non-strict" })).toMatchInlineSnapshot(`
        [
          {
            "message": "The document must not be empty",
          },
        ]
      `);
    });

    it("should not return an error when document is valid", () => {
      expect(
        diagnose({ version: "3.0", kind: "wrapped", document: v3WrappedVerifiableDocument, mode: "non-strict" })
      ).toMatchInlineSnapshot(`[]`);
    });

    it("should return an error when document does not have issuer", () => {
      expect(
        diagnose({
          version: "3.0",
          kind: "wrapped",
          document: omit(v3WrappedVerifiableDocument, "issuer"),
          mode: "non-strict",
        })
      ).toMatchInlineSnapshot(`
        [
          {
            "message": "The document does not match OpenAttestation schema 3.0",
          },
          {
            "message": "document - must have required property 'issuer'",
          },
        ]
      `);
    });

    it("should return an error when raw document is not version 3", () => {
      expect(diagnose({ version: "3.0", kind: "raw", document: v2RawDocument, mode: "non-strict" }))
        .toMatchInlineSnapshot(`
        [
          {
            "message": "The document does not match OpenAttestation schema 3.0",
          },
          {
            "message": "document - must have required property '@context'",
          },
          {
            "message": "document - must have required property 'type'",
          },
          {
            "message": "document - must have required property 'credentialSubject'",
          },
          {
            "message": "document - must have required property 'issuer'",
          },
          {
            "message": "document - must have required property 'issuanceDate'",
          },
          {
            "message": "document - must have required property 'openAttestationMetadata'",
          },
        ]
      `);
    });

    it("should not return an error when raw document is version 3", () => {
      expect(
        diagnose({ version: "3.0", kind: "raw", document: v3RawDocument, mode: "non-strict" })
      ).toMatchInlineSnapshot(`[]`);
    });
  });

  describe("2.0", () => {
    it("should return an error when document is empty", () => {
      expect(diagnose({ version: "2.0", kind: "wrapped", document: null, mode: "non-strict" })).toMatchInlineSnapshot(`
        [
          {
            "message": "The document must not be empty",
          },
        ]
      `);
    });

    it("should not return an error when document is valid", () => {
      expect(
        diagnose({ version: "2.0", kind: "signed", document: v2SignedDocument, mode: "non-strict" })
      ).toMatchInlineSnapshot(`[]`);
    });

    it("should return an error when document does not have issuer", () => {
      expect(
        diagnose({
          version: "2.0",
          kind: "signed",
          document: omit(v2SignedDocument, "data.issuers"),
          mode: "non-strict",
        })
      ).toMatchInlineSnapshot(`
        [
          {
            "message": "The document does not match OpenAttestation schema 2.0",
          },
          {
            "message": "document - must have required property 'issuers'",
          },
        ]
      `);
    });

    it("should return an error when raw document is not version 2", () => {
      expect(diagnose({ version: "2.0", kind: "raw", document: v3RawDocument, mode: "non-strict" }))
        .toMatchInlineSnapshot(`
        [
          {
            "message": "The document does not match OpenAttestation schema 2.0",
          },
          {
            "message": "document - must have required property 'issuers'",
          },
          {
            "message": "/attachments/0 - must have required property 'filename'",
          },
          {
            "message": "/attachments/0 - must have required property 'type'",
          },
          {
            "message": "/attachments/0 - must NOT have additional properties",
          },
          {
            "message": "/attachments/0 - must NOT have additional properties",
          },
        ]
      `);
    });

    it("should not return an error when raw document is version 2", () => {
      expect(
        diagnose({ version: "2.0", kind: "raw", document: v2RawDocument, mode: "non-strict" })
      ).toMatchInlineSnapshot(`[]`);
    });
  });
});
