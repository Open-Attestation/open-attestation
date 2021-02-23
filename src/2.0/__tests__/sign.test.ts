import { SUPPORTED_SIGNING_ALGORITHM } from "../../shared/@types/sign";
import { signDocument, v2 } from "../../index";
import rawWrappedDocumentV2 from "../../../test/fixtures/v2/did-wrapped.json";

const wrappedDocumentV2 = rawWrappedDocumentV2 as v2.WrappedDocument;

describe("v2", () => {
  it("should sign a document", async () => {
    const { proof } = await signDocument(
      wrappedDocumentV2,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655"
    );
    expect(proof.length).toBe(1);
    expect(proof[0].proofPurpose).toBe("assertionMethod");
    expect(proof[0].type).toBe("OpenAttestationSignature2018");
    expect(proof[0].verificationMethod).toBe("did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller");
    expect(proof[0].signature).toBe(
      "0xff0227ce8400a17a2d80073a95fd895f4fed0011954c90eef389bc618087a4b36ed958775420d122e9a6764c6ffe9d3302d4f45fb065d5e962c3572d3872f31a1b"
    );
  });

  it("should sign a document which was previously signed", async () => {
    const signedDocument = await signDocument(
      wrappedDocumentV2,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      "did:ethr:0xb6De3744E1259e1aB692f5a277f053B79429c5a2#controller",
      "0x812269266b34d2919f737daf22db95f02642f8cdc0ca673bf3f701599f4971f5"
    );
    const { proof } = await signDocument(
      signedDocument,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655"
    );
    expect(proof.length).toBe(2);
    expect(proof[1].proofPurpose).toBe("assertionMethod");
    expect(proof[1].type).toBe("OpenAttestationSignature2018");
    expect(proof[1].verificationMethod).toBe("did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller");
    expect(proof[1].signature).toBe(
      "0xff0227ce8400a17a2d80073a95fd895f4fed0011954c90eef389bc618087a4b36ed958775420d122e9a6764c6ffe9d3302d4f45fb065d5e962c3572d3872f31a1b"
    );
  });
});
