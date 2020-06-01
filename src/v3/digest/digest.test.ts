import { digestDocument } from "./digest";
import { salt } from "../wrap";
import { Method, OaProofType, TemplateType } from "../../__generated__/schemaV3";
import { SchemaId, OpenAttestationVerifiableCredential } from "../../shared/@types/document";

describe("digest v3.0", () => {
  describe("placeholder for future tests", () => {
    test("digests a document with all visible content correctly", () => {
      // TODO: fix this
      // it's not correct
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document: OpenAttestationVerifiableCredential = {
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
        oaProof: {
          type: OaProofType.OpenAttestationSignature2018,
          method: Method.DocumentStore,
          value: ""
        }
      };

      const salts = salt(document);
      const digest = digestDocument(document, salts, []);
      expect(digest).toBeTruthy();
    });
  });
});
