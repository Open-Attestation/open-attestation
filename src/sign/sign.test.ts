import { sign } from "./index";
import { ethers } from "ethers";
import sampleDoc from "../schema/2.0/sample-document.json";
import { ProofType, wrapDocument } from "../index";
const wrappedDocument = wrapDocument(sampleDoc);

describe("proofs", () => {
  describe("Invalid", () => {
    test("throws that the proof type is not supported", async () => {
      const options = {
        privateKey: "0x0123456789012345678901234567890123456789012345678901234567890123",
        verificationMethod: "0x14791697260E4c9A71f18484C9f997B308e59325",
        type: "NotSupportType"
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore testing on purpose :)
      const signed = async () => await sign(wrappedDocument, options);
      await expect(signed()).rejects.toEqual(new Error(`Proof type: ${options.type} does not exist.`));
    });
  });
  describe("EcdsaSecp256k1Signature2019", () => {
    test("adds a signed proof block to the document", async () => {
      const options = {
        privateKey: "0x0123456789012345678901234567890123456789012345678901234567890123",
        verificationMethod: "0x14791697260E4c9A71f18484C9f997B308e59325",
        type: ProofType.EcdsaSecp256k1Signature2019
      };
      const signed = await sign(wrappedDocument, options);
      const { proof } = signed;
      if (!proof) throw new Error("No proof!");
      const msg = wrappedDocument.signature.targetHash;
      const recoverAddress = ethers.utils.verifyMessage(msg, proof.signature);
      expect(recoverAddress.toLowerCase() === options.verificationMethod.toLowerCase()).toEqual(true);
    });
  });
});
