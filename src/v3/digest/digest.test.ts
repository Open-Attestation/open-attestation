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
    type: OaProofType.OpenAttestationProofMethod,
    method: Method.DocumentStore,
    value: "0xED2E50434Ac3623bAD763a35213DAD79b43208E4"
  }
};

describe("digest v3.0", () => {
  describe("digestDocument", () => {
    test("digests a document with all visible content correctly", () => {
      const document = cloneDeep(sampleDoc);

      // We shouldn't use create salts on every test here as it's non-deterministic
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
      const expectedDigest = "100ffe750d2ac887d9c4def00849dc7c08b21bba4a351883a6fc57b8c12d7474";
      expect(digest).toEqual(expectedDigest);
    });
  });

  describe("salt", () => {
    test("handles shadowed keys correctly (type 1: root, dot notation)", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        "oaProof.value": "0xSomeMaliciousDocumentStore, this would be at oaProof.value after flatMap if uncaught"
      };
      expect(() => {
        salt(document);
      }).toThrow("Key names must not have . in them");
    });
    test("handles shadowed keys correctly (type 2: root, array index)", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        "type[1]": "MaliciousCredential, this would be at type[1] after flatMap if uncaught"
      };
      expect(() => {
        salt(document);
      }).toThrow("Key names must not have '[' or ']' in them");
    });
    test("handles shadowed keys correctly (type 3: nested as object, dot notation)", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        nested: {
          "oaProof.value":
            "0xSomeMaliciousDocumentStore, this would be at nested.oaProof.value after flatMap if uncaught"
        }
      };
      expect(() => {
        salt(document);
      }).toThrow("Key names must not have . in them");
    });
    test("handles shadowed keys correctly (type 4: nested as object, array index)", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        nested: { "type[1]": "this would be at nested.type[1] after flatMap if uncaught" }
      };
      expect(() => {
        salt(document);
      }).toThrow("Key names must not have '[' or ']' in them");
    });
    test("handles shadowed keys correctly (type 5: nested as array, dot notation)", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        nested: [{ "shadowed.key": "this would be at nested[0].shadowed.key after flatMap if uncaught" }]
      };
      expect(() => {
        salt(document);
      }).toThrow("Key names must not have . in them");
    });
    test("handles shadowed keys correctly (type 6: nested as array, array index)", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        nested: [{ "type[1]": "this would be at nested[0].type[1] after flatMap if uncaught" }]
      };
      expect(() => {
        salt(document);
      }).toThrow("Key names must not have '[' or ']' in them");
    });

    test("handles null values correctly", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        grades: null
      };
      const salted = salt(document);
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades" }));
    });
    test("handles undefined values correctly", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        grades: undefined
      };
      expect(() => {
        salt(document);
      }).toThrow("Unexpected value 'undefined' in 'grades'"); // Cannot convert undefined or null to object?
    });
    test("handles numbers and booleans correctly", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        grades: ["A+", 100, 50.28, true, "B+"]
      };
      const salted = salt(document);
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[0]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[1]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[2]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[3]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[4]" }));
    });
    test("handles sparse arrays correctly", () => {
      const document = {
        ...cloneDeep(sampleDoc),
        grades: ["A+", 100, , , , true, "B+"]
      };
      const salted = salt(document);
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[0]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[1]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[5]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[6]" }));
      expect(salted).not.toContainEqual(expect.objectContaining({ path: "grades[2]" }));
      expect(salted).not.toContainEqual(expect.objectContaining({ path: "grades[3]" }));
      expect(salted).not.toContainEqual(expect.objectContaining({ path: "grades[4]" }));
    });
  });
});
