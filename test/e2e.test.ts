import {
  addSchema,
  getData,
  issueDocument,
  issueDocuments,
  obfuscateDocument,
  validateSchema,
  verifySignature
  // @ts-ignore 
} from "../dist/cjs/index"; 
// Disable tslint import/no-unresolved for this because it usually doesn't exist until build runs

type IssueDocumentReturnType = ReturnType<typeof issueDocument>

const schema = {
  $id: "http://example.com/schema-v1.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    key1: {
      type: "string"
    },
    key2: {
      type: "string"
    },
    key3: {
      type: "number"
    },
    key4: {
      type: "boolean"
    }
  },
  required: ["key1"],
  additionalProperties: false
};

const datum = [
  {
    key1: "test"
  },
  {
    key1: "hello",
    key2: "item2"
  },
  {
    key1: "item1",
    key2: "true",
    key3: 3.14159,
    key4: false
  },
  {
    key1: "item2"
  }
];

describe("E2E Test Scenarios", () => {
  describe("Issuing a single documents", () => {
    const document = datum[0];
    let signedDocument: IssueDocumentReturnType;

    test("fails for malformed data", () => {
      const malformedData = {
        ...document,
        key3: "moooo"
      };
      const action = () => issueDocument(malformedData, schema);
      expect(action).toThrow("Invalid document");
    });

    beforeAll(() => {
      signedDocument = issueDocument(document, schema);
    });

    test("creates a signed document", () => {
      expect(signedDocument.schema).toBe("http://example.com/schema-v1.json");
      expect(signedDocument.data.key1).toEqual(expect.stringContaining("test"));
      expect(signedDocument.signature.type).toBe("SHA3MerkleProof");
      expect(signedDocument.signature.targetHash).toBeDefined();
      expect(signedDocument.signature.merkleRoot).toBeDefined();
      expect(signedDocument.signature.proof).toEqual([]);
      expect(signedDocument.signature.merkleRoot).toBe(signedDocument.signature.targetHash);
    });

    test("checks that document is signed correctly", () => {
      const verified = verifySignature(signedDocument);
      expect(verified).toBe(true);
    });

    test("checks that document conforms to the schema", () => {
      addSchema(schema);
      const validatedSchema = validateSchema(signedDocument);
      expect(validatedSchema).toBe(true);
    });

    test("checks that data extracted are the same as input", () => {
      const data = getData(signedDocument);
      expect(data).toEqual(datum[0]);
    });

    test("does not allow for the same merkle root to be generated", () => {
      const newDocument = issueDocument(document, schema);
      expect(signedDocument.signature.merkleRoot).not.toBe(newDocument.signature.merkleRoot);
    });

    test("obfuscate data correctly", () => {
      const newDocument = issueDocument(datum[2], schema);
      const obfuscatedDocument = obfuscateDocument(newDocument, ["key2"]);

      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      const validatedSchema = validateSchema(obfuscatedDocument);
      expect(validatedSchema).toBe(true);
    });

    test("obfuscate data transistively", () => {
      const newDocument = issueDocument(datum[2], schema);
      const intermediateDocument = obfuscateDocument(newDocument, ["key2"]);
      const obfuscatedDocument = obfuscateDocument(intermediateDocument, ["key3"]);

      const comparison = obfuscateDocument(intermediateDocument, ["key2", "key3"]);

      expect(comparison).toEqual(obfuscatedDocument);
    });
  });

  describe("Issuing a batch of documents", () => {
    let signedDocuments: IssueDocumentReturnType;

    beforeAll(() => {
      signedDocuments = issueDocuments(datum, schema);
    });

    test("fails if there is a malformed document", () => {
      const malformedDatum = [
        ...datum,
        {
          cow: "moo"
        }
      ];
      const action = () => issueDocument(malformedDatum, schema);
      expect(action).toThrow("Invalid document");
    });

    test("creates a batch of documents if all are in the right format", () => {
      signedDocuments.forEach((doc: IssueDocumentReturnType, i: number) => {
        expect(doc.schema).toBe("http://example.com/schema-v1.json");
        expect(doc.signature.type).toBe("SHA3MerkleProof");
        expect(doc.data.key1).toEqual(expect.stringContaining(datum[i].key1));
        expect(doc.signature.targetHash).toBeDefined();
        expect(doc.signature.merkleRoot).toBeDefined();
        expect(doc.signature.proof.length).toEqual(2);
      });
    });

    test("checks that documents are signed correctly", () => {
      const verified = signedDocuments.reduce((prev: boolean, curr: boolean) => verifySignature(curr) && prev, true);
      expect(verified).toBe(true);
    });

    test("checks that documents conforms to the schema", () => {
      addSchema(schema);
      const validatedSchema = signedDocuments.reduce((prev: boolean, curr: boolean) => validateSchema(curr) && prev, true);
      expect(validatedSchema).toBe(true);
    });

    test("checks that data extracted are the same as input", () => {
      signedDocuments.forEach((doc: IssueDocumentReturnType, i: number) => {
        const data = getData(doc);
        expect(data).toEqual(datum[i]);
      });
    });

    test("does not allow for same merkle root to be generated", () => {
      const newSignedDocuments = issueDocuments(datum, schema);
      expect(signedDocuments[0].signature.merkleRoot).not.toBe(newSignedDocuments[0].signature.merkleRoot);
    });
  });
});
