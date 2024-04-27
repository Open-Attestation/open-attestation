import { cloneDeep } from "lodash";
import { digestCredential } from "../digest";
import { obfuscateVerifiableCredential } from "../obfuscate";
import { decodeSalt } from "../salt";
import { SIGNED_WRAPPED_DOCUMENT_DID } from "../fixtures";

// Digest will change whenever sample document is regenerated
const credentialRoot = "f49be3b06f7a7eb074775ad12aae43936084c86646e3640eae18e7aeca4f7468";

const { proof, ...credential } = SIGNED_WRAPPED_DOCUMENT_DID;

describe("V4.0 digest", () => {
  describe("digestCredential", () => {
    test("digests a document with all visible content correctly", () => {
      const clonedCredential = cloneDeep(credential);

      const digest = digestCredential(clonedCredential, decodeSalt(proof.salts), []);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document when one single element is obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(SIGNED_WRAPPED_DOCUMENT_DID, "issuer.id");
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        [
          "2af1e71e32c51a207e74a18ab33ee64468fc7e0c011cdaf43e2ae3204787e3e6",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(1);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document when multiple element are obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(SIGNED_WRAPPED_DOCUMENT_DID, [
        "credentialSubject.id",
        "credentialSubject.name",
        "credentialSubject.licenses.0.description",
      ]);
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        [
          "f8dda89249262ebb124a087da28b6520d5948c16a45532453e8380811851a05f",
          "0ee1df415b41b20f0e60d65377d5aa7ac8d56577c8a268a4b9e8fe84ace5e8d3",
          "d96e801852c886f9b14861e1ece3d41b4489c1e2d57f972d7f4b2b4d00abac6b",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(3);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document with no visible content correctly", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(
        SIGNED_WRAPPED_DOCUMENT_DID,
        Object.keys(SIGNED_WRAPPED_DOCUMENT_DID).filter((k) => k != "proof")
      );
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential).toStrictEqual({ proof: obfuscatedVerifiableCredential.proof });
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        [
          "a0b3d5c67c33a0dd28b29affc83c45c07bb4c5f43e35ae2b17d7185832372b32",
          "e2571635cde03fc4397336176118f7dcad6443d033ff30c0bb20dad6a0b7dc64",
          "f1262f889f833ac33db6ad98baa99697a76d2c5b78e8c16de71d70cf4ce9f11e",
          "d3e53913d1d0fe997f2a941b38ddc0f7481a737f0958454298a983b622476ae6",
          "a9c59e18346b177425016a4dbac19ff521ee2547bc4ae78b6fffda374224985c",
          "4322f850d5f17e8db8738e8fcd1901b43d053eb4086fcc747ddb670eec26e1c5",
          "2af1e71e32c51a207e74a18ab33ee64468fc7e0c011cdaf43e2ae3204787e3e6",
          "2079505ff19eecf40373b4c8a97858340538c32dd9998b013a75b00591863a86",
          "6657f68f32ede3f1f0c23fad3c14ec2150caf127320bb681ac882bbf088314e4",
          "da0129d424dfd61470cfbc6db2d0a351456c1347ff8a866f64e773534f50dbc9",
          "cdc6780c98d21cf1c2a512c69424901ebc66c657c4364f573dbc77b8f99f1e6e",
          "6f8dea4950d0b99674507e2a362887b6fbb5a661d395ab5e0f10b7902369fd57",
          "0e8cfba3a420807f116410fd8bcf3f8147133191c17bf00315cafae1ec7231b3",
          "c9fa76bd112c9dd65afd38899e58583d39879abb7962368eb91ca9217d49e8fc",
          "f8dda89249262ebb124a087da28b6520d5948c16a45532453e8380811851a05f",
          "0b40ea9dcddca6d570191b3b5bee01dbe4d53047e45f39f496ee4f77baabd2e7",
          "0ee1df415b41b20f0e60d65377d5aa7ac8d56577c8a268a4b9e8fe84ace5e8d3",
          "5db7da35fe78cde5f216efca8446fa84762c346c8eb5685c9086841ba8899ea3",
          "d96e801852c886f9b14861e1ece3d41b4489c1e2d57f972d7f4b2b4d00abac6b",
          "6fd29224f74d7b53d5501fb8f111a9cb142d9481367cdec84db6b0919aa60ed8",
          "5ea9e34d7e03a436d6c50f7e2af34ee90f1cda674b3dca270228a6041c32430b",
          "8ab3fdec4be9c61ca9d0b570896796be343287a9fc92262aadc5a2b1f400ad6a",
          "b298f1096b443e1441a8e0f62eef873a45fbbbb6e9bbfd1691106224613cd61b",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(23);
      expect(digest).toBe(credentialRoot);
    });
  });
});
