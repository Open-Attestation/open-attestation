import { cloneDeep } from "lodash";
import { digestCredential } from "../digest";
import { WrappedDocument } from "../../3.0/types";
import { obfuscateVerifiableCredential } from "../obfuscate";
import { decodeSalt } from "../salt";
import sample from "../../3.0/schema/sample-verifiable-credential.json";

const verifiableCredential = sample as WrappedDocument;
// Digest will change whenever sample document is regenerated
const credentialRoot = "e06520d98a1ab8bfe52d4c9905652a6ac096f0c726b4ecc97084f77bf3263f03";

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
          "014bcf2fecaae61a904a8624e22925e4dfdcad743921e0e67d81867fe5c23172",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(1);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document when multiple element are obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, [
        "issuer.id",
        "credentialSubject",
      ]);
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        Array [
          "014bcf2fecaae61a904a8624e22925e4dfdcad743921e0e67d81867fe5c23172",
          "4c4866737f19e5e1d5e9411a9792111647cc9b27fc6726bad7825613d0c2e9d1",
          "4914057f46973c65a950797b1e7cb9ecdd62d0764aada14c26f81afb76b3040e",
          "2150a2f1354cdcc797fe255d504f3e396c3ed48d661cb37b2aa40bacaf214fec",
          "74fa2e4d36a60d0b9679842e0c08d69b3af8f02e6ecedc69d87bcd0c7f57856a",
          "a1c01d431c00e2499812a491a57f2296276d0a7f841cbb8dae8e92d309658ca0",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(6);
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
        Array [
          "ee7bd33dd33cc5ee221a72c8aa981c2fa5a20066811c960234058b7c1f327f30",
          "ff85488133f76785e52b18ce71ddc955593e16eaabe58c627b4897185c14ed40",
          "615c7a6c7d911b68eaf67dd4db28a9d1e6cae24a695bc14e16b8a91ab74b2eff",
          "cf10103db0b480b009d8b90cb809670c5531e81f73ead29e0d2bbf84ca7a1cad",
          "f5d74ad3c41e39df3bdc41e93d734ca2174037cc488ede0f0daa0e0af4aadf18",
          "dbb6c079e2f9692b10493982138cdf77cab9ab750a564c8bd079e8703250f747",
          "0896dce15c8160b83e60788cac12e1a336ad23da46762f9ed3caade78e284ccb",
          "551a6d3b05c148685c33de1c0c406abe8d0ea04c4a95c61a904a43c9d984b89e",
          "7fd878f15f7d7ab748aa95dd135a2aa81f25d3f4c7ba7c16782c45fa12cee376",
          "014bcf2fecaae61a904a8624e22925e4dfdcad743921e0e67d81867fe5c23172",
          "bca7238eb011916009d86d21c1b4835d69666b4243bfabb2c523bd683ef6ab8e",
          "8b85ab096f2d677c6fa3796794373b4e8d0744955a65f226e9200c7e2112f29a",
          "e4e4c6ddfc79b87300c81708edbfb2aef8643b74176e5b6df331af966092a823",
          "4c4866737f19e5e1d5e9411a9792111647cc9b27fc6726bad7825613d0c2e9d1",
          "4914057f46973c65a950797b1e7cb9ecdd62d0764aada14c26f81afb76b3040e",
          "2150a2f1354cdcc797fe255d504f3e396c3ed48d661cb37b2aa40bacaf214fec",
          "74fa2e4d36a60d0b9679842e0c08d69b3af8f02e6ecedc69d87bcd0c7f57856a",
          "a1c01d431c00e2499812a491a57f2296276d0a7f841cbb8dae8e92d309658ca0",
          "e6cf5080b264299b0aa4606c63912cced8e48572ba8391970932b1a09f3bb04b",
          "5ae3264388dd798ce7fc2726c720cc666c0ae61e58b29a9a3c4f23cc5e20095a",
          "08899b64f8b149b8805595ef2ac8d89b8b5b25012ef75ec82859dddb27dec973",
          "857dbf3249693e433339407c280e00f099f01f4dcb920de39089cddff2996e90",
          "aa8d7cf040cafff4ec6938ba9cdf5e7dcf46f5a21f142b7b33a6da2eb273d298",
          "75c91a74a1fc25de8b95dedb2721cdc61d43309ca4205cff7d66d84f804b67c0",
          "b553f0ad7b528f245ad061079794a55fc0d96da8a671fd67e403a9ca79e20434",
          "869c52318cc293583b6dfd8dbc7f4cde26ab70f8ca738b26c3c832adf7597ea1",
          "3a3830fd90a5539cae36f7aa704223eeb3836fb5b3ea12fd731c2eacdddb0d82",
          "c0b9d5ea65cf76a18be9d86324797c8971356aa8e8505d688b4c437bd8ea686e",
          "51164905a7627777a55f5c8a34470f41dfc7a4210f31f4830df89456ae8dd990",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(29);
      expect(digest).toBe(credentialRoot);
    });
  });
});
