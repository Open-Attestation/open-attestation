import { cloneDeep } from "lodash";
import { digestCredential } from "../digest";
import { WrappedDocument } from "../../3.0/types";
import { obfuscateVerifiableCredential } from "../obfuscate";
import { decodeSalt } from "../salt";
import sample from "../../3.0/schema/sample-verifiable-credential.json";

const verifiableCredential = sample as WrappedDocument;
// Digest will change whenever sample document is regenerated
const credentialRoot = "74b174eb458bffdd7315417c76d982c2e5ed6577a75b13b58876d4d7e0325088";

const { proof, ...credential } = verifiableCredential;

describe("digest v3.0", () => {
  describe("digestCredential", () => {
    test("digests a document with all visible content correctly", () => {
      const clonedCredential = cloneDeep(credential);

      const digest = digestCredential(clonedCredential, decodeSalt(proof.salts), []);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document when one single element is obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, "issuer.id");
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        Array [
          "c2e9eca805a1bcd7e1a1ceaa55226c560b2d2fe835df0bb391fe93d37fbe7a27",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(1);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document when multiple element are obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, [
        "issuer.id",
        "credentialSubject"
      ]);
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        Array [
          "c2e9eca805a1bcd7e1a1ceaa55226c560b2d2fe835df0bb391fe93d37fbe7a27",
          "7a1c8e6eb21cbd59f9d4d4802cc5a4f74c25572066b74d6ccdf69eea1a35124d",
          "96d9333289023bd6b1d4fa9e4870fd9542c071ad0667424b1bd9e7b6ad774fe3",
          "7ba89ed60abb3d73a03f4f6a4e60df3950fe371b0f52af95ab629c4532bdd991",
          "61330f5e659c8ebb03bef64e4e7f3e1f52abfadf31b83c60dd8896026d1340bd",
          "4a3ef1ac924fdb6b614c561d381e2411b51bcc8d25268db5106fa2146f5236a5",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(6);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document with no visible content correctly", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(
        verifiableCredential,
        Object.keys(verifiableCredential).filter(k => k != "proof")
      );
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential).toStrictEqual({ proof: obfuscatedVerifiableCredential.proof });
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        Array [
          "0d51b3018f7b04dd8404fae119271227471278cac34a50f397e39243277389e8",
          "ce168d4babfeb85a532d7fc0788d46f3bd52e7cfcd203444ff67c36c8c41a638",
          "3ec476a2ccdfea1b12daf56a9e1cfc26fd977fe183ec39c907ee61d9c860dc79",
          "e13d32bc48e055514ba3c756cfd9e4c5e75a6cbe9840e951914526f6345c3441",
          "42ac04b488e37d96c6dddebb961cbc4c8486bde78b47f11db6bc85664b7f17f0",
          "42fe9a306f1db9ccc6c92fb47cd23aa562f1ac6608de7c700b69a697b69a9a98",
          "d5fc0f563295d2850c5a466f89e4bc205f286f5ccd8b850e663b36029d22f5cd",
          "a4abe16675c776240013710d3b078ee0ebc3737cd484577f4510d8458f29ca4c",
          "8271e4d1098644bced222704611ac0c75a12fb678a281bacc1fe2c6cfb9dfd82",
          "c2e9eca805a1bcd7e1a1ceaa55226c560b2d2fe835df0bb391fe93d37fbe7a27",
          "65e1d2bee003aecf7275a4fe5434d9559e22e793c7bf5522df803f0acb2ce486",
          "2bcb64dd8812bcd2779c5550a323e49efb589f1be750e41e7a656fd388edbe4f",
          "09c5eecc2fb9b58e05b09891c09d9f29d3b35373df942f13bac66263f9c53652",
          "7a1c8e6eb21cbd59f9d4d4802cc5a4f74c25572066b74d6ccdf69eea1a35124d",
          "96d9333289023bd6b1d4fa9e4870fd9542c071ad0667424b1bd9e7b6ad774fe3",
          "7ba89ed60abb3d73a03f4f6a4e60df3950fe371b0f52af95ab629c4532bdd991",
          "61330f5e659c8ebb03bef64e4e7f3e1f52abfadf31b83c60dd8896026d1340bd",
          "4a3ef1ac924fdb6b614c561d381e2411b51bcc8d25268db5106fa2146f5236a5",
          "cc4ce66d03297e004291dbf84c1241d39a6549cb47f0b3d82f4c95e390faee26",
          "e141439ca7a8223de06505168cf18e7a65bf48a72ed425200ecece266d07ed1d",
          "c50f4eb78cb5993a1e443fa56d11afc16744a1e0d1de3eae61e0b1ded168ca5a",
          "284fd0d7399ba4b999f22d0dafe12f82cbe870be9e93c76299f4d07255d3079d",
          "460f637988e3567728165d0b595db61f9767cafb021f75d91c98c76def4f2b0e",
          "a019119815846eb0344044f2e3e9a261176e9740f178ee8be9c5e5d50c6a8489",
          "931f59a67e68890e4a88e1d902f68e793a766a35013f4660d5c08a99082872c9",
          "eda31fd03d5772ff56b36f184c1b5e764b20c6fbcc788f939761937f1ba924df",
          "1d7e762c3ad929d8a5ab6ce16531c1e544538eb2e6678a09220647806f6099cf",
          "399873e5619db39e7cb437f312ba21e8e19879f2e321676367e1200b5e5593ff",
          "5abb8da6912be21d880f0834666394c17a4781def21868971bf04b7e650ed642",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(29);
      expect(digest).toBe(credentialRoot);
    });
  });
});
