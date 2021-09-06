import { diagnose } from "../diagnose";
import {
  __unsafe__use__it__at__your__own__risks__wrapDocument,
  SchemaId,
  signDocument,
  SUPPORTED_SIGNING_ALGORITHM,
  wrapDocument,
  WrappedDocument,
} from "../../..";
import * as v3 from "../../../3.0/types";
import * as v2 from "../../../2.0/types";
import { omit } from "lodash";

describe("diagnose", () => {
  let wrappedV3Document: WrappedDocument<v3.OpenAttestationDocument>;
  let signedV2Document: v2.SignedWrappedDocument;

  const rawV3Document: v3.OpenAttestationDocument = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
      "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    ],
    issuer: {
      name: "name",
      id: "https://example.com",
    },
    issuanceDate: "2010-01-01T19:23:24Z",
    type: ["VerifiableCredential", "UniversityDegreeCredential", "OpenAttestationCredential"],
    credentialSubject: {
      id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
      degree: {
        type: "BachelorDegree",
        name: "Bachelor of Science and Arts",
      },
    },
    openAttestationMetadata: {
      proof: {
        value: "0xabcf",
        type: v3.ProofType.OpenAttestationProofMethod,
        method: v3.Method.DocumentStore,
      },
      template: {
        url: "https://",
        name: "",
        type: v3.TemplateType.EmbeddedRenderer,
      },
      identityProof: {
        identifier: "whatever",
        type: v2.IdentityProofType.DNSTxt,
      },
    },
    name: "",
    reference: "",
    validFrom: "2010-01-01T19:23:24Z",
  };

  const rawV2Document: v2.OpenAttestationDocument = {
    $template: {
      name: "main",
      type: v2.TemplateType.EmbeddedRenderer,
      url: "https://tutorial-renderer.openattestation.com",
    },
    issuers: [
      {
        name: "John",
        documentStore: "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
        identityProof: {
          type: v2.IdentityProofType.DNSTxt,
          location: "example.com",
        },
      },
    ],
  };

  const wrappedV2Document: WrappedDocument<v2.OpenAttestationDocument> = wrapDocument(rawV2Document);

  beforeAll(async () => {
    wrappedV3Document = await __unsafe__use__it__at__your__own__risks__wrapDocument(rawV3Document, {
      version: SchemaId.v3,
    });

    signedV2Document = await signDocument(wrappedV2Document, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
      public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
    });
  });

  describe("3.0", () => {
    it("should return an error when document is empty", () => {
      expect(diagnose({ version: "3.0", kind: "wrapped", document: null, mode: "non-strict" })).toMatchInlineSnapshot(`
        Array [
          Object {
            "message": "The document must not be empty",
          },
        ]
      `);
    });

    it("should not return an error when document is valid", () => {
      expect(
        diagnose({ version: "3.0", kind: "wrapped", document: wrappedV3Document, mode: "non-strict" })
      ).toMatchInlineSnapshot(`Array []`);
    });

    it("should return an error when document does not have issuer", () => {
      expect(
        diagnose({ version: "3.0", kind: "wrapped", document: omit(wrappedV3Document, "issuer"), mode: "non-strict" })
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "message": "The document does not match OpenAttestation schema 3.0",
          },
          Object {
            "message": "document - must have required property 'issuer'",
          },
        ]
      `);
    });

    it("should return an error when raw document is not version 3", () => {
      expect(diagnose({ version: "3.0", kind: "raw", document: rawV2Document, mode: "non-strict" }))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "message": "The document does not match OpenAttestation schema 3.0",
          },
          Object {
            "message": "document - must have required property '@context'",
          },
          Object {
            "message": "document - must have required property 'type'",
          },
          Object {
            "message": "document - must have required property 'credentialSubject'",
          },
          Object {
            "message": "document - must have required property 'issuer'",
          },
          Object {
            "message": "document - must have required property 'issuanceDate'",
          },
          Object {
            "message": "document - must have required property 'openAttestationMetadata'",
          },
        ]
      `);
    });

    it("should not return an error when raw document is version 3", () => {
      expect(
        diagnose({ version: "3.0", kind: "raw", document: rawV3Document, mode: "non-strict" })
      ).toMatchInlineSnapshot(`Array []`);
    });
  });

  describe("2.0", () => {
    it("should return an error when document is empty", () => {
      expect(diagnose({ version: "2.0", kind: "wrapped", document: null, mode: "non-strict" })).toMatchInlineSnapshot(`
        Array [
          Object {
            "message": "The document must not be empty",
          },
        ]
      `);
    });

    it("should not return an error when document is valid", () => {
      expect(
        diagnose({ version: "2.0", kind: "signed", document: signedV2Document, mode: "non-strict" })
      ).toMatchInlineSnapshot(`Array []`);
    });

    it("should return an error when document does not have issuer", () => {
      expect(
        diagnose({
          version: "2.0",
          kind: "signed",
          document: omit(signedV2Document, "data.issuers"),
          mode: "non-strict",
        })
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "message": "The document does not match OpenAttestation schema 2.0",
          },
          Object {
            "message": "document - must have required property 'issuers'",
          },
        ]
      `);
    });

    it("should return an error when raw document is not version 2", () => {
      expect(diagnose({ version: "2.0", kind: "raw", document: rawV3Document, mode: "non-strict" }))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "message": "The document does not match OpenAttestation schema 2.0",
          },
          Object {
            "message": "document - must have required property 'issuers'",
          },
        ]
      `);
    });

    it("should not return an error when raw document is version 2", () => {
      expect(
        diagnose({ version: "2.0", kind: "raw", document: rawV2Document, mode: "non-strict" })
      ).toMatchInlineSnapshot(`Array []`);
      console.log(diagnose({ version: "2.0", kind: "raw", document: rawV2Document, mode: "non-strict" }));
    });
  });
});
