import {
  OAVerifiableCredential,
  ProoflessOAVerifiableCredential,
  OADigestedOAVerifiableCredential,
  W3cVerifiableCredential,
  ProoflessW3cVerifiableCredential,
} from "../types";
import { digestVc } from "../digest";

describe("V4.0 digest", () => {
  test("given a valid v4 VC, should digest correctly", async () => {
    const digested = await digestVc({
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
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
    const parsedResults = OADigestedOAVerifiableCredential.safeParse(digested);
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
    expect(proof.type).toBe("OpenAttestationHashProof2018");
  });

  test("given a VC with explicit v4 contexts, but does not conform to the V4 VC schema, should throw", async () => {
    await expect(
      digestVc({
        "@context": [
          "https://www.w3.org/ns/credentials/v2",
          "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
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
        } as OAVerifiableCredential["issuer"],
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Input VC does not conform to Open Attestation v4.0 Data Model: 
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

  test("given a valid v4 VC but has an extra field, should throw", async () => {
    await expect(
      digestVc({
        "@context": [
          "https://www.w3.org/ns/credentials/v2",
          "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
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
      } as ProoflessOAVerifiableCredential)
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Input VC does not conform to Open Attestation v4.0 Data Model: 
       {
        "_errors": [
          "Unrecognized key(s) in object: 'extraField'"
        ]
      }"
    `);
  });

  test("given a generic W3C VC and with validate with OA data model disabled, should digest with context and type corrected", async () => {
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
    const digested = await digestVc(genericW3cVc as unknown as ProoflessW3cVerifiableCredential, true);
    const parsedResults = OADigestedOAVerifiableCredential.pick({ "@context": true, type: true })
      .passthrough()
      .safeParse(digested);
    expect(parsedResults.success).toBe(true);
    expect(digested.proof.merkleRoot.length).toBe(64);
    expect(digested.proof.privacy.obfuscated).toEqual([]);
    expect(digested.proof.proofPurpose).toBe("assertionMethod");
    expect(digested.proof.proofs).toEqual([]);
    expect(digested.proof.salts.length).toBeGreaterThan(0);
    expect(digested.proof.targetHash.length).toBe(64);
    expect(digested.proof.type).toBe("OpenAttestationHashProof2018");
  });
});
