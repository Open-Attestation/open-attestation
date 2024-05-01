import { signDocument } from "../../index";
import { SUPPORTED_SIGNING_ALGORITHM } from "../../shared/@types/sign";
import { Wallet } from "ethers";
import { WRAPPED_DOCUMENT_DID } from "../fixtures";
import { V4SignedWrappedDocument } from "../types";

describe("V4 sign", () => {
  it("should sign a document", async () => {
    const signedWrappedDocument = await signDocument(
      WRAPPED_DOCUMENT_DID,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      {
        public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
      }
    );
    const parsedResults = V4SignedWrappedDocument.safeParse(signedWrappedDocument);
    if (!parsedResults.success) {
      throw new Error("Parsing failed");
    }
    const { proof } = parsedResults.data;
    expect(Object.keys(proof).length).toBe(9);
    expect(proof.key).toBe("did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller");
    expect(proof.signature).toBe(
      "0x1744f9615fa8d725cf4ae14f2654762dd8e0ee88a9b6d8af13cec688019a7a501e9bae10fa407fdbe359977f8124a26a0061a0ef0ea212c42fd1d91e0998928d1c"
    );
  });
  it("should sign a document with a wallet", async () => {
    const wallet = Wallet.fromMnemonic(
      "tourist quality multiply denial diary height funny calm disease buddy speed gold"
    );
    const signedWrappedDocument = await signDocument(
      WRAPPED_DOCUMENT_DID,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      wallet
    );
    const parsedResults = V4SignedWrappedDocument.safeParse(signedWrappedDocument);
    if (!parsedResults.success) {
      throw new Error("Parsing failed");
    }
    const { proof } = parsedResults.data;
    expect(Object.keys(proof).length).toBe(9);
    expect(proof.key).toBe("did:ethr:0x906FB815De8976b1e38D9a4C1014a3acE16Ce53C#controller");
    expect(proof.signature).toBe(
      "0xac4c7fb9ed25878038b42f2da8a2a6f8cd553383debc5d0bf6e362b810c05ba779dd50235f0bab560bf970af564587b4756bd0a06dd4d42862875e68280d39201b"
    );
  });

  it("should a signed document to be resigned", async () => {
    const signedDocument = await signDocument(
      WRAPPED_DOCUMENT_DID,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      {
        public: "did:ethr:0xb6De3744E1259e1aB692f5a277f053B79429c5a2#controller",
        private: "0x812269266b34d2919f737daf22db95f02642f8cdc0ca673bf3f701599f4971f5",
      }
    );

    const resignedDocument = await signDocument(
      WRAPPED_DOCUMENT_DID,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      {
        public: "did:ethr:0xb6De3744E1259e1aB692f5a277f053B79429c5a2#controller",
        private: "0x812269266b34d2919f737daf22db95f02642f8cdc0ca673bf3f701599f4971f5",
      }
    );

    expect(signedDocument).toEqual(resignedDocument);
  });

  it("should throw error if a key or signer is invalid", async () => {
    await expect(
      signDocument(WRAPPED_DOCUMENT_DID, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {} as any)
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Either a keypair or ethers.js Signer must be provided"`);
  });

  it("should throw error if proof is malformed", async () => {
    await expect(
      signDocument(
        {
          ...WRAPPED_DOCUMENT_DID,
          proof: { ...WRAPPED_DOCUMENT_DID.proof, merkleRoot: undefined as unknown as string },
        },
        SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
        {
          public: "did:ethr:0xb6De3744E1259e1aB692f5a277f053B79429c5a2#controller",
          private: "0x812269266b34d2919f737daf22db95f02642f8cdc0ca673bf3f701599f4971f5",
        }
      )
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Unsupported document type: Only OpenAttestation v2, v3 or v4 documents can be signed"`
    );
  });
});
