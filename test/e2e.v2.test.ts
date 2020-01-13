import {
  IdentityProofType as v2IdentityProofType,
  OpenAttestationDocument as v2OpenAttestationDocument
} from "../src/__generated__/schemaV2";
import { wrapDocument } from "../src";

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
  });
});
