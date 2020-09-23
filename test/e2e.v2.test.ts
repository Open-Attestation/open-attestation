/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  IdentityProofType as v2IdentityProofType,
  OpenAttestationDocument as v2OpenAttestationDocument,
  RevocationType
} from "../src/__generated__/schemaV2";
import { obfuscateDocument, ProofType, SchemaId, sign, validateSchema, verifySignature, wrapDocument } from "../src";
import { ethers } from "ethers";

const openAttestationDatav2: v2OpenAttestationDocument & { foo: string } = {
  issuers: [
    {
      name: "John",
      identityProof: {
        type: v2IdentityProofType.DNSTxt,
        location: "tradetrust.io"
      },
      documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
    }
  ],
  foo: "bar"
};

describe("v2 E2E Test Scenarios", () => {
  describe("Issuing a single documents", () => {
    test("should create a wrapped v2 document", () => {
      const wrappedDocument = wrapDocument(openAttestationDatav2);
      expect(wrappedDocument.data.foo).toEqual(expect.stringContaining("bar"));
      expect(wrappedDocument.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocument.signature.targetHash).toBeDefined();
      expect(wrappedDocument.signature.merkleRoot).toBeDefined();
      expect(wrappedDocument.signature.proof).toEqual([]);
      expect(wrappedDocument.signature.merkleRoot).toBe(wrappedDocument.signature.targetHash);
    });
    test("should create a wrapped v2 document with a signed proof block", async () => {
      const wrappedDocument = wrapDocument(openAttestationDatav2);
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
    test("should create a wrapped v2 document when issuer contains additional data", () => {
      const wrappedDocument = wrapDocument({
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
    test("should create a wrapped v2 document using did", () => {
      const wrappedDocument = wrapDocument({
        ...openAttestationDatav2,
        issuers: [
          {
            id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            name: "DEMO STORE",
            revocation: { type: RevocationType.None },
            identityProof: {
              type: v2IdentityProofType.Did,
              key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller"
            }
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
    test("should create a wrapped v2 document using did-dns", () => {
      const wrappedDocument = wrapDocument({
        ...openAttestationDatav2,
        issuers: [
          {
            id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            name: "DEMO STORE",
            revocation: { type: RevocationType.None },
            identityProof: {
              type: v2IdentityProofType.DNSDid,
              key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
              location: "example.tradetrust.io"
            }
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
  describe("obfuscation", () => {
    test("obfuscate data when there is one field to obfuscate", async () => {
      const newDocument = wrapDocument({ key1: "value1", ...openAttestationDatav2 }, { version: SchemaId.v2 });
      const obfuscatedDocument = obfuscateDocument(newDocument, ["key1"]);

      expect(verifySignature(obfuscatedDocument)).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
      expect(obfuscatedDocument.data.key1).toBeUndefined();
    });
    test("obfuscate data when there are multiple fields to obfuscate", async () => {
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

    test("obfuscate data when the obfuscated field is the last element of an object", async () => {
      const newDocument = wrapDocument(
        { key1: "value1", key2: { key22: "value22" }, ...openAttestationDatav2 },
        { version: SchemaId.v2 }
      );
      const firstObfuscatedDocument = obfuscateDocument(newDocument, ["key2.key22"]);
      expect(verifySignature(firstObfuscatedDocument)).toBe(true);
      expect(validateSchema(firstObfuscatedDocument)).toBe(true);
      expect(firstObfuscatedDocument.data.key2).toStrictEqual({});

      // let's make sure we can obfuscate the full object again after
      const secondObfuscatedDocument = obfuscateDocument(newDocument, ["key2"]);
      expect(verifySignature(secondObfuscatedDocument)).toBe(true);
      expect(validateSchema(secondObfuscatedDocument)).toBe(true);
      expect(secondObfuscatedDocument.data.key2).toBeUndefined();
      expect(firstObfuscatedDocument.privacy!.obfuscatedData).toStrictEqual(
        secondObfuscatedDocument.privacy!.obfuscatedData
      );
    });
  });
});
