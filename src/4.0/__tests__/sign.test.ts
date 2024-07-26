import { SUPPORTED_SIGNING_ALGORITHM } from "../../shared/@types/sign";
import { Wallet } from "@ethersproject/wallet";
import { WRAPPED_DOCUMENT_DID } from "../fixtures";
import { V4SignedWrappedDocument } from "../types";
import { signDocument } from "../sign";

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
    expect(proof.signature).toMatchInlineSnapshot(
      `"0x625a9c8f7915c4f495fc872dd771d30fb289f405b11030862292a015f10602455451c7f4b5981109fb301915327fb502b4961beeb64b9acf3f9c9c8f8b42deeb1c"`
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
    expect(proof.signature).toMatchInlineSnapshot(
      `"0xde916f44e6d3a83ec082fd35eb0b85fc541deebe5e53082c2eaf07ec5ddd503f1929f650f3c39c6b4c224a56599e4e66d018dfd536019560f117b89adff6ead61b"`
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
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Document has not been properly wrapped:
      {
        "_errors": [],
        "proof": {
          "_errors": [],
          "merkleRoot": {
            "_errors": [
              "Required"
            ]
          }
        }
      }"
    `);
  });
});
