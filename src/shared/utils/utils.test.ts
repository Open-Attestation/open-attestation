import * as utils from "./utils";
import { wrapDocument } from "../../";
import { OpenAttestationVerifiableCredential, SchemaId, WrappedDocument } from "../../shared/@types/document";
import { IdentityProofType, OpenAttestationDocument as v2OpenAttestationDocument } from "../../__generated__/schemaV2";
import { CredentialProofType, Method, OpenAttestationCredential, TemplateType } from "../../__generated__/schemaV3";

describe("Util Functions", () => {
  describe("hashArray", () => {
    test("should work", () => {
      const res = utils.hashArray(["a", "b", "1", 5]);

      const expectedHashResults = [
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc",
        "9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2",
        "a78c7e6cf27e778ce55aaa2a786943f1578bc76edcb296abc95981c786bb89c1",
        "ceebf77a833b30520287ddd9478ff51abbdffa30aa90a8d655dba0e8a79ce0c1"
      ];

      expect(res.map(p => p.toString("hex"))).toEqual(expectedHashResults);
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
    test("should return all issuers address for v2 document using certificate store", async () => {
      const document: WrappedDocument<v2OpenAttestationDocument> = await wrapDocument({
        issuers: [
          {
            certificateStore: "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
            name: "nameA"
          },
          {
            certificateStore: "0x1234123412341234123412341234123412341234",
            name: "nameA"
          }
        ]
      });
      expect(utils.getIssuerAddress(document)).toStrictEqual([
        "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
        "0x1234123412341234123412341234123412341234"
      ]);
    });
    test("should return all issuers address for v2 document using document store", async () => {
      const document: WrappedDocument<v2OpenAttestationDocument> = await wrapDocument({
        issuers: [
          {
            documentStore: "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: ""
            },
            name: "nameA"
          },
          {
            documentStore: "0x1234123412341234123412341234123412341234",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: ""
            },
            name: "nameA"
          }
        ]
      });
      expect(utils.getIssuerAddress(document)).toStrictEqual([
        "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
        "0x1234123412341234123412341234123412341234"
      ]);
    });
    test("should return all issuers address for v2 document using token registry", async () => {
      const document: WrappedDocument<v2OpenAttestationDocument> = await wrapDocument({
        issuers: [
          {
            tokenRegistry: "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: ""
            },
            name: "nameA"
          },
          {
            tokenRegistry: "0x1234123412341234123412341234123412341234",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: ""
            },
            name: "nameA"
          }
        ]
      });
      expect(utils.getIssuerAddress(document)).toStrictEqual([
        "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
        "0x1234123412341234123412341234123412341234"
      ]);
    });
    test("should return all issuers address for v3 document", async () => {
      // This test takes some time to run, so we set the timeout to 14s
      const document: OpenAttestationVerifiableCredential<OpenAttestationCredential> = await wrapDocument(
        {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
            "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld"
          ],
          issuer: {
            name: "name",
            id: "https://example.com",
            identityProof: {
              location: "whatever",
              type: IdentityProofType.DNSTxt
            }
          },
          issuanceDate: "2010-01-01T19:23:24Z",
          type: ["VerifiableCredential", "UniversityDegreeCredential"],
          credentialSubject: {
            id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
            degree: {
              type: "BachelorDegree",
              name: "Bachelor of Science and Arts"
            }
          },
          credentialProof: {
            value: "0xabcf",
            type: CredentialProofType.OpenAttestationSignature2018,
            method: Method.DocumentStore
          },
          name: "",
          reference: "",
          template: {
            url: "https://",
            name: "",
            type: TemplateType.EmbeddedRenderer
          },
          validFrom: "2010-01-01T19:23:24Z"
        },
        { version: SchemaId.v3 }
      );
      expect(utils.getIssuerAddress(document)).toStrictEqual("0xabcf");
    }, 14000);
  });
});
