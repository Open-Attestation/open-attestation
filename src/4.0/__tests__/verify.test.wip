import { verify } from "../verify";
import sample from "../schema/sample-verifiable-credential.json";
import batched from "../schema/batched-verifiable-credential-1.json";
import { WrappedDocument } from "../../3.0/types";

// sample1: unwrapped (aka credential), sample2: only 1 doc is wrapped (aka verifiable credential/VC)
const sampleVerifiableCredential = sample as WrappedDocument;

// sample3 & sample4: more than 1 doc wrapped (aka batched VC, where 'proofs' has values)
const sampleBatchedVC = batched as WrappedDocument;

describe("signature", () => {
  describe("verify", () => {
    // Documents without proofs mean these documents are wrapped individually (i.e. targetHash == merkleRoot)
    describe("documents without proofs", () => {
      test("returns true for documents with unaltered data", () => {
        expect(verify(sampleVerifiableCredential)).toBe(true);
      });
      test("returns false for documents with altered value", () => {
        const verifiableCredential = {
          ...sampleVerifiableCredential,
          issuer: {
            id: "https://example.com",
            name: "Fake Name", // Value was originally "DEMO STORE"
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered key", () => {
        const verifiableCredential = {
          ...sampleVerifiableCredential,
          issuer: {
            id: "https://example.com",
            fakename: "DEMO STORE", // Key was originally "name"
          },
        };

        expect(verify(verifiableCredential as any)).toBe(false);
      });
      test("returns false for documents with additional data not part of salt", () => {
        // In this test case, we added the Class 2A licence which is not found in the original salts
        const verifiableCredential = {
          ...sampleVerifiableCredential,
          credentialSubject: {
            ...sampleVerifiableCredential.credentialSubject,
            class: [
              {
                type: "3",
                effectiveDate: "2010-01-01T19:23:24Z",
              },
              {
                type: "3A",
                effectiveDate: "2010-01-01T19:23:24Z",
              },
              {
                // This was added in after it has been wrapped
                type: "2A",
                effectiveDate: "2020-06-05T00:00:00Z",
              },
            ],
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with missing data", () => {
        // In this test case, we removed the Class 3A licence which is in the original salts
        const verifiableCredential = {
          ...sampleVerifiableCredential,
          credentialSubject: {
            ...sampleVerifiableCredential.credentialSubject,
            class: [
              {
                type: "3",
                effectiveDate: "2010-01-01T19:23:24Z",
              },
              // Class 3A was removed
            ],
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
    });

    // Documents with proofs mean these documents are wrapped as a batch (i.e. proofs exist, and targetHash !== merkleRoot)
    describe("documents with proofs", () => {
      test("returns true for documents with unaltered data", () => {
        const verifiableCredential = sampleBatchedVC;
        expect(verify(verifiableCredential)).toBe(true);
      });
      test("returns false for documents with altered value", () => {
        const verifiableCredential = {
          ...sampleBatchedVC,
          issuer: {
            id: "https://example.com",
            name: "Fake Name", // Value was originally "DEMO STORE"
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered key", () => {
        const verifiableCredential = {
          ...sampleBatchedVC,
          issuer: {
            id: "https://example.com",
            fakename: "DEMO STORE", // Key was originally "name"
          },
        };

        expect(verify(verifiableCredential as any)).toBe(false);
      });
      test("returns false for documents with additional data not part of salt", () => {
        // In this test case, we added the Class 2A licence which is not found in the original salts
        const verifiableCredential = {
          ...sampleBatchedVC,
          credentialSubject: {
            ...sampleVerifiableCredential.credentialSubject,
            class: [
              {
                type: "3",
                effectiveDate: "2010-01-01T19:23:24Z",
              },
              {
                type: "3A",
                effectiveDate: "2010-01-01T19:23:24Z",
              },
              {
                // This was added in after it has been wrapped
                type: "2A",
                effectiveDate: "2020-06-05T00:00:00Z",
              },
            ],
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with missing data", () => {
        // In this test case, we removed the Class 3A licence which is in the original salts
        const verifiableCredential = {
          ...sampleBatchedVC,
          credentialSubject: {
            ...sampleVerifiableCredential.credentialSubject,
            class: [
              {
                type: "3",
                effectiveDate: "2010-01-01T19:23:24Z",
              },
              // Class 3A was removed
            ],
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered targetHash", () => {
        const verifiableCredential = {
          ...sampleBatchedVC,
          proof: {
            ...sampleBatchedVC.proof,
            targetHash: "81859d00caadd33f4100b7d37230684b953195786426a1be2c3bfea32b3c2a53", // Was "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4"
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered proofs", () => {
        // Since the proofs key only exist when multiple documents are wrapped, we have to use sampleMultiVC1 or sampleMultiVC2
        const verifiableCredential = {
          ...sampleBatchedVC,
          proof: {
            ...sampleBatchedVC.proof,
            proofs: ["964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5531"], // Was "964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5530"
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with missing proofs", () => {
        const verifiableCredential = {
          ...sampleBatchedVC,
          proof: {
            ...sampleBatchedVC.proof,
            proofs: [], // Was "964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5530"
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered merkleRoot", () => {
        const verifiableCredential = {
          ...sampleBatchedVC,
          proof: {
            ...sampleBatchedVC.proof,
            merkleRoot: "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4", // Was "8505f27ea43ca3720b419ab96b80039eb4b2a1126acc9cb90f2a31349c110137"
          },
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
    });
  });
});
