import { V4OpenAttestationDocument, V4WrappedDocument, W3cVerifiableCredential } from "../types";
import { wrapDocument } from "../wrap";

describe("V4.0 wrap document", () => {
  test("given a valid v4 document, should wrap correctly", async () => {
    const wrapped = await wrapDocument({
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
      ],
      type: ["VerifiableCredential", "OpenAttestationCredential"],
      credentialSubject: {
        id: "0x1234567890123456789012345678901234567890",
        name: "John Doe",
        country: "SG",
      },
      issuer: {
        id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
        type: "OpenAttestationIssuer",
        name: "Government Technology Agency of Singapore (GovTech)",
        identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
      },
    });
    const parsedResults = V4WrappedDocument.safeParse(wrapped);
    if (!parsedResults.success) {
      throw new Error("Parsing failed");
    }
    const { proof } = parsedResults.data;
    expect(proof.merkleRoot.length).toBe(64);
    expect(proof.privacy.obfuscated).toEqual([]);
    expect(proof.proofPurpose).toBe("assertionMethod");
    expect(proof.proofs).toEqual([]);
    expect(proof.salts.length).toBeGreaterThan(0);
    expect(proof.targetHash.length).toBe(64);
    expect(proof.type).toBe("OpenAttestationMerkleProofSignature2018");
  });

  test("given a document with explicit v4 contexts, but does not conform to the V4 document schema, should throw", async () => {
    await expect(
      wrapDocument({
        "@context": [
          "https://www.w3.org/ns/credentials/v2",
          "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
        ],

        type: ["VerifiableCredential", "OpenAttestationCredential"],
        credentialSubject: {
          id: "0x1234567890123456789012345678901234567890",
          name: "John Doe",
          country: "SG",
        },
        issuer: {
          id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
          name: "Government Technology Agency of Singapore (GovTech)",
          identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
        } as V4OpenAttestationDocument["issuer"],
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Input document does not conform to Open Attestation v4.0 Data Model: 
       {
        "_errors": [],
        "issuer": {
          "_errors": [],
          "type": {
            "_errors": [
              "Invalid literal value, expected \\"OpenAttestationIssuer\\""
            ]
          }
        }
      }"
    `);
  });

  test("given a valid v4 document but has an extra field, should throw", async () => {
    await expect(
      wrapDocument({
        "@context": [
          "https://www.w3.org/ns/credentials/v2",
          "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
        ],

        type: ["VerifiableCredential", "OpenAttestationCredential"],
        credentialSubject: {
          id: "0x1234567890123456789012345678901234567890",
          name: "John Doe",
          country: "SG",
        },
        issuer: {
          id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
          type: "OpenAttestationIssuer",
          name: "Government Technology Agency of Singapore (GovTech)",
          extraField: "extra",
          identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
        },
        // this should not exist
        extraField: "extra",
      } as V4OpenAttestationDocument)
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Input document does not conform to Open Attestation v4.0 Data Model: 
       {
        "_errors": [
          "Unrecognized key(s) in object: 'extraField'"
        ]
      }"
    `);
  });

  test("given a generic w3c vc, should wrap with context and type corrected", async () => {
    const genericW3cVc: W3cVerifiableCredential = {
      "@context": ["https://www.w3.org/ns/credentials/v2"],
      type: ["VerifiableCredential"],
      credentialSubject: {
        id: "0x1234567890123456789012345678901234567890",
        name: "John Doe",
        country: "SG",
      },
      issuer: {
        id: "https://example.com/issuer/123",
      },
    };
    const wrapped = await wrapDocument(genericW3cVc as unknown as V4OpenAttestationDocument);
    const parsedResults = V4WrappedDocument.pick({ "@context": true, type: true }).passthrough().safeParse(wrapped);
    expect(parsedResults.success).toBe(true);
    expect(wrapped.proof.merkleRoot.length).toBe(64);
    expect(wrapped.proof.privacy.obfuscated).toEqual([]);
    expect(wrapped.proof.proofPurpose).toBe("assertionMethod");
    expect(wrapped.proof.proofs).toEqual([]);
    expect(wrapped.proof.salts.length).toBeGreaterThan(0);
    expect(wrapped.proof.targetHash.length).toBe(64);
    expect(wrapped.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
  });
});
