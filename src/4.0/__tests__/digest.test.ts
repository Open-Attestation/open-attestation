import { cloneDeep } from "lodash";
import { digestCredential } from "../digest";
import { WrappedDocument } from "../../4.0/types";
import { obfuscateVerifiableCredential } from "../obfuscate";
import { decodeSalt } from "../salt";
import sample from "../../../test/fixtures/v4/did-wrapped.json";

const verifiableCredential = sample as WrappedDocument;
// Digest will change whenever sample document is regenerated
const credentialRoot = "04a551b401900c95ac92056fc0bbc2d9300890d7adb9410af9c065c8be6338b3";

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
          "fc6a3e4ac9ab3a77da2eb8ab35d4f3f02aeb1463acdc0edc0082b1b301f25269",
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
          "892da892b97e173a8c3ca82eb4e6aeb472684efb2ae2d21f1e04cb90343dd5db",
          "94f6cfc087aa9d4a4ba8ff12901924d0efc60023208e3f8f3a5aff6ad68ae416",
          "4a8cfa9eafbf3e6de4e8b83def6a47adf8421432239d0f13c6df1a6b3f417d23",
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
          "b3fe78c46d1528e477aebafe4b674bfd2b10614f72b0224da8ee163ce1a2a4a9",
          "02125acd8247c4bfce550fd6d3d5e9bf5a2672b97ba12f3f74f9c4d7b493673f",
          "0499f1ff43d4e58e42bb47e01c58491e969e31a25b38e7c2c16fbb392a99b11d",
          "d97f9e773179d20426fb89312ea955638ecf73e18bbf7e724cc13afeeaf5880d",
          "d1d36975fd38cb0d7c250a8c0a482503a0d4e414947f56a7a07e0d73a902fb37",
          "71677e56872a41cd2b62211a922082a5ecf0429e29e5cd78b0a72bf57d6fed46",
          "176b76b75c642084ede156ebaf64b73db92ecba803ab58e702659ff987114c2c",
          "fc6a3e4ac9ab3a77da2eb8ab35d4f3f02aeb1463acdc0edc0082b1b301f25269",
          "d714614f162443162c5d1024e757485de7deea042667282910f75da80ade12cd",
          "ad7fe8ff8c6f034f11d81a70e7c93d62f0db0c32f3162dad049ba769102a0005",
          "dd7f22be800e9a335115a97e51674b9771bc287677119a2baca655d917f79bd4",
          "4ca2aab7c5fa63d05559c47052e7a9729cd9179d0b0f05f2ecc82385d2734613",
          "201c6f75473a3ca7e173f56d8377e7d3b790b7b6b2335b8110ca4002a6cd0db9",
          "07e7c36c22f1ff86a13a23616d87614d2e68d6aac06f98acdea15e43de2bacb3",
          "58be2327fcbb4f6489ac26108b26efeca27c37cde3f1df97e826644bed7a4d80",
          "2134e615fa0390ec19a7d7776a983216a554af3edbd71f448b1642bc8d6d18ea",
          "221e3f50bc552299c774fc45788c7abe3743bd39a9fc8797e26747aa983c404e",
          "3614459068235a5b759f336c92cec7065b0631eace98a2b4a0b653ae8ecc02bc",
          "892da892b97e173a8c3ca82eb4e6aeb472684efb2ae2d21f1e04cb90343dd5db",
          "a6055dc88b52188e2da3bd08458d0e46930c9bcf2e42b65e49ff41f5ac960fe8",
          "94f6cfc087aa9d4a4ba8ff12901924d0efc60023208e3f8f3a5aff6ad68ae416",
          "9129e18dce97e3631fed2beb3cc4edb891ea04db2c2fe319231df83cea050b59",
          "4a8cfa9eafbf3e6de4e8b83def6a47adf8421432239d0f13c6df1a6b3f417d23",
          "9c6406e19d08650d2064a0e7f90c427961c27ecdda99489ee5ada95cc77d15fa",
          "62ddf412190fd48dc529a1df9834ae2f036ab6d5ea9d45a40948e5aa399a25fd",
          "f16d53781fdcdff8e1a9ac3f2428aa72b9f80ec43b440049a789e691ed869c59",
          "54ac572f4cd33f77a4bcb647b4445e4434b7b6094a73d8b654d1a2831ebbe4f7",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(27);
      expect(digest).toBe(credentialRoot);
    });
  });
});
