import * as utils from "../utils";
import { wrapDocument } from "../../..";
import { WrappedDocument } from "../../../shared/@types/document";
import * as v2 from "../../../__generated__/schema.2.0";
import * as v3 from "../../../__generated__/schema.3.0";
import * as v2WrappedVerifiableDocument from "../../../../test/fixtures/v2/not-obfuscated-wrapped.json";
import * as v3WrappedVerifiableDocument from "../../../../test/fixtures/v3/not-obfuscated-wrapped.json";
import * as v2WrappedDidDocument from "../../../../test/fixtures/v2/did-wrapped.json";
import * as v3WrappedDidDocument from "../../../../test/fixtures/v3/did-wrapped.json";
import * as v2WrappedTransferableDocument from "../../../../test/fixtures/v2/wrapped-transferable-document.json";
import * as v3WrappedTransferableDocument from "../../../../test/fixtures/v3/wrapped-transferable-document.json";

describe("Util Functions", () => {
  describe("hashArray", () => {
    test("should work", () => {
      const res = utils.hashArray(["a", "b", "1", 5]);

      const expectedHashResults = [
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc",
        "9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2",
        "a78c7e6cf27e778ce55aaa2a786943f1578bc76edcb296abc95981c786bb89c1",
        "ceebf77a833b30520287ddd9478ff51abbdffa30aa90a8d655dba0e8a79ce0c1",
      ];

      expect(res.map((p) => p.toString("hex"))).toEqual(expectedHashResults);
    });
  });

  describe("bufSortJoin", () => {
    test("should work", () => {
      const res = utils.bufSortJoin(Buffer.from("c"), Buffer.from("b"), Buffer.from("a"));
      const expectedResults = "616263";
      expect(res.toString("hex")).toEqual(expectedResults);
    });
  });

  describe("hashToBuffer", () => {
    test("should work", () => {
      expect(utils.hashToBuffer("foo")).toEqual(Buffer.from("foo", "hex"));
    });

    test("should do nothing if the input is a hash", () => {
      const originalBuffer = Buffer.from("foo", "utf8");
      expect(utils.hashToBuffer(originalBuffer)).toEqual(originalBuffer);
    });
  });

  describe("toBuffer", () => {
    test("should work", () => {
      expect(utils.toBuffer("foo").toString("hex")).toEqual(
        "837fb5aa99ab7d0392fa43e61f529f072a693fd38032cd4a039793a9f9b4ea42"
      );
    });

    test("should do nothing if the input is a hash", () => {
      const originalBuffer = utils.toBuffer("foo");
      expect(utils.toBuffer(originalBuffer)).toEqual(originalBuffer);
    });
  });

  describe("combineHashBuffers", () => {
    test("should combine two hashes (in buffer format) and return result as a string", () => {
      expect(
        utils
          .combineHashBuffers(
            utils.hashToBuffer("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"),
            utils.hashToBuffer("9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2")
          )
          .toString("hex")
      ).toBe("6a4fe9cb57c9f79964c0408f25d70a73b3448bc6e975d0a905f0f8694764954b");
    });

    test("should return original hash if only one is given", () => {
      expect(
        utils
          .combineHashBuffers(utils.hashToBuffer("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"))
          .toString("hex")
      ).toBe("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc");
      expect(
        utils
          .combineHashBuffers(
            undefined,
            utils.hashToBuffer("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc")
          )
          .toString("hex")
      ).toBe("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc");
    });
  });

  describe("combineHashString", () => {
    test("should combine two hashes (in string format) and return result as a string", () => {
      expect(
        utils.combineHashString(
          "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc",
          "9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2"
        )
      ).toBe("6a4fe9cb57c9f79964c0408f25d70a73b3448bc6e975d0a905f0f8694764954b");
    });

    test("should return original hash if only one is given", () => {
      expect(utils.combineHashString("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc")).toBe(
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
      );
      expect(
        utils.combineHashString(undefined, "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc")
      ).toBe("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc");
    });
  });

  describe("getIssuerAddress", () => {
    test("should return all issuers address for 2.0 document using certificate store", async () => {
      const document: WrappedDocument<v2.OpenAttestationDocument> = await wrapDocument({
        issuers: [
          {
            certificateStore: "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
            name: "nameA",
          },
          {
            certificateStore: "0x1234123412341234123412341234123412341234",
            name: "nameA",
          },
        ],
      });
      expect(utils.getIssuerAddress(document)).toStrictEqual([
        "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
        "0x1234123412341234123412341234123412341234",
      ]);
    });
    test("should return all issuers address for 2.0 document using document store", async () => {
      const document: WrappedDocument<v2.OpenAttestationDocument> = await wrapDocument({
        issuers: [
          {
            documentStore: "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
            identityProof: {
              type: v2.IdentityProofType.DNSTxt,
              location: "",
            },
            name: "nameA",
          },
          {
            documentStore: "0x1234123412341234123412341234123412341234",
            identityProof: {
              type: v2.IdentityProofType.DNSTxt,
              location: "",
            },
            name: "nameA",
          },
        ],
      });
      expect(utils.getIssuerAddress(document)).toStrictEqual([
        "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
        "0x1234123412341234123412341234123412341234",
      ]);
    });
    test("should return all issuers address for 2.0 document using token registry", async () => {
      const document: WrappedDocument<v2.OpenAttestationDocument> = await wrapDocument({
        issuers: [
          {
            tokenRegistry: "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
            identityProof: {
              type: v2.IdentityProofType.DNSTxt,
              location: "",
            },
            name: "nameA",
          },
          {
            tokenRegistry: "0x1234123412341234123412341234123412341234",
            identityProof: {
              type: v2.IdentityProofType.DNSTxt,
              location: "",
            },
            name: "nameA",
          },
        ],
      });
      expect(utils.getIssuerAddress(document)).toStrictEqual([
        "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
        "0x1234123412341234123412341234123412341234",
      ]);
    });
    test("should return all issuers address for 3.0 document", async () => {
      expect(utils.getIssuerAddress(v3WrappedVerifiableDocument)).toStrictEqual(
        "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca"
      );
    });
  });

  describe("getMerkleRoot", () => {
    test("should return merkleroot for v2.0 document", async () => {
      expect(utils.getMerkleRoot(v2WrappedVerifiableDocument)).toStrictEqual(
        "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692"
      );
    });

    test("should return merkleroot for v3.0 document", async () => {
      expect(utils.getMerkleRoot(v3WrappedVerifiableDocument)).toStrictEqual(
        "797faecb7662eca4e73a82c25a2387d57acd666354c228291fcd664e6aaeb1ba"
      );
    });
  });

  describe("getTargetHash", () => {
    test("should return target hash for v2 document", async () => {
      expect(utils.getTargetHash(v2WrappedVerifiableDocument)).toStrictEqual(
        "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692"
      );
    });
    test("should return target hash for v3 document", async () => {
      expect(utils.getTargetHash(v3WrappedVerifiableDocument)).toStrictEqual(
        "797faecb7662eca4e73a82c25a2387d57acd666354c228291fcd664e6aaeb1ba"
      );
    });
    test("should return error when document is not OpenAttestation document", async () => {
      const document: WrappedDocument<any> = {
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692",
          proof: [],
          merkleRoot: "c5d53262962b192c5c977f2252acd4862f41cc1ccce7e87c5b406905a2726692",
        },
      };
      expect(() => utils.getTargetHash(document)).toThrow(
        new Error(
          "Unsupported document type: Only can retrieve target hash from wrapped OpenAttestation v2 & v3 documents."
        )
      );
    });
  });

  describe("getAssetId", () => {
    test("should return asset id for v2 document", async () => {
      expect(utils.getAssetId(v2WrappedTransferableDocument)).toStrictEqual(
        "53bc5e7c1f2f9f55bb55ce9834f666790f4976660c32ca1ccc3815eed9178d07"
      );
    });
    test("should return asset id for v3 document", async () => {
      expect(utils.getAssetId(v3WrappedTransferableDocument)).toStrictEqual(
        "21e104bea288809f659f6144ebae1ce632256ddeb9c8ecded795573853a43c5d"
      );
    });
    test("should return error when v3 document doesn't have token registry", async () => {
      expect(() => utils.getAssetId(v3WrappedVerifiableDocument)).toThrow(
        "Unsupported document type: Only can retrieve asset id from wrapped OpenAttestation v2 & v3 transferable documents."
      );
    });
    test("should return error when v2 document doesn't have token registry", async () => {
      expect(() => utils.getAssetId(v2WrappedVerifiableDocument)).toThrow(
        "Unsupported document type: Only can retrieve asset id from wrapped OpenAttestation v2 & v3 transferable documents."
      );
    });
  });

  describe("isTransferableAsset", () => {
    test("should return true for v2 transferable document", async () => {
      expect(utils.isTransferableAsset(v2WrappedTransferableDocument)).toStrictEqual(true);
    });
    test("should return false for v2 verifiable document", async () => {
      expect(utils.isTransferableAsset(v2WrappedVerifiableDocument)).toStrictEqual(false);
    });
    test("should return true for v3 transferable document", async () => {
      expect(utils.isTransferableAsset(v3WrappedTransferableDocument)).toStrictEqual(true);
    });
    test("should return false for v3 verifiable document", async () => {
      expect(utils.isTransferableAsset(v3WrappedVerifiableDocument)).toStrictEqual(false);
    });
  });

  describe("isDocumentRevokable", () => {
    it("should return true for a revokable V2 verifiable document with document store", () => {
      expect(utils.isDocumentRevokable(v2WrappedVerifiableDocument)).toStrictEqual(true);
    });
    it("should return false for a V2 verifiable document without document store", () => {
      const document: WrappedDocument<any> = {
        ...v2WrappedVerifiableDocument,
        data: {
          ...v2WrappedVerifiableDocument.data,
          issuers: [
            {
              ...v2WrappedVerifiableDocument.data.issuers[0],
              documentStore: "",
            },
          ],
        },
      };
      expect(utils.isDocumentRevokable(document)).toStrictEqual(false);
    });
    it("should return true for a revokable v3 verifiable document", () => {
      expect(utils.isDocumentRevokable(v3WrappedVerifiableDocument)).toStrictEqual(true);
    });
    it("should return false for a v2 transferable document", () => {
      expect(utils.isDocumentRevokable(v2WrappedTransferableDocument)).toStrictEqual(false);
    });
    it("should return false for a v3 transferable document", () => {
      expect(utils.isDocumentRevokable(v3WrappedTransferableDocument)).toStrictEqual(false);
    });
    it("should return true for a v2 DID wrapped document revocation type 'REVOCATION_STORE'", () => {
      const document: WrappedDocument<any> = {
        ...v2WrappedDidDocument,
        data: {
          ...v2WrappedDidDocument.data,
          issuers: [
            {
              ...v2WrappedDidDocument.data.issuers[0],
              revocation: { type: v2.RevocationType.RevocationStore },
            },
          ],
        },
      };
      expect(utils.isDocumentRevokable(document)).toStrictEqual(true);
    });
    it("should return false for a v2 DID wrapped document without document store", () => {
      expect(utils.isDocumentRevokable(v2WrappedDidDocument)).toStrictEqual(false);
    });
    it("should return true for a v3 DID wrapped document when revocation store is 'REVOCATION_STORE'", () => {
      const document: WrappedDocument<any> = {
        ...v3WrappedDidDocument,
        openAttestationMetadata: {
          ...v3WrappedDidDocument.openAttestationMetadata,
          proof: {
            ...v3WrappedDidDocument.openAttestationMetadata.proof,
            revocation: {
              type: v3.RevocationType.RevocationStore,
            },
          },
        },
      };

      expect(utils.isDocumentRevokable(document)).toStrictEqual(true);
    });
    it("should return false for a v3 DID wrapped document when revocation store is 'NONE'", () => {
      expect(utils.isDocumentRevokable(v3WrappedDidDocument)).toStrictEqual(false);
    });
  });
});
