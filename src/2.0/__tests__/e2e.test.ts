import { SchemaId, validateSchema, verifySignature, wrapDocument, wrapDocuments } from "../..";
import { IdentityProofType, OpenAttestationDocument, RevocationType } from "../../__generated__/schema.2.0";
import { obfuscateDocument } from "../../index";

const openAttestationDatav2: OpenAttestationDocument & { foo: string } = {
  issuers: [
    {
      name: "John",
      identityProof: {
        type: IdentityProofType.DNSTxt,
        location: "tradetrust.io",
      },
      documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
    },
  ],
  foo: "bar",
};

describe("2.0 E2E Test Scenarios", () => {
  describe("Issuing a single documents", () => {
    test("should create a wrapped 2.0 document", () => {
      const wrappedDocument = wrapDocument(openAttestationDatav2);
      expect(wrappedDocument.data.foo).toEqual(expect.stringContaining("bar"));
      expect(wrappedDocument.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocument.signature.targetHash).toBeDefined();
      expect(wrappedDocument.signature.merkleRoot).toBeDefined();
      expect(wrappedDocument.signature.proof).toEqual([]);
      expect(wrappedDocument.signature.merkleRoot).toBe(wrappedDocument.signature.targetHash);
    });
    test("should create a wrapped v2 document when issuer contains additional data", () => {
      const wrappedDocument = wrapDocument({
        ...openAttestationDatav2,
        issuers: [
          {
            ...openAttestationDatav2.issuers[0],
            url: "https://some.example.io",
          },
        ],
      });
      expect(wrappedDocument.data.foo).toEqual(expect.stringContaining("bar"));
      expect(wrappedDocument.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocument.signature.targetHash).toBeDefined();
      expect(wrappedDocument.signature.merkleRoot).toBeDefined();
      expect(wrappedDocument.signature.proof).toEqual([]);
      expect(wrappedDocument.signature.merkleRoot).toBe(wrappedDocument.signature.targetHash);
    });
    test("should create a wrapped v2 document using did", () => {
      const wrappedDocument = wrapDocument({
        ...openAttestationDatav2,
        issuers: [
          {
            id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            name: "DEMO STORE",
            revocation: { type: RevocationType.None },
            identityProof: {
              type: IdentityProofType.Did,
              key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            },
          },
        ],
      });
      expect(wrappedDocument.data.foo).toEqual(expect.stringContaining("bar"));
      expect(wrappedDocument.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocument.signature.targetHash).toBeDefined();
      expect(wrappedDocument.signature.merkleRoot).toBeDefined();
      expect(wrappedDocument.signature.proof).toEqual([]);
      expect(wrappedDocument.signature.merkleRoot).toBe(wrappedDocument.signature.targetHash);
    });
    test("should create a wrapped v2 document using did-dns", () => {
      const wrappedDocument = wrapDocument({
        ...openAttestationDatav2,
        issuers: [
          {
            id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            name: "DEMO STORE",
            revocation: { type: RevocationType.None },
            identityProof: {
              type: IdentityProofType.DNSDid,
              key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
              location: "example.tradetrust.io",
            },
          },
        ],
      });
      expect(wrappedDocument.data.foo).toEqual(expect.stringContaining("bar"));
      expect(wrappedDocument.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocument.signature.targetHash).toBeDefined();
      expect(wrappedDocument.signature.merkleRoot).toBeDefined();
      expect(wrappedDocument.signature.proof).toEqual([]);
      expect(wrappedDocument.signature.merkleRoot).toBe(wrappedDocument.signature.targetHash);
    });
  });
  describe("Issuing a batch of documents", () => {
    test("fails if there is a malformed document", () => {
      const malformedDatum = [
        openAttestationDatav2,
        // @ts-expect-error not a valid OpenAttestationDocument
        {
          laurent: "task force, assemble!!",
        } as OpenAttestationDocument,
      ];
      const action = () => wrapDocuments(malformedDatum);
      expect(action).toThrow("Invalid document");
    });

    test("creates a batch of documents if all are in the right format", () => {
      const wrappedDocuments = wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json",
      });
      wrappedDocuments.forEach((doc) => {
        expect(doc.schema).toBe("http://example.com/schema.json");
        expect(doc.signature.type).toBe("SHA3MerkleProof");
        expect(doc.signature.targetHash).toBeDefined();
        expect(doc.signature.merkleRoot).toBeDefined();
        expect(doc.signature.merkleRoot).not.toStrictEqual(doc.signature.targetHash);
        expect(doc.signature.proof.length).toEqual(1);
      });
    });
    test("checks that documents are wrapped correctly", () => {
      const wrappedDocuments = wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json",
      });
      const verified = wrappedDocuments.reduce((prev, curr) => verifySignature(curr) && prev, true);
      expect(verified).toBe(true);
    });
    test("checks that documents conforms to the schema", () => {
      const wrappedDocuments = wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json",
      });
      const validatedSchema = wrappedDocuments.reduce((prev: boolean, curr: any) => validateSchema(curr) && prev, true);
      expect(validatedSchema).toBe(true);
    });
    test("does not allow for same merkle root to be generated", () => {
      const wrappedDocuments = wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json",
      });
      const newWrappedDocuments = wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json",
      });
      expect(wrappedDocuments[0].signature.merkleRoot).not.toBe(newWrappedDocuments[0].signature.merkleRoot);
    });
  });

  describe("validate", () => {
    test("should throw an error if document id is not a valid open attestation schema version", () => {
      const action = () =>
        validateSchema({
          version: "abababa" as SchemaId,
          schema: "http://example.com/schemaV3.json",
          data: {
            key: 2,
          },
          signature: {
            merkleRoot: "0xabc",
            proofs: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof",
          },
        });
      expect(action).toThrow("No schema validator provided");
    });
    test("should return true when document is valid and version is 2.0", () => {
      expect(
        validateSchema({
          version: "https://schema.openattestation.com/2.0/schema.json",
          data: {
            issuers: [
              {
                name: "issuer name",
                documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
                identityProof: {
                  location: "aa.com",
                  type: "DNS-TXT",
                },
              },
            ],
            key: 2,
          },
          signature: {
            type: "SHA3MerkleProof",
            targetHash: "0xabcd",
            proof: [],
            merkleRoot: "0xabcd",
          },
        })
      ).toStrictEqual(true);
    });
    test("should default to 2.0 when document is valid and version is undefined", () => {
      expect(
        validateSchema({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore run test with version being undefined to only ignore that part
          version: undefined,
          data: {
            issuers: [
              {
                name: "issuer.name",
                certificateStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
              },
            ],
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof",
          },
        })
      ).toStrictEqual(true);
    });
  });

  describe("obfuscation", () => {
    test("obfuscate data when there is one field to obfuscate", () => {
      const newDocument = wrapDocument({ key1: "value1", ...openAttestationDatav2 }, { version: SchemaId.v2 });
      const obfuscatedDocument = obfuscateDocument(newDocument, ["key1"]);

      expect(verifySignature(obfuscatedDocument)).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
      expect(obfuscatedDocument.data.key1).toBeUndefined();
    });
    test("obfuscate data when there are multiple fields to obfuscate", () => {
      const newDocument = wrapDocument(
        { key1: "value1", key2: "value2", key3: "value3", ...openAttestationDatav2 },
        { version: SchemaId.v2 }
      );
      const obfuscatedDocument = obfuscateDocument(newDocument, ["key2", "key3"]);

      expect(verifySignature(obfuscatedDocument)).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
      expect(obfuscatedDocument.data.key2).toBeUndefined();
      expect(obfuscatedDocument.data.key3).toBeUndefined();
    });
    test("obfuscate data transistively", () => {
      const newDocument = wrapDocument(
        { key1: "value1", key2: "value2", key3: "value3", ...openAttestationDatav2 },
        { version: SchemaId.v2 }
      );
      const intermediateDocument = obfuscateDocument(newDocument, ["key2"]);
      const obfuscatedDocument = obfuscateDocument(intermediateDocument, ["key3"]);

      const comparison = obfuscateDocument(intermediateDocument, ["key2", "key3"]);

      expect(comparison).toEqual(obfuscatedDocument);
    });
  });
});
