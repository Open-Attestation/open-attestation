import { ProofType, SchemaId, sign, validateSchema, verifySignature, wrapDocument, wrapDocuments } from "../..";
import { ethers } from "ethers";
import { IdentityProofType, OpenAttestationDocument } from "../../__generated__/schema.2.0";

const openAttestationDatav2: OpenAttestationDocument & { foo: string } = {
  issuers: [
    {
      name: "John",
      identityProof: {
        type: IdentityProofType.DNSTxt,
        location: "tradetrust.io"
      },
      documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
    }
  ],
  foo: "bar"
};

describe("2.0 E2E Test Scenarios", () => {
  describe("Issuing a single documents", () => {
    test("should create a wrapped 2.0 document", async () => {
      const wrappedDocument = await wrapDocument(openAttestationDatav2);
      expect(wrappedDocument.data.foo).toEqual(expect.stringContaining("bar"));
      expect(wrappedDocument.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocument.signature.targetHash).toBeDefined();
      expect(wrappedDocument.signature.merkleRoot).toBeDefined();
      expect(wrappedDocument.signature.proof).toEqual([]);
      expect(wrappedDocument.signature.merkleRoot).toBe(wrappedDocument.signature.targetHash);
    });
    test("should create a wrapped 2.0 document with a signed proof block", async () => {
      const wrappedDocument = await wrapDocument(openAttestationDatav2);
      const options = {
        privateKey: "0x0123456789012345678901234567890123456789012345678901234567890123",
        verificationMethod: "0x14791697260E4c9A71f18484C9f997B308e59325",
        type: ProofType.EcdsaSecp256k1Signature2019
      };
      const signed = await sign(wrappedDocument, options);
      const { proof } = signed;
      if (!proof) throw new Error("No proof!");
      const msg = wrappedDocument.signature.targetHash;
      const recoverAddress = ethers.utils.verifyMessage(msg, proof.signature);
      expect(recoverAddress.toLowerCase()).toStrictEqual(options.verificationMethod.toLowerCase());
    });
    test("should create a wrapped 2.0 document when issuer contains additional data", async () => {
      const wrappedDocument = await wrapDocument({
        ...openAttestationDatav2,
        issuers: [
          {
            ...openAttestationDatav2.issuers[0],
            url: "https://some.example.io"
          }
        ]
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
          laurent: "task force, assemble!!"
        } as OpenAttestationDocument
      ];
      const action = () => wrapDocuments(malformedDatum);
      expect(action).toThrow("Invalid document");
    });

    test("creates a batch of documents if all are in the right format", async () => {
      const wrappedDocuments = await wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json"
      });
      wrappedDocuments.forEach(doc => {
        expect(doc.schema).toBe("http://example.com/schema.json");
        expect(doc.signature.type).toBe("SHA3MerkleProof");
        expect(doc.signature.targetHash).toBeDefined();
        expect(doc.signature.merkleRoot).toBeDefined();
        expect(doc.signature.merkleRoot).not.toStrictEqual(doc.signature.targetHash);
        expect(doc.signature.proof.length).toEqual(1);
      });
    });
    test("checks that documents are wrapped correctly", async () => {
      const wrappedDocuments = await wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json"
      });
      const verified = wrappedDocuments.reduce((prev, curr) => verifySignature(curr) && prev, true);
      expect(verified).toBe(true);
    });
    test("checks that documents conforms to the schema", async () => {
      const wrappedDocuments = await wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json"
      });
      const validatedSchema = wrappedDocuments.reduce((prev: boolean, curr: any) => validateSchema(curr) && prev, true);
      expect(validatedSchema).toBe(true);
    });
    test("does not allow for same merkle root to be generated", async () => {
      const wrappedDocuments = await wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json"
      });
      const newWrappedDocuments = await wrapDocuments([openAttestationDatav2, openAttestationDatav2], {
        externalSchemaId: "http://example.com/schema.json"
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
            key: 2
          },
          signature: {
            merkleRoot: "0xabc",
            proofs: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
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
                  type: "DNS-TXT"
                }
              }
            ],
            key: 2
          },
          signature: {
            type: "SHA3MerkleProof",
            targetHash: "0xabcd",
            proof: [],
            merkleRoot: "0xabcd"
          }
        })
      ).toStrictEqual(true);
    });
    test("should default to 2.0 when document is valid and version is undefined", () => {
      expect(
        validateSchema({
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore run test with version being undefined to only ignore that part
          version: undefined,
          data: {
            issuers: [
              {
                name: "issuer.name",
                certificateStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
              }
            ]
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
        })
      ).toStrictEqual(true);
    });
  });
});
