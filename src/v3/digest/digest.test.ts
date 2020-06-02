import { cloneDeep } from "lodash";
import { digestDocument } from "./digest";
import { Method, OaProofType, TemplateType, OpenAttestationCredential } from "../../__generated__/schemaV3";
import { salt } from "../wrap";

const sampleDoc: OpenAttestationCredential = {
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
    value: "0xED2E50434Ac3623bAD763a35213DAD79b43208E4"
  }
};

describe("digest v3.0", () => {
  describe("digestDocument", () => {
    test("digests a document with all visible content correctly", () => {
      const document = cloneDeep(sampleDoc);

      // We shouldn't use const salts = salt(document); here as it's non-deterministic
      const salts = [
        { value: "dcc8c555-017d-433e-8a72-8b985e4b5fa8", path: "@context[0]" },
        { value: "f24b43bf-8262-4d93-af69-3c059bb00f6a", path: "@context[1]" },
        { value: "ade3ccd1-32ec-4f97-9635-b53dec282c8b", path: "id" },
        { value: "d3ec986c-2dd7-4c8a-be46-7c77c958f825", path: "type[0]" },
        { value: "ae4bdeaf-9d96-40ae-8ac7-15cd85e6c62c", path: "type[1]" },
        { value: "8f4be04a-98af-4439-9c87-10fbf3e4c270", path: "issuer" },
        { value: "05657d2e-aa0a-4869-8227-780cb52fb56a", path: "issuanceDate" },
        { value: "bb8169f7-7562-46ee-9219-3b871943ea03", path: "credentialSubject.id" },
        { value: "7773bc06-7187-4cc5-a3ba-87eed615718a", path: "credentialSubject.alumniOf" },
        { value: "aee0854b-8c4b-4673-aba9-d98f655b9a20", path: "template.name" },
        { value: "a418299a-571b-425c-8f82-e9f874fa6a10", path: "template.type" },
        { value: "fd131c95-1c3b-490c-87cc-585efa2882c7", path: "template.url" },
        { value: "b730ce97-cd3a-4bad-8802-13b5d8e2d27f", path: "oaProof.type" },
        { value: "10978571-432e-4b5b-90c0-8f976a4de712", path: "oaProof.method" },
        { value: "0934ec15-452d-420a-95e3-aa33ad6b417d", path: "oaProof.value" }
      ];
      const digest = digestDocument(document, salts, []);
      const expectedDigest = "a54fb763afbe8608c073d1d90490a7591bb074cb54f72654c7437c6e4aaab908";
      expect(digest).toEqual(expectedDigest);
    });
    test("handles shadowed keys correctly", () => {
      const document = { ...cloneDeep(sampleDoc), "oaProof.value": "0xSomeMaliciousDocumentStore" };
      expect(salt(document)).toThrow("Key names must not have . in them");
    });
  });
});
