import { cloneDeep } from "lodash";
import { digestCredential } from "../digest";
import { WrappedDocument } from "../../4.0/types";
import { obfuscateVerifiableCredential } from "../obfuscate";
import { decodeSalt } from "../salt";
import sample from "../../../test/fixtures/v4/did-wrapped.json";

const verifiableCredential = sample as WrappedDocument;
// Digest will change whenever sample document is regenerated
const credentialRoot = "adb16863b9b92f1f46d67f518f853092404dc1322ffb61b45a831ee113f4ea99";

const { proof, ...credential } = verifiableCredential;

describe("digest v4.0", () => {
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
        [
          "016c17fefa241351dc2950cfbeaef8281b0bc71e1ee445d890e9c37622fa0318",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(1);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document when multiple element are obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, [
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
          "84c8662d07d3b98b7b9b58687a04fd6ff5a90e91f63e70c2399755721630b370",
          "4390ee551a3ef3bebaad99c85738b3ebd96932343fb22a59865764125b79565c",
          "026dbfc89aaa98005d2f25b0b274a972f1dc5c351d22270eba9d80422dd9850f",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(3);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document with no visible content correctly", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(
        verifiableCredential,
        Object.keys(verifiableCredential).filter((k) => k != "proof")
      );
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential).toStrictEqual({ proof: obfuscatedVerifiableCredential.proof });
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        [
          "f0798858da35807f0e5ae1a253722da6eb073abfad039151a18355d71e18f232",
          "867ae2f030d04745d384969efe67b9fdfeea3236aa6b5f10d2bdbfb495a1ecb3",
          "671da469c4211222ef05dcfc4fb795b6d774f5a1fc9f1397fab7ff6eba58e5db",
          "b92f17321f80808f90ee5c1b089fad1b8ad2ff63e8d4d4ba923e50d0996aba75",
          "21d7f40f46a97e9480b48739b560fba4cfe6d2f1b6bf14e3bdf7c9d765590a9a",
          "4b13961eed15c275d3b8c11c4d40d8f956ffa8f1361b36058da28349c155d193",
          "016c17fefa241351dc2950cfbeaef8281b0bc71e1ee445d890e9c37622fa0318",
          "c5796036b237228ddc64bab40cd34200cb8d9dc4574c8a9a7cdda2350d77bdf9",
          "b031b7f3cc154783acc36cbdc524bb7d8e4f4093785d25c1000a15c49e0ce58b",
          "0913c1f68e821d8b4b07c9406419f083cd326c989bf433ccd13c242fdf834497",
          "0c9bbd46994b92637562fef0df5a95eb4549a0198923c66693b547311635455a",
          "5dff1a92a0cae0a5d50530968ff06c2baea9d3ac11b415268d98728ff13a4aa6",
          "363e3a4656d4b586d1855a4cc22e56b4b446a357f2c76bdc777df6596d22e7e3",
          "13e4d679f8cc43a69c7fbc37cd6339ee3864eeaca137687b6c7cff07309f6f98",
          "5d027cec038e4f0fbb684da654f12999b973e20788801e13e063f642228d56a5",
          "6d8b020b1ef826ce5e05fb034f4d2b9c4ed5bc4d4a0d697a6ec9f6c249970cb0",
          "97bbd9a5415e96e1f5f61879e1bdef14db6868304ab3b681c6bbb82e0ecd21b3",
          "84c8662d07d3b98b7b9b58687a04fd6ff5a90e91f63e70c2399755721630b370",
          "c96b471fec27d76d3b5e1c479ccf690bca845ba78bc2b6b28abd52f9defcf491",
          "4390ee551a3ef3bebaad99c85738b3ebd96932343fb22a59865764125b79565c",
          "6d38b0c91fa83fd141a20098b121eca264dcf8c20e6bd97d13b9a5e8924026c2",
          "026dbfc89aaa98005d2f25b0b274a972f1dc5c351d22270eba9d80422dd9850f",
          "5bc0eb80d28496cfe3ed416b91fada582f097bbdaaedcff5aa5e393c8f8be726",
          "6fb9f93f2b42bb70a67e6ad5cb22f72083d9d3bf98776e83a470c82800770623",
          "aa4414e7a955a034998fd1221c80a2ef77c30c26a7b15fe15b7c2716811bb3d9",
          "fba6d49a55387b611fb4dedf401630d3adb1d377e17ba051524a09795ee734ae",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(26);
      expect(digest).toBe(credentialRoot);
    });
  });
});
