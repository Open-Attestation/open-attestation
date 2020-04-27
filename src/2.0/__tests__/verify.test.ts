import { verify } from "../verify";

import { SchemaId, SchematisedDocument } from "../../shared/@types/document";

const rawDocument: SchematisedDocument = {
  version: SchemaId.v2,
  schema: "foo",
  data: {
    //@ts-expect-error it's not an open attestation document
    key1: "value1",
    key2: {
      "key2-1": "value2-1",
      "key2-2": "value2-2",
      "key2-3": ["value2-3-1", "value2-3-2", "value2-3-3"]
    },
    key3: ["value3-1", "value3-2"]
  }
};

describe("signature", () => {
  describe("verify", () => {
    test("returns false for documents without signature", () => {
      const verified = verify(rawDocument);
      expect(verified).toBe(false);
    });

    test("returns false for documents with altered data", () => {
      const wrappedDocument = {
        data: {
          key1: "value2", // Was 'value1'
          key2: {
            "key2-1": "value2-1",
            "key2-2": "value2-2",
            "key2-3": ["value2-3-1", "value2-3-2", "value2-3-3"]
          },
          key3: ["value3-1", "value3-2"]
        },
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot: "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(wrappedDocument);
      expect(verified).toBe(false);
    });

    test("returns false for documents with additional data", () => {
      const wrappedDocument = {
        data: {
          key1: "value1",
          key2: {
            "key2-1": "value2-1",
            "key2-2": "value2-2",
            "key2-3": ["value2-3-1", "value2-3-2", "value2-3-3"],
            "key2-4": "value2-4" // This has been added after targetHash was calculated
          },
          key3: ["value3-1", "value3-2"]
        },
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot: "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(wrappedDocument);
      expect(verified).toBe(false);
    });

    test("returns false for documents with missing data", () => {
      const wrappedDocument = {
        data: {
          key1: "value1",
          key2: {
            // "key2-1": "value2-1", // This value is part of the original targetHash
            "key2-2": "value2-2",
            "key2-3": ["value2-3-1", "value2-3-2", "value2-3-3"]
          },
          key3: ["value3-1", "value3-2"]
        },
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot: "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(wrappedDocument);
      expect(verified).toBe(false);
    });

    test("returns false for documents with altered targetHash", () => {
      const wrappedDocument = {
        ...rawDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518d",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot: "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(wrappedDocument);
      expect(verified).toBe(false);
    });

    test("returns false for documents with altered proofs", () => {
      const wrappedDocument = {
        ...rawDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe798",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot: "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(wrappedDocument);
      expect(verified).toBe(false);
    });

    test("returns false for documents with altered merkleRoot", () => {
      const wrappedDocument = {
        ...rawDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot: "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521a"
        }
      };
      const verified = verify(wrappedDocument);
      expect(verified).toBe(false);
    });

    test("returns true for correctly wrapped document", () => {
      const wrappedDocument = {
        ...rawDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot: "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(wrappedDocument);
      expect(verified).toBe(true);
    });
  });
});
