import { verify } from "./verify";
import sample from "./schema/wrapped-sample-document.json";
import batched from "./schema/wrapped-batched-documents-1.json";
import { OpenAttestationVerifiableCredential, SignatureAlgorithm } from "../shared/@types/document";

// sample1: unwrapped (aka credential), sample2: only 1 doc is wrapped (aka verifiable credential/VC)
const sampleVerifiableCredential = sample as OpenAttestationVerifiableCredential;

// sample3 & sample4: more than 1 doc wrapped (aka batched VC, where 'proofs' has values)
const sampleBatched1 = batched as OpenAttestationVerifiableCredential;

describe("signature", () => {
  describe("verify", () => {
    // Documents without proofs mean these documents are wrapped individually (i.e. targetHash == merkleRoot)
    describe("documents without proofs", () => {
      test("returns true for documents with unaltered data", () => {
        const verifiableCredential = sampleVerifiableCredential;
        expect(verify(verifiableCredential)).toBe(true);
      });
      test("returns false for documents with altered value", () => {
        const verifiableCredential = {
          ...sampleVerifiableCredential,
          recipient: {
            name: "Fake Name" // Value was originally "Recipient Name"
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered key", () => {
        const verifiableCredential = {
          ...sampleVerifiableCredential,
          recipient: {
            fakename: "Recipient Name" // Key was originally "name"
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with additional data not part of salt", () => {
        // In this test case, we added the Class 2A licence which is not found in the original salts
        const verifiableCredential = {
          ...sampleVerifiableCredential,
          credentialSubject: {
            id: "did:example:SERIAL_NUMBER_123",
            class: [
              {
                type: "3",
                effectiveDate: "2010-01-01T19:23:24Z"
              },
              {
                type: "3A",
                effectiveDate: "2010-01-01T19:23:24Z"
              },
              {
                // This was added in after it has been wrapped
                type: "2A",
                effectiveDate: "2020-06-05T00:00:00Z"
              }
            ]
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with missing data", () => {
        // In this test case, we removed the Class 3A licence which is in the original salts
        const verifiableCredential = {
          ...sampleVerifiableCredential,
          credentialSubject: {
            id: "did:example:SERIAL_NUMBER_123",
            class: [
              {
                type: "3",
                effectiveDate: "2010-01-01T19:23:24Z"
              }
              // Class 3A was removed
            ]
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
    });

    // Documents with proofs mean these documents are wrapped as a batch (i.e. proofs exist, and targetHash !== merkleRoot)
    describe("documents with proofs", () => {
      test("returns true for documents with unaltered data", () => {
        const verifiableCredential = {
          ...sampleBatched1,
          proof: {
            type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
            targetHash: "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4",
            proofs: ["964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5530"],
            merkleRoot: "8505f27ea43ca3720b419ab96b80039eb4b2a1126acc9cb90f2a31349c110137",
            salts:
              "W3sidmFsdWUiOiIyNGU1NjA2NS0xZDIwLTRiODEtOTI3MC05MDZiYWYwNTQ2M2EiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJkNDY3ZjM0OC05ZTgzLTRmOGYtYjliNS01NTQyNzlkODU0ODMiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiNTY5OGFkYmYtMjIwMy00MjNiLThmZjQtNzgyMDAwZTk5YzRmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjQzMzA5MDgyLWZlYWEtNDNlNS1hMDg4LTc4ZWFjMGRlYjMzOCIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiI3ZmFkZjk5YS1jZmYyLTQ4MWItYWI5Yi1jNmVkNTEyMmI3MDQiLCJwYXRoIjoiQGNvbnRleHRbM10ifSx7InZhbHVlIjoiOWRkYjAxYzUtM2JjYi00ZDUwLTgwODktMmNlOTMzZjU2OTg4IiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI4ZjBmMDAwMi1kZDY3LTQzZjktYjFlOC0xZDE3MjNkZGQ2ZjQiLCJwYXRoIjoibmFtZSJ9LHsidmFsdWUiOiIwNzNiMjE0My04Y2NiLTQxZTQtYTA3MC01MjY0YTRiOGY1NDUiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImIzZGZjOGIyLTMxNzYtNDU0Ny1hNTVjLTQxZWE1ZjM3MjA5MiIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiYmViMTI4YTktOTIwZS00MGIxLWE3NTQtYzRiNDIyYzgwOWYwIiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJlYjg5NmQ4MS1kZjYwLTQ0MzgtOTgyZS0wZGE3NDA4ZDk3MTgiLCJwYXRoIjoiaXNzdWVyLm5hbWUifSx7InZhbHVlIjoiMmYxM2ZiYzItOWJiMS00MzQzLTgzYmMtYTAxNWEzNGIzODI4IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiYjRlMTBjOWEtZWNhOS00MzBkLWI3ODQtNWJiZDE4MDczNTE1IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImNkZjFlNDE1LTE5NjUtNDdlMi1iNzU2LTAyYzc3MThjNmNkYSIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImNjMTk4MDZhLTk2YTAtNDRiOC1iYTNkLTBlOTkwNzI2OTQwYiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjMxMTNiZGIyLTAwZmQtNDAzMC1hMTdkLWE3ODJlNGQyNGMzNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiI3ZDMyNTY0MS05NDY3LTQ1NmEtYWQ5Yy02Mjk4NDdiNDU5NmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0udHlwZSJ9LHsidmFsdWUiOiIzZjBiYjcwNi0zZDQwLTQ2ZTQtYTY4OS01ZTI5OGRkZDQ4ZWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIwY2RmZGU2Ny0yNGIyLTRhOGQtYjUyNS05ZDI1MWIyYTIzYzQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0udHlwZSJ9LHsidmFsdWUiOiI4NDdlMjM2MS1jN2ZhLTQ0MDUtOTlhOS0wN2NkMmViZmU5ZmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJlNDg1Yjk3MC1mNzA0LTQ2Y2UtOWE3Ny01ZjI5MjBhOTIwZWYiLCJwYXRoIjoidGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIxY2MzNTM4OC0wNzNlLTRhZTgtOTFiMC1lYTc5NTVjYWUyOTgiLCJwYXRoIjoidGVtcGxhdGUudHlwZSJ9LHsidmFsdWUiOiJmYTA2MjI3MS04NjdkLTRhM2QtYjBhNy03OWE1ZTMyM2NiZDgiLCJwYXRoIjoidGVtcGxhdGUudXJsIn0seyJ2YWx1ZSI6ImU3OTZhYTdlLTFhOWMtNDBmOC04NzUzLTVjMDRhZmQ0OGI5ZCIsInBhdGgiOiJvYVByb29mLnR5cGUifSx7InZhbHVlIjoiZDFhZDc0YWQtNzYwZS00ZmZkLWFmYzEtZmZjNDQyY2UyNjA3IiwicGF0aCI6Im9hUHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImM0YWRjNTUyLWY3ZTMtNGExYi1hNjMyLTQwNjI1NmVkMzYyNCIsInBhdGgiOiJvYVByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjllMzQ2MmM2LWZhN2EtNGRkNi1iZGU5LTE5N2I0NjU5ZDQwNyIsInBhdGgiOiJyZWNpcGllbnQubmFtZSJ9LHsidmFsdWUiOiJjODEwODIyMS1hOTM2LTQ3OGEtYWM3YS02YjA5ZjJlYWZmZTMiLCJwYXRoIjoiZXZpZGVuY2VbMF0udHlwZSJ9LHsidmFsdWUiOiIwNGE3MTg4OC1lNjY0LTQxMDgtYWI4ZC1jZDFjMjI0Nzc5YTEiLCJwYXRoIjoiZXZpZGVuY2VbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiNDg2ZjQzZTgtZDQ1MS00MDBmLTg0ZGItZjA3YmRjMWU0YjA1IiwicGF0aCI6ImV2aWRlbmNlWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6ImMwMzM4MmI3LTk4ZDYtNDRhMC1hYTQxLTcyMTJiMzk4YTY2NCIsInBhdGgiOiJldmlkZW5jZVswXS5kYXRhIn1d",
            privacy: {
              obfuscated: []
            }
          }
        };

        expect(verify(verifiableCredential)).toBe(true);
      });
      test("returns false for documents with altered value", () => {
        const verifiableCredential = {
          ...sampleBatched1,
          recipient: {
            name: "Fake Name" // Value was originally "Recipient Name"
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered key", () => {
        const verifiableCredential = {
          ...sampleBatched1,
          recipient: {
            fakename: "Recipient Name" // Key was originally "name"
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with additional data not part of salt", () => {
        // In this test case, we added the Class 2A licence which is not found in the original salts
        const verifiableCredential = {
          ...sampleBatched1,
          credentialSubject: {
            id: "did:example:SERIAL_NUMBER_123",
            class: [
              {
                type: "3",
                effectiveDate: "2010-01-01T19:23:24Z"
              },
              {
                type: "3A",
                effectiveDate: "2010-01-01T19:23:24Z"
              },
              {
                // This was added in after it has been wrapped
                type: "2A",
                effectiveDate: "2020-06-05T00:00:00Z"
              }
            ]
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with missing data", () => {
        // In this test case, we removed the Class 3A licence which is in the original salts
        const verifiableCredential = {
          ...sampleBatched1,
          credentialSubject: {
            id: "did:example:SERIAL_NUMBER_123",
            class: [
              {
                type: "3",
                effectiveDate: "2010-01-01T19:23:24Z"
              }
              // Class 3A was removed
            ]
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered targetHash", () => {
        const verifiableCredential = {
          ...sampleBatched1,
          proof: {
            type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
            targetHash: "81859d00caadd33f4100b7d37230684b953195786426a1be2c3bfea32b3c2a53", // Was "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4"
            proofs: ["964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5530"],
            merkleRoot: "8505f27ea43ca3720b419ab96b80039eb4b2a1126acc9cb90f2a31349c110137",
            salts:
              "W3sidmFsdWUiOiIyNGU1NjA2NS0xZDIwLTRiODEtOTI3MC05MDZiYWYwNTQ2M2EiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJkNDY3ZjM0OC05ZTgzLTRmOGYtYjliNS01NTQyNzlkODU0ODMiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiNTY5OGFkYmYtMjIwMy00MjNiLThmZjQtNzgyMDAwZTk5YzRmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjQzMzA5MDgyLWZlYWEtNDNlNS1hMDg4LTc4ZWFjMGRlYjMzOCIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiI3ZmFkZjk5YS1jZmYyLTQ4MWItYWI5Yi1jNmVkNTEyMmI3MDQiLCJwYXRoIjoiQGNvbnRleHRbM10ifSx7InZhbHVlIjoiOWRkYjAxYzUtM2JjYi00ZDUwLTgwODktMmNlOTMzZjU2OTg4IiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI4ZjBmMDAwMi1kZDY3LTQzZjktYjFlOC0xZDE3MjNkZGQ2ZjQiLCJwYXRoIjoibmFtZSJ9LHsidmFsdWUiOiIwNzNiMjE0My04Y2NiLTQxZTQtYTA3MC01MjY0YTRiOGY1NDUiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImIzZGZjOGIyLTMxNzYtNDU0Ny1hNTVjLTQxZWE1ZjM3MjA5MiIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiYmViMTI4YTktOTIwZS00MGIxLWE3NTQtYzRiNDIyYzgwOWYwIiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJlYjg5NmQ4MS1kZjYwLTQ0MzgtOTgyZS0wZGE3NDA4ZDk3MTgiLCJwYXRoIjoiaXNzdWVyLm5hbWUifSx7InZhbHVlIjoiMmYxM2ZiYzItOWJiMS00MzQzLTgzYmMtYTAxNWEzNGIzODI4IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiYjRlMTBjOWEtZWNhOS00MzBkLWI3ODQtNWJiZDE4MDczNTE1IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImNkZjFlNDE1LTE5NjUtNDdlMi1iNzU2LTAyYzc3MThjNmNkYSIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImNjMTk4MDZhLTk2YTAtNDRiOC1iYTNkLTBlOTkwNzI2OTQwYiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjMxMTNiZGIyLTAwZmQtNDAzMC1hMTdkLWE3ODJlNGQyNGMzNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiI3ZDMyNTY0MS05NDY3LTQ1NmEtYWQ5Yy02Mjk4NDdiNDU5NmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0udHlwZSJ9LHsidmFsdWUiOiIzZjBiYjcwNi0zZDQwLTQ2ZTQtYTY4OS01ZTI5OGRkZDQ4ZWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIwY2RmZGU2Ny0yNGIyLTRhOGQtYjUyNS05ZDI1MWIyYTIzYzQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0udHlwZSJ9LHsidmFsdWUiOiI4NDdlMjM2MS1jN2ZhLTQ0MDUtOTlhOS0wN2NkMmViZmU5ZmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJlNDg1Yjk3MC1mNzA0LTQ2Y2UtOWE3Ny01ZjI5MjBhOTIwZWYiLCJwYXRoIjoidGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIxY2MzNTM4OC0wNzNlLTRhZTgtOTFiMC1lYTc5NTVjYWUyOTgiLCJwYXRoIjoidGVtcGxhdGUudHlwZSJ9LHsidmFsdWUiOiJmYTA2MjI3MS04NjdkLTRhM2QtYjBhNy03OWE1ZTMyM2NiZDgiLCJwYXRoIjoidGVtcGxhdGUudXJsIn0seyJ2YWx1ZSI6ImU3OTZhYTdlLTFhOWMtNDBmOC04NzUzLTVjMDRhZmQ0OGI5ZCIsInBhdGgiOiJvYVByb29mLnR5cGUifSx7InZhbHVlIjoiZDFhZDc0YWQtNzYwZS00ZmZkLWFmYzEtZmZjNDQyY2UyNjA3IiwicGF0aCI6Im9hUHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImM0YWRjNTUyLWY3ZTMtNGExYi1hNjMyLTQwNjI1NmVkMzYyNCIsInBhdGgiOiJvYVByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjllMzQ2MmM2LWZhN2EtNGRkNi1iZGU5LTE5N2I0NjU5ZDQwNyIsInBhdGgiOiJyZWNpcGllbnQubmFtZSJ9LHsidmFsdWUiOiJjODEwODIyMS1hOTM2LTQ3OGEtYWM3YS02YjA5ZjJlYWZmZTMiLCJwYXRoIjoiZXZpZGVuY2VbMF0udHlwZSJ9LHsidmFsdWUiOiIwNGE3MTg4OC1lNjY0LTQxMDgtYWI4ZC1jZDFjMjI0Nzc5YTEiLCJwYXRoIjoiZXZpZGVuY2VbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiNDg2ZjQzZTgtZDQ1MS00MDBmLTg0ZGItZjA3YmRjMWU0YjA1IiwicGF0aCI6ImV2aWRlbmNlWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6ImMwMzM4MmI3LTk4ZDYtNDRhMC1hYTQxLTcyMTJiMzk4YTY2NCIsInBhdGgiOiJldmlkZW5jZVswXS5kYXRhIn1d",
            privacy: {
              obfuscated: []
            }
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered proofs", () => {
        // Since the proofs key only exist when multiple documents are wrapped, we have to use sampleMultiVC1 or sampleMultiVC2
        const verifiableCredential = {
          ...sampleBatched1,
          proof: {
            type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
            targetHash: "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4",
            proofs: ["964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5531"], // Was "964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5530"
            merkleRoot: "8505f27ea43ca3720b419ab96b80039eb4b2a1126acc9cb90f2a31349c110137",
            salts:
              "W3sidmFsdWUiOiIyNGU1NjA2NS0xZDIwLTRiODEtOTI3MC05MDZiYWYwNTQ2M2EiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJkNDY3ZjM0OC05ZTgzLTRmOGYtYjliNS01NTQyNzlkODU0ODMiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiNTY5OGFkYmYtMjIwMy00MjNiLThmZjQtNzgyMDAwZTk5YzRmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjQzMzA5MDgyLWZlYWEtNDNlNS1hMDg4LTc4ZWFjMGRlYjMzOCIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiI3ZmFkZjk5YS1jZmYyLTQ4MWItYWI5Yi1jNmVkNTEyMmI3MDQiLCJwYXRoIjoiQGNvbnRleHRbM10ifSx7InZhbHVlIjoiOWRkYjAxYzUtM2JjYi00ZDUwLTgwODktMmNlOTMzZjU2OTg4IiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI4ZjBmMDAwMi1kZDY3LTQzZjktYjFlOC0xZDE3MjNkZGQ2ZjQiLCJwYXRoIjoibmFtZSJ9LHsidmFsdWUiOiIwNzNiMjE0My04Y2NiLTQxZTQtYTA3MC01MjY0YTRiOGY1NDUiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImIzZGZjOGIyLTMxNzYtNDU0Ny1hNTVjLTQxZWE1ZjM3MjA5MiIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiYmViMTI4YTktOTIwZS00MGIxLWE3NTQtYzRiNDIyYzgwOWYwIiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJlYjg5NmQ4MS1kZjYwLTQ0MzgtOTgyZS0wZGE3NDA4ZDk3MTgiLCJwYXRoIjoiaXNzdWVyLm5hbWUifSx7InZhbHVlIjoiMmYxM2ZiYzItOWJiMS00MzQzLTgzYmMtYTAxNWEzNGIzODI4IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiYjRlMTBjOWEtZWNhOS00MzBkLWI3ODQtNWJiZDE4MDczNTE1IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImNkZjFlNDE1LTE5NjUtNDdlMi1iNzU2LTAyYzc3MThjNmNkYSIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImNjMTk4MDZhLTk2YTAtNDRiOC1iYTNkLTBlOTkwNzI2OTQwYiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjMxMTNiZGIyLTAwZmQtNDAzMC1hMTdkLWE3ODJlNGQyNGMzNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiI3ZDMyNTY0MS05NDY3LTQ1NmEtYWQ5Yy02Mjk4NDdiNDU5NmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0udHlwZSJ9LHsidmFsdWUiOiIzZjBiYjcwNi0zZDQwLTQ2ZTQtYTY4OS01ZTI5OGRkZDQ4ZWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIwY2RmZGU2Ny0yNGIyLTRhOGQtYjUyNS05ZDI1MWIyYTIzYzQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0udHlwZSJ9LHsidmFsdWUiOiI4NDdlMjM2MS1jN2ZhLTQ0MDUtOTlhOS0wN2NkMmViZmU5ZmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJlNDg1Yjk3MC1mNzA0LTQ2Y2UtOWE3Ny01ZjI5MjBhOTIwZWYiLCJwYXRoIjoidGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIxY2MzNTM4OC0wNzNlLTRhZTgtOTFiMC1lYTc5NTVjYWUyOTgiLCJwYXRoIjoidGVtcGxhdGUudHlwZSJ9LHsidmFsdWUiOiJmYTA2MjI3MS04NjdkLTRhM2QtYjBhNy03OWE1ZTMyM2NiZDgiLCJwYXRoIjoidGVtcGxhdGUudXJsIn0seyJ2YWx1ZSI6ImU3OTZhYTdlLTFhOWMtNDBmOC04NzUzLTVjMDRhZmQ0OGI5ZCIsInBhdGgiOiJvYVByb29mLnR5cGUifSx7InZhbHVlIjoiZDFhZDc0YWQtNzYwZS00ZmZkLWFmYzEtZmZjNDQyY2UyNjA3IiwicGF0aCI6Im9hUHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImM0YWRjNTUyLWY3ZTMtNGExYi1hNjMyLTQwNjI1NmVkMzYyNCIsInBhdGgiOiJvYVByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjllMzQ2MmM2LWZhN2EtNGRkNi1iZGU5LTE5N2I0NjU5ZDQwNyIsInBhdGgiOiJyZWNpcGllbnQubmFtZSJ9LHsidmFsdWUiOiJjODEwODIyMS1hOTM2LTQ3OGEtYWM3YS02YjA5ZjJlYWZmZTMiLCJwYXRoIjoiZXZpZGVuY2VbMF0udHlwZSJ9LHsidmFsdWUiOiIwNGE3MTg4OC1lNjY0LTQxMDgtYWI4ZC1jZDFjMjI0Nzc5YTEiLCJwYXRoIjoiZXZpZGVuY2VbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiNDg2ZjQzZTgtZDQ1MS00MDBmLTg0ZGItZjA3YmRjMWU0YjA1IiwicGF0aCI6ImV2aWRlbmNlWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6ImMwMzM4MmI3LTk4ZDYtNDRhMC1hYTQxLTcyMTJiMzk4YTY2NCIsInBhdGgiOiJldmlkZW5jZVswXS5kYXRhIn1d",
            privacy: {
              obfuscated: []
            }
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with missing proofs", () => {
        const verifiableCredential = {
          ...sampleBatched1,
          proof: {
            type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
            targetHash: "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4",
            proofs: [], // Was "964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5530"
            merkleRoot: "8505f27ea43ca3720b419ab96b80039eb4b2a1126acc9cb90f2a31349c110137",
            salts:
              "W3sidmFsdWUiOiIyNGU1NjA2NS0xZDIwLTRiODEtOTI3MC05MDZiYWYwNTQ2M2EiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJkNDY3ZjM0OC05ZTgzLTRmOGYtYjliNS01NTQyNzlkODU0ODMiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiNTY5OGFkYmYtMjIwMy00MjNiLThmZjQtNzgyMDAwZTk5YzRmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjQzMzA5MDgyLWZlYWEtNDNlNS1hMDg4LTc4ZWFjMGRlYjMzOCIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiI3ZmFkZjk5YS1jZmYyLTQ4MWItYWI5Yi1jNmVkNTEyMmI3MDQiLCJwYXRoIjoiQGNvbnRleHRbM10ifSx7InZhbHVlIjoiOWRkYjAxYzUtM2JjYi00ZDUwLTgwODktMmNlOTMzZjU2OTg4IiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI4ZjBmMDAwMi1kZDY3LTQzZjktYjFlOC0xZDE3MjNkZGQ2ZjQiLCJwYXRoIjoibmFtZSJ9LHsidmFsdWUiOiIwNzNiMjE0My04Y2NiLTQxZTQtYTA3MC01MjY0YTRiOGY1NDUiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImIzZGZjOGIyLTMxNzYtNDU0Ny1hNTVjLTQxZWE1ZjM3MjA5MiIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiYmViMTI4YTktOTIwZS00MGIxLWE3NTQtYzRiNDIyYzgwOWYwIiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJlYjg5NmQ4MS1kZjYwLTQ0MzgtOTgyZS0wZGE3NDA4ZDk3MTgiLCJwYXRoIjoiaXNzdWVyLm5hbWUifSx7InZhbHVlIjoiMmYxM2ZiYzItOWJiMS00MzQzLTgzYmMtYTAxNWEzNGIzODI4IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiYjRlMTBjOWEtZWNhOS00MzBkLWI3ODQtNWJiZDE4MDczNTE1IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImNkZjFlNDE1LTE5NjUtNDdlMi1iNzU2LTAyYzc3MThjNmNkYSIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImNjMTk4MDZhLTk2YTAtNDRiOC1iYTNkLTBlOTkwNzI2OTQwYiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjMxMTNiZGIyLTAwZmQtNDAzMC1hMTdkLWE3ODJlNGQyNGMzNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiI3ZDMyNTY0MS05NDY3LTQ1NmEtYWQ5Yy02Mjk4NDdiNDU5NmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0udHlwZSJ9LHsidmFsdWUiOiIzZjBiYjcwNi0zZDQwLTQ2ZTQtYTY4OS01ZTI5OGRkZDQ4ZWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIwY2RmZGU2Ny0yNGIyLTRhOGQtYjUyNS05ZDI1MWIyYTIzYzQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0udHlwZSJ9LHsidmFsdWUiOiI4NDdlMjM2MS1jN2ZhLTQ0MDUtOTlhOS0wN2NkMmViZmU5ZmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJlNDg1Yjk3MC1mNzA0LTQ2Y2UtOWE3Ny01ZjI5MjBhOTIwZWYiLCJwYXRoIjoidGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIxY2MzNTM4OC0wNzNlLTRhZTgtOTFiMC1lYTc5NTVjYWUyOTgiLCJwYXRoIjoidGVtcGxhdGUudHlwZSJ9LHsidmFsdWUiOiJmYTA2MjI3MS04NjdkLTRhM2QtYjBhNy03OWE1ZTMyM2NiZDgiLCJwYXRoIjoidGVtcGxhdGUudXJsIn0seyJ2YWx1ZSI6ImU3OTZhYTdlLTFhOWMtNDBmOC04NzUzLTVjMDRhZmQ0OGI5ZCIsInBhdGgiOiJvYVByb29mLnR5cGUifSx7InZhbHVlIjoiZDFhZDc0YWQtNzYwZS00ZmZkLWFmYzEtZmZjNDQyY2UyNjA3IiwicGF0aCI6Im9hUHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImM0YWRjNTUyLWY3ZTMtNGExYi1hNjMyLTQwNjI1NmVkMzYyNCIsInBhdGgiOiJvYVByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjllMzQ2MmM2LWZhN2EtNGRkNi1iZGU5LTE5N2I0NjU5ZDQwNyIsInBhdGgiOiJyZWNpcGllbnQubmFtZSJ9LHsidmFsdWUiOiJjODEwODIyMS1hOTM2LTQ3OGEtYWM3YS02YjA5ZjJlYWZmZTMiLCJwYXRoIjoiZXZpZGVuY2VbMF0udHlwZSJ9LHsidmFsdWUiOiIwNGE3MTg4OC1lNjY0LTQxMDgtYWI4ZC1jZDFjMjI0Nzc5YTEiLCJwYXRoIjoiZXZpZGVuY2VbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiNDg2ZjQzZTgtZDQ1MS00MDBmLTg0ZGItZjA3YmRjMWU0YjA1IiwicGF0aCI6ImV2aWRlbmNlWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6ImMwMzM4MmI3LTk4ZDYtNDRhMC1hYTQxLTcyMTJiMzk4YTY2NCIsInBhdGgiOiJldmlkZW5jZVswXS5kYXRhIn1d",
            privacy: {
              obfuscated: []
            }
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
      test("returns false for documents with altered merkleRoot", () => {
        const verifiableCredential = {
          ...sampleBatched1,
          proof: {
            type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
            targetHash: "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4",
            proofs: ["964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5530"],
            merkleRoot: "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4", // Was "8505f27ea43ca3720b419ab96b80039eb4b2a1126acc9cb90f2a31349c110137"
            salts:
              "W3sidmFsdWUiOiIyNGU1NjA2NS0xZDIwLTRiODEtOTI3MC05MDZiYWYwNTQ2M2EiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJkNDY3ZjM0OC05ZTgzLTRmOGYtYjliNS01NTQyNzlkODU0ODMiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiNTY5OGFkYmYtMjIwMy00MjNiLThmZjQtNzgyMDAwZTk5YzRmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjQzMzA5MDgyLWZlYWEtNDNlNS1hMDg4LTc4ZWFjMGRlYjMzOCIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiI3ZmFkZjk5YS1jZmYyLTQ4MWItYWI5Yi1jNmVkNTEyMmI3MDQiLCJwYXRoIjoiQGNvbnRleHRbM10ifSx7InZhbHVlIjoiOWRkYjAxYzUtM2JjYi00ZDUwLTgwODktMmNlOTMzZjU2OTg4IiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI4ZjBmMDAwMi1kZDY3LTQzZjktYjFlOC0xZDE3MjNkZGQ2ZjQiLCJwYXRoIjoibmFtZSJ9LHsidmFsdWUiOiIwNzNiMjE0My04Y2NiLTQxZTQtYTA3MC01MjY0YTRiOGY1NDUiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImIzZGZjOGIyLTMxNzYtNDU0Ny1hNTVjLTQxZWE1ZjM3MjA5MiIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiYmViMTI4YTktOTIwZS00MGIxLWE3NTQtYzRiNDIyYzgwOWYwIiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJlYjg5NmQ4MS1kZjYwLTQ0MzgtOTgyZS0wZGE3NDA4ZDk3MTgiLCJwYXRoIjoiaXNzdWVyLm5hbWUifSx7InZhbHVlIjoiMmYxM2ZiYzItOWJiMS00MzQzLTgzYmMtYTAxNWEzNGIzODI4IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiYjRlMTBjOWEtZWNhOS00MzBkLWI3ODQtNWJiZDE4MDczNTE1IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImNkZjFlNDE1LTE5NjUtNDdlMi1iNzU2LTAyYzc3MThjNmNkYSIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImNjMTk4MDZhLTk2YTAtNDRiOC1iYTNkLTBlOTkwNzI2OTQwYiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjMxMTNiZGIyLTAwZmQtNDAzMC1hMTdkLWE3ODJlNGQyNGMzNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiI3ZDMyNTY0MS05NDY3LTQ1NmEtYWQ5Yy02Mjk4NDdiNDU5NmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0udHlwZSJ9LHsidmFsdWUiOiIzZjBiYjcwNi0zZDQwLTQ2ZTQtYTY4OS01ZTI5OGRkZDQ4ZWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIwY2RmZGU2Ny0yNGIyLTRhOGQtYjUyNS05ZDI1MWIyYTIzYzQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0udHlwZSJ9LHsidmFsdWUiOiI4NDdlMjM2MS1jN2ZhLTQ0MDUtOTlhOS0wN2NkMmViZmU5ZmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJlNDg1Yjk3MC1mNzA0LTQ2Y2UtOWE3Ny01ZjI5MjBhOTIwZWYiLCJwYXRoIjoidGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIxY2MzNTM4OC0wNzNlLTRhZTgtOTFiMC1lYTc5NTVjYWUyOTgiLCJwYXRoIjoidGVtcGxhdGUudHlwZSJ9LHsidmFsdWUiOiJmYTA2MjI3MS04NjdkLTRhM2QtYjBhNy03OWE1ZTMyM2NiZDgiLCJwYXRoIjoidGVtcGxhdGUudXJsIn0seyJ2YWx1ZSI6ImU3OTZhYTdlLTFhOWMtNDBmOC04NzUzLTVjMDRhZmQ0OGI5ZCIsInBhdGgiOiJvYVByb29mLnR5cGUifSx7InZhbHVlIjoiZDFhZDc0YWQtNzYwZS00ZmZkLWFmYzEtZmZjNDQyY2UyNjA3IiwicGF0aCI6Im9hUHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImM0YWRjNTUyLWY3ZTMtNGExYi1hNjMyLTQwNjI1NmVkMzYyNCIsInBhdGgiOiJvYVByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjllMzQ2MmM2LWZhN2EtNGRkNi1iZGU5LTE5N2I0NjU5ZDQwNyIsInBhdGgiOiJyZWNpcGllbnQubmFtZSJ9LHsidmFsdWUiOiJjODEwODIyMS1hOTM2LTQ3OGEtYWM3YS02YjA5ZjJlYWZmZTMiLCJwYXRoIjoiZXZpZGVuY2VbMF0udHlwZSJ9LHsidmFsdWUiOiIwNGE3MTg4OC1lNjY0LTQxMDgtYWI4ZC1jZDFjMjI0Nzc5YTEiLCJwYXRoIjoiZXZpZGVuY2VbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiNDg2ZjQzZTgtZDQ1MS00MDBmLTg0ZGItZjA3YmRjMWU0YjA1IiwicGF0aCI6ImV2aWRlbmNlWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6ImMwMzM4MmI3LTk4ZDYtNDRhMC1hYTQxLTcyMTJiMzk4YTY2NCIsInBhdGgiOiJldmlkZW5jZVswXS5kYXRhIn1d",
            privacy: {
              obfuscated: []
            }
          }
        };

        expect(verify(verifiableCredential)).toBe(false);
      });
    });
  });
});
