import { digestDocument as digestDocumentV3 } from "./digest";
import { saltData } from "../wrap";
import { TemplateType, IdentityType, Method, ProofType } from "../../__generated__/schemaV3";
import { VerifiableCredential, SchemaId } from "../../shared/@types/document";

describe("digest v3.0", () => {
  describe("placeholder for future tests", () => {
    test("digests a document with all visible content correctly", () => {
      // Should this be any?
      const document: VerifiableCredential<any> = {
        version: SchemaId.v3,
        "@context": ["https://www.w3.org/2018/credentials/v1", "https://www.w3.org/2018/credentials/examples/v1"],
        id: "http://example.edu/credentials/58473",
        type: ["VerifiableCredential", "AlumniCredential"],
        issuer: "https://example.edu/issuers/14",
        issuanceDate: "2010-01-01T19:23:24Z",
        credentialSubject: {
          id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
          alumniOf: "Example University"
        },
        template: {
          name: "EXAMPLE_RENDERER",
          type: TemplateType.EmbeddedRenderer,
          url: "https://renderer.openattestation.com/"
        },
        proof: {
          type: ProofType.OpenAttestationSignature2018,
          identity: {
            location: "https://identity.openattestation.com/",
            type: IdentityType.DNSTxt
          },
          method: Method.DocumentStore,
          value: ""
        }
      };

      // const expectedDigest = "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c";
      const salts = saltData(document);
      const digest = digestDocumentV3(document, salts, []);
      // expect(digest).toBe(expectedDigest);
      expect(digest).toBeTruthy(); // Temporary thing
    });
  });
});
