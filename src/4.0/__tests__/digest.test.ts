import { cloneDeep } from "lodash";
import { digestCredential } from "../digest";
import { WrappedDocument } from "../../4.0/types";
import { obfuscateVerifiableCredential } from "../obfuscate";
import { decodeSalt } from "../salt";
import sample from "../../../test/fixtures/v4/did-wrapped.json";

const verifiableCredential = sample as WrappedDocument;
// Digest will change whenever sample document is regenerated
const credentialRoot = "ea4a072f6b88861b0aa14baa04ab423d5d363d2e114adaa679f60aee9aaf8373";

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
          "e521e95bb3adf4ded40a929af58996c33add5ec9a8d4d0d3db22a69aa29f8517",
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
          "dc9fb54950b4505553c79505d64f0108f1b7af287e8b909425c17deb7e2d6af4",
          "0a5fae6a5a23b95f0fb70bc22b5e38c8c4aacfc476f4214077236315ceb54ce4",
          "cadef4aa0ae961b99f4bbb3d11314b8855377156a22341f6fffadef214479e79",
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
          "63285ee08671cb84b18414a813d28cc718ce43b815ff73ce4154faa9c9ad9dcd",
          "2d9b6afb3ec3445b22ef6684238a27f32f532dde22875cc9dcf6fd69ae600e23",
          "2faef9552eeeb238a9920ce2bc91844fa5b9d313d2377472c2bbc268388e77e6",
          "38068d88819bb58dddc47d50657320403ad1c7272248c7f5f8e03d86f7f3a736",
          "5c37fad912a96877a1de8697544e647d5956be812d894013724c8d7a7a305daf",
          "54d542c2a5074f79d748cd2dad4a4e152254d593ab511cc6190f8dd367625db7",
          "e521e95bb3adf4ded40a929af58996c33add5ec9a8d4d0d3db22a69aa29f8517",
          "f74a658d3e1b8b6089b2a20002ef53a2c7ef5ccadf391f1863805fb95bb1d4b8",
          "2ee3e874b989d2f17f8e1a2b29a0d7a361143f7a0a05eaf6650b74a9e1a6490d",
          "10c8faff3d92cf41f0c1392d28baa7bb9bbb0b424c565471cb1205f440c6ee6a",
          "9fb9934dfe60ff43436ebf702bbf055b3af7dc7544ceefcc48a0fba5e4777a65",
          "79f2841de72244001c83b4aaacba8676655621e254f26fca8feb83233644d12c",
          "4ce4ac5a51879fa88298503074e207b345b535d9ecbb6f660ae46e919cec8252",
          "de994629b0d88eddff6f4a137f4745f098938b3e8daa5db090b55a8d79db9776",
          "f9fbffd43354e65f05e1e3cbf40999e814801651b0da5af53ec2150065e5bba5",
          "94b147f4856eca4c66733908e364062de8acf5ee74dca29926b35c31d4fc3739",
          "dc9fb54950b4505553c79505d64f0108f1b7af287e8b909425c17deb7e2d6af4",
          "e62c543c991fd273357d5bbafcced8d884777d626e7053a2154fabadedd96d69",
          "0a5fae6a5a23b95f0fb70bc22b5e38c8c4aacfc476f4214077236315ceb54ce4",
          "b612f632c655bbcdc5fd1732e7fdf96c2b18890d812a5218d6bf5dca9394e123",
          "cadef4aa0ae961b99f4bbb3d11314b8855377156a22341f6fffadef214479e79",
          "8264ebfd62f23fd2953a5b36a574dd3b5b08bd1db21f438ad5415d6b2fbd13bf",
          "fd6aef8c5547610005739747971968f39adb521c72e7a40915e2be7398bfc902",
          "54b2bd63fa155cb08cb81adea31920845e59a1b0d02e57a63c14c9cf4704de65",
          "aa1cf55fca00a814a8bf956641b09585ea31dd10776a6dbc9257fb53ba29e54b",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(25);
      expect(digest).toBe(credentialRoot);
    });
  });
});
