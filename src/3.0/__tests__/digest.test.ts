import { cloneDeep } from "lodash";
import { digestDocument } from "../digest";
import { Method, OaProofType, TemplateType, OpenAttestationCredential } from "../../__generated__/schemaV3";
import { salt } from "../salt";

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
    test.only("digests a document with all visible content correctly", () => {
      const document = cloneDeep(sampleDoc);

      // We shouldn't use create salts on every test here as it's non-deterministic
      const salts = [
        { value: "89123829-7e61-4ca6-857e-ac8010a66c0e", path: "@context[0]" },
        { value: "5c01e18a-39ce-4ce2-a59b-ae3ff1ab2d23", path: "@context[1]" },
        { value: "0165773b-2152-4242-9ecd-e71aee065a12", path: "id" },
        { value: "af17b85f-453c-4eb3-8fa0-9743534f2a18", path: "type[0]" },
        { value: "0bdde7f5-eced-4db4-9668-48abc08706ca", path: "type[1]" },
        { value: "6141d384-46b5-4183-a1da-5f4324942863", path: "issuer" },
        { value: "309d8fe8-913e-4685-8d83-d62ee6aaa7fe", path: "issuanceDate" },
        { value: "c1025dee-b3d2-4fdd-a978-d32123031650", path: "credentialSubject.id" },
        { value: "113f8135-aaf9-443a-abff-f14eccab5bf8", path: "credentialSubject.alumniOf" },
        { value: "029f5aff-f2f7-4d61-af0f-630e6462d3e8", path: "template.name" },
        { value: "c3b860a9-d1ab-46b9-9ecf-dea21866b2fd", path: "template.type" },
        { value: "c0e371d0-8e84-4cf4-b94f-ac48eed7e449", path: "template.url" },
        { value: "f7b73f94-3519-443e-b6c3-444840e0b640", path: "oaProof.type" },
        { value: "2455dff1-7655-46ed-ab8d-30d50ce3a4aa", path: "oaProof.method" },
        { value: "cb0cba26-ba29-4908-b61b-99860465db17", path: "oaProof.value" }
      ];
      const digest = digestDocument(document, salts, []);
      const expectedDigest = "02079edf9898f1e9317554a9366f176c8b7fc46754f916ee63ab3aa8a40b7140";
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
