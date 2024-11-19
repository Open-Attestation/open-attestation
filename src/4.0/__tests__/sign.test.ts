import { SUPPORTED_SIGNING_ALGORITHM } from "../../shared/@types/sign";
import { Wallet } from "@ethersproject/wallet";
import { RAW_DOCUMENT_DID } from "../fixtures";
import { SignedOAVerifiableCredential } from "../types";
import { signVc, signVcErrors } from "../sign";

describe("V4.0 sign", () => {
  it("should sign a document", async () => {
    const signedWrappedDocument = await signVc(
      RAW_DOCUMENT_DID,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      {
        public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
      }
    );
    const parsedResults = SignedOAVerifiableCredential.safeParse(signedWrappedDocument);
    if (!parsedResults.success) {
      throw new Error("Parsing failed");
    }
    const { proof } = parsedResults.data;
    expect(Object.keys(proof).length).toBe(9);
    expect(proof.key).toBe("did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller");
    expect(proof.signature).toBeDefined();
  });
  it("should sign a document with a wallet", async () => {
    const wallet = Wallet.fromMnemonic(
      "tourist quality multiply denial diary height funny calm disease buddy speed gold"
    );
    const signedWrappedDocument = await signVc(
      RAW_DOCUMENT_DID,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      wallet
    );
    const parsedResults = SignedOAVerifiableCredential.safeParse(signedWrappedDocument);
    if (!parsedResults.success) {
      throw new Error("Parsing failed");
    }
    const { proof } = parsedResults.data;
    expect(Object.keys(proof).length).toBe(9);
    expect(proof.key).toBe("did:ethr:0x906FB815De8976b1e38D9a4C1014a3acE16Ce53C#controller");
    expect(proof.signature).toBeDefined();
  });

  it("should throw error if a signed document is resigned", async () => {
    const signedVc = await signVc(RAW_DOCUMENT_DID, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
      public: "did:ethr:0xb6De3744E1259e1aB692f5a277f053B79429c5a2#controller",
      private: "0x812269266b34d2919f737daf22db95f02642f8cdc0ca673bf3f701599f4971f5",
    });

    let error;
    await expect(async () => {
      try {
        await signVc(signedVc, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
          public: "did:ethr:0xb6De3744E1259e1aB692f5a277f053B79429c5a2#controller",
          private: "0x812269266b34d2919f737daf22db95f02642f8cdc0ca673bf3f701599f4971f5",
        });
      } catch (e) {
        error = e;
        throw e;
      }
    }).rejects.toThrowErrorMatchingInlineSnapshot(`
      "VC has already has proof object defined:
      Either an unsigned or undigested VC must be provided"
    `);
    expect(error).toBeInstanceOf(signVcErrors.VcProofNotEmptyError);
  });
  it("should throw error if a key or signer is invalid", async () => {
    await expect(
      signVc(RAW_DOCUMENT_DID, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {} as any)
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Either a keypair or ethers.js Signer must be provided"`);
  });
});
