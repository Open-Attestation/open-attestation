import { cloneDeep } from "lodash";
import { Method, OaProofType, OpenAttestationCredential, TemplateType } from "../../__generated__/schema.3.0";
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
      }).toThrow("Unexpected data 'undefined' in 'grades'"); // Cannot convert undefined or null to object?
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
