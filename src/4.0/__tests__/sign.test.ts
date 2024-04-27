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
      "0xcc3f2d88367976231b8cec5d9ceb89b8f1236ae0d3b133c6c06cf66a3cd459e6023277b5f959ffc82755c64edfc38c7131d6dc584e253615c8e3be2ffe7bb7f01c"
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
      "0x10d291950915358d2326009f1e1afbea51355abd7bf49e1dedb96dd119fe6798264ba7033930f4de4d19624e6f2c16c4dcf6b4335b8dea849526922e3dc140631b"
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
