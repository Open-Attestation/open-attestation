const { sign, verify } = require("./signature");

const unsignedDocument = {
  data: {
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
    it("returns false for documents without signature", () => {
      const verified = verify(unsignedDocument);
      expect(verified).to.equal(false);
    });

    it("returns false for documents with altered data", () => {
      const signedDocument = {
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
          targetHash:
            "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot:
            "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(signedDocument);
      expect(verified).to.equal(false);
    });

    it("returns false for documents with altered targetHash", () => {
      const signedDocument = {
        ...unsignedDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash:
            "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518d",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot:
            "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(signedDocument);
      expect(verified).to.equal(false);
    });

    it("returns false for documents with altered proofs", () => {
      const signedDocument = {
        ...unsignedDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash:
            "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe798",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot:
            "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(signedDocument);
      expect(verified).to.equal(false);
    });

    it("returns false for documents with altered merkleRoot", () => {
      const signedDocument = {
        ...unsignedDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash:
            "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot:
            "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521a"
        }
      };
      const verified = verify(signedDocument);
      expect(verified).to.equal(false);
    });

    it("returns true for correctly signed document", () => {
      const signedDocument = {
        ...unsignedDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash:
            "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot:
            "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };
      const verified = verify(signedDocument);
      expect(verified).to.equal(true);
    });
  });

  describe("sign", () => {
    it("throws when the document is not in the batch", () => {
      const emptySign = () => sign(unsignedDocument, []);
      expect(emptySign).to.throw("Document is not in batch");
    });

    it("signs correctly for single document", () => {
      const expectedSignedDocument = {
        ...unsignedDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash:
            "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [],
          merkleRoot:
            "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c"
        }
      };

      const signedDocument = sign(unsignedDocument);
      expect(signedDocument).to.deep.equal(expectedSignedDocument);
    });

    it("signs correctly for document in a batch", () => {
      const batch = [
        "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
        "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
        "7ba10b40626cd6e57c9f9b6264996932259ad79053e8d1225b0336ed06e83bf0",
        "d7e0f88baaa5b389a7e031c0939522e1bd3e30146a47141a1192918c6e53926c"
      ];
      const expectedSignedDocument = {
        ...unsignedDocument,
        signature: {
          type: "SHA3MerkleProof",
          targetHash:
            "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
          proof: [
            "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
            "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
          ],
          merkleRoot:
            "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
        }
      };

      const signedDocument = sign(unsignedDocument, batch);
      expect(signedDocument).to.deep.equal(expectedSignedDocument);
    });

    it("signs correctly regardless of batch ordering", () => {
      const batch1 = [
        "7ba10b40626cd6e57c9f9b6264996932259ad79053e8d1225b0336ed06e83bf0",
        "d7e0f88baaa5b389a7e031c0939522e1bd3e30146a47141a1192918c6e53926c",
        "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
        "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799"
      ];
      const batch2 = [
        "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
        "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
        "7ba10b40626cd6e57c9f9b6264996932259ad79053e8d1225b0336ed06e83bf0",
        "d7e0f88baaa5b389a7e031c0939522e1bd3e30146a47141a1192918c6e53926c"
      ];

      expect(sign(unsignedDocument, batch1)).to.deep.equal(
        sign(unsignedDocument, batch2)
      );
    });
  });
});
