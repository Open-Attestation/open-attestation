import { verify } from "./verify";
import sample1 from "./schema/sample-document.json";
import sample2 from "./schema/wrapped-sample-document.json";
import batched1 from "./schema/wrapped-batched-documents-1.json";
import batched2 from "./schema/wrapped-batched-documents-2.json";

import { cloneDeep } from "lodash";
import { OpenAttestationVerifiableCredential, SignatureAlgorithm, SchemaId } from "../shared/@types/document";
import { OpenAttestationCredential } from "src/__generated__/schemaV3";
import { wrapDocuments } from "../index";

// sample1: unwrapped (aka credential), sample2: only 1 doc is wrapped (aka verifiable credential/VC)
const sampleCredential = sample1 as OpenAttestationCredential;
const sampleVerifiableCredential = sample2 as OpenAttestationVerifiableCredential;

// sample3 & sample4: more than 1 doc wrapped (aka batched VC, where 'proofs' has values)
const sampleBatched1 = batched1 as OpenAttestationVerifiableCredential;
const sampleBatched2 = batched2 as OpenAttestationVerifiableCredential;

describe("signature", () => {
  describe("verify", () => {
    test("returns true for documents with unaltered data (without proofs)", () => {
      // For this test case, proofs does not exist as sampleVerifiableCredential is wrapped on its own (i.e. targetHash == merkleRoot)
      const verifiableCredential = sampleVerifiableCredential;
      const verified = verify(verifiableCredential);
      expect(verified).toBe(true);
    });
    test("returns false for documents with altered value", () => {
      const verifiableCredential = {
        ...cloneDeep(sampleVerifiableCredential),
        recipient: {
          name: "Fake Name"
        }
      };
      const verified = verify(verifiableCredential);
      expect(verified).toBe(false);
    });
    test("returns false for documents with altered key", () => {
      const verifiableCredential = {
        ...cloneDeep(sampleVerifiableCredential),
        recipient: {
          fakename: "Recipient Name"
        }
      };
      const verified = verify(verifiableCredential);
      expect(verified).toBe(false);
    });
    test("returns false for documents with added data", () => {
      const verifiableCredential = {
        ...cloneDeep(sampleVerifiableCredential),
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
              type: "2A",
              effectiveDate: "2020-06-05T00:00:00Z"
            }
          ]
        }
      };
      const verified = verify(verifiableCredential);
      expect(verified).toBe(false);
    });

    test("returns true for documents with unaltered data (with proofs)", () => {
      // Since the proofs key only exist when multiple documents are wrapped, we have to use sampleMultiVC1 or sampleMultiVC2
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

      const verified = verify(verifiableCredential);
      expect(verified).toBe(true);
    });
    test("returns false for documents with altered targetHash", () => {
      const verifiableCredential = {
        ...sampleVerifiableCredential,
        proof: {
          type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
          targetHash: "81859d00caadd33f4100b7d37230684b953195786426a1be2c3bfea32b3c2a53",
          proofs: ["964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5530"],
          merkleRoot: "8505f27ea43ca3720b419ab96b80039eb4b2a1126acc9cb90f2a31349c110137",
          salts:
            "W3sidmFsdWUiOiIyNGU1NjA2NS0xZDIwLTRiODEtOTI3MC05MDZiYWYwNTQ2M2EiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJkNDY3ZjM0OC05ZTgzLTRmOGYtYjliNS01NTQyNzlkODU0ODMiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiNTY5OGFkYmYtMjIwMy00MjNiLThmZjQtNzgyMDAwZTk5YzRmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjQzMzA5MDgyLWZlYWEtNDNlNS1hMDg4LTc4ZWFjMGRlYjMzOCIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiI3ZmFkZjk5YS1jZmYyLTQ4MWItYWI5Yi1jNmVkNTEyMmI3MDQiLCJwYXRoIjoiQGNvbnRleHRbM10ifSx7InZhbHVlIjoiOWRkYjAxYzUtM2JjYi00ZDUwLTgwODktMmNlOTMzZjU2OTg4IiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI4ZjBmMDAwMi1kZDY3LTQzZjktYjFlOC0xZDE3MjNkZGQ2ZjQiLCJwYXRoIjoibmFtZSJ9LHsidmFsdWUiOiIwNzNiMjE0My04Y2NiLTQxZTQtYTA3MC01MjY0YTRiOGY1NDUiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImIzZGZjOGIyLTMxNzYtNDU0Ny1hNTVjLTQxZWE1ZjM3MjA5MiIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiYmViMTI4YTktOTIwZS00MGIxLWE3NTQtYzRiNDIyYzgwOWYwIiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJlYjg5NmQ4MS1kZjYwLTQ0MzgtOTgyZS0wZGE3NDA4ZDk3MTgiLCJwYXRoIjoiaXNzdWVyLm5hbWUifSx7InZhbHVlIjoiMmYxM2ZiYzItOWJiMS00MzQzLTgzYmMtYTAxNWEzNGIzODI4IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiYjRlMTBjOWEtZWNhOS00MzBkLWI3ODQtNWJiZDE4MDczNTE1IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImNkZjFlNDE1LTE5NjUtNDdlMi1iNzU2LTAyYzc3MThjNmNkYSIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImNjMTk4MDZhLTk2YTAtNDRiOC1iYTNkLTBlOTkwNzI2OTQwYiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjMxMTNiZGIyLTAwZmQtNDAzMC1hMTdkLWE3ODJlNGQyNGMzNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiI3ZDMyNTY0MS05NDY3LTQ1NmEtYWQ5Yy02Mjk4NDdiNDU5NmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0udHlwZSJ9LHsidmFsdWUiOiIzZjBiYjcwNi0zZDQwLTQ2ZTQtYTY4OS01ZTI5OGRkZDQ4ZWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIwY2RmZGU2Ny0yNGIyLTRhOGQtYjUyNS05ZDI1MWIyYTIzYzQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0udHlwZSJ9LHsidmFsdWUiOiI4NDdlMjM2MS1jN2ZhLTQ0MDUtOTlhOS0wN2NkMmViZmU5ZmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJlNDg1Yjk3MC1mNzA0LTQ2Y2UtOWE3Ny01ZjI5MjBhOTIwZWYiLCJwYXRoIjoidGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIxY2MzNTM4OC0wNzNlLTRhZTgtOTFiMC1lYTc5NTVjYWUyOTgiLCJwYXRoIjoidGVtcGxhdGUudHlwZSJ9LHsidmFsdWUiOiJmYTA2MjI3MS04NjdkLTRhM2QtYjBhNy03OWE1ZTMyM2NiZDgiLCJwYXRoIjoidGVtcGxhdGUudXJsIn0seyJ2YWx1ZSI6ImU3OTZhYTdlLTFhOWMtNDBmOC04NzUzLTVjMDRhZmQ0OGI5ZCIsInBhdGgiOiJvYVByb29mLnR5cGUifSx7InZhbHVlIjoiZDFhZDc0YWQtNzYwZS00ZmZkLWFmYzEtZmZjNDQyY2UyNjA3IiwicGF0aCI6Im9hUHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImM0YWRjNTUyLWY3ZTMtNGExYi1hNjMyLTQwNjI1NmVkMzYyNCIsInBhdGgiOiJvYVByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjllMzQ2MmM2LWZhN2EtNGRkNi1iZGU5LTE5N2I0NjU5ZDQwNyIsInBhdGgiOiJyZWNpcGllbnQubmFtZSJ9LHsidmFsdWUiOiJjODEwODIyMS1hOTM2LTQ3OGEtYWM3YS02YjA5ZjJlYWZmZTMiLCJwYXRoIjoiZXZpZGVuY2VbMF0udHlwZSJ9LHsidmFsdWUiOiIwNGE3MTg4OC1lNjY0LTQxMDgtYWI4ZC1jZDFjMjI0Nzc5YTEiLCJwYXRoIjoiZXZpZGVuY2VbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiNDg2ZjQzZTgtZDQ1MS00MDBmLTg0ZGItZjA3YmRjMWU0YjA1IiwicGF0aCI6ImV2aWRlbmNlWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6ImMwMzM4MmI3LTk4ZDYtNDRhMC1hYTQxLTcyMTJiMzk4YTY2NCIsInBhdGgiOiJldmlkZW5jZVswXS5kYXRhIn1d",
          privacy: {
            obfuscated: []
          }
        }
      };
      const verified = verify(verifiableCredential);
      expect(verified).toBe(false);
    });
    test("returns false for documents with altered proofs", () => {
      // Since the proofs key only exist when multiple documents are wrapped, we have to use sampleMultiVC1 or sampleMultiVC2
      const verifiableCredential = {
        ...sampleBatched1,
        proof: {
          type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
          targetHash: "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4",
          proofs: ["964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5531"],
          merkleRoot: "8505f27ea43ca3720b419ab96b80039eb4b2a1126acc9cb90f2a31349c110137",
          salts:
            "W3sidmFsdWUiOiIyNGU1NjA2NS0xZDIwLTRiODEtOTI3MC05MDZiYWYwNTQ2M2EiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJkNDY3ZjM0OC05ZTgzLTRmOGYtYjliNS01NTQyNzlkODU0ODMiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiNTY5OGFkYmYtMjIwMy00MjNiLThmZjQtNzgyMDAwZTk5YzRmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjQzMzA5MDgyLWZlYWEtNDNlNS1hMDg4LTc4ZWFjMGRlYjMzOCIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiI3ZmFkZjk5YS1jZmYyLTQ4MWItYWI5Yi1jNmVkNTEyMmI3MDQiLCJwYXRoIjoiQGNvbnRleHRbM10ifSx7InZhbHVlIjoiOWRkYjAxYzUtM2JjYi00ZDUwLTgwODktMmNlOTMzZjU2OTg4IiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI4ZjBmMDAwMi1kZDY3LTQzZjktYjFlOC0xZDE3MjNkZGQ2ZjQiLCJwYXRoIjoibmFtZSJ9LHsidmFsdWUiOiIwNzNiMjE0My04Y2NiLTQxZTQtYTA3MC01MjY0YTRiOGY1NDUiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImIzZGZjOGIyLTMxNzYtNDU0Ny1hNTVjLTQxZWE1ZjM3MjA5MiIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiYmViMTI4YTktOTIwZS00MGIxLWE3NTQtYzRiNDIyYzgwOWYwIiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJlYjg5NmQ4MS1kZjYwLTQ0MzgtOTgyZS0wZGE3NDA4ZDk3MTgiLCJwYXRoIjoiaXNzdWVyLm5hbWUifSx7InZhbHVlIjoiMmYxM2ZiYzItOWJiMS00MzQzLTgzYmMtYTAxNWEzNGIzODI4IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiYjRlMTBjOWEtZWNhOS00MzBkLWI3ODQtNWJiZDE4MDczNTE1IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImNkZjFlNDE1LTE5NjUtNDdlMi1iNzU2LTAyYzc3MThjNmNkYSIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImNjMTk4MDZhLTk2YTAtNDRiOC1iYTNkLTBlOTkwNzI2OTQwYiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjMxMTNiZGIyLTAwZmQtNDAzMC1hMTdkLWE3ODJlNGQyNGMzNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiI3ZDMyNTY0MS05NDY3LTQ1NmEtYWQ5Yy02Mjk4NDdiNDU5NmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0udHlwZSJ9LHsidmFsdWUiOiIzZjBiYjcwNi0zZDQwLTQ2ZTQtYTY4OS01ZTI5OGRkZDQ4ZWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIwY2RmZGU2Ny0yNGIyLTRhOGQtYjUyNS05ZDI1MWIyYTIzYzQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0udHlwZSJ9LHsidmFsdWUiOiI4NDdlMjM2MS1jN2ZhLTQ0MDUtOTlhOS0wN2NkMmViZmU5ZmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJlNDg1Yjk3MC1mNzA0LTQ2Y2UtOWE3Ny01ZjI5MjBhOTIwZWYiLCJwYXRoIjoidGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIxY2MzNTM4OC0wNzNlLTRhZTgtOTFiMC1lYTc5NTVjYWUyOTgiLCJwYXRoIjoidGVtcGxhdGUudHlwZSJ9LHsidmFsdWUiOiJmYTA2MjI3MS04NjdkLTRhM2QtYjBhNy03OWE1ZTMyM2NiZDgiLCJwYXRoIjoidGVtcGxhdGUudXJsIn0seyJ2YWx1ZSI6ImU3OTZhYTdlLTFhOWMtNDBmOC04NzUzLTVjMDRhZmQ0OGI5ZCIsInBhdGgiOiJvYVByb29mLnR5cGUifSx7InZhbHVlIjoiZDFhZDc0YWQtNzYwZS00ZmZkLWFmYzEtZmZjNDQyY2UyNjA3IiwicGF0aCI6Im9hUHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImM0YWRjNTUyLWY3ZTMtNGExYi1hNjMyLTQwNjI1NmVkMzYyNCIsInBhdGgiOiJvYVByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjllMzQ2MmM2LWZhN2EtNGRkNi1iZGU5LTE5N2I0NjU5ZDQwNyIsInBhdGgiOiJyZWNpcGllbnQubmFtZSJ9LHsidmFsdWUiOiJjODEwODIyMS1hOTM2LTQ3OGEtYWM3YS02YjA5ZjJlYWZmZTMiLCJwYXRoIjoiZXZpZGVuY2VbMF0udHlwZSJ9LHsidmFsdWUiOiIwNGE3MTg4OC1lNjY0LTQxMDgtYWI4ZC1jZDFjMjI0Nzc5YTEiLCJwYXRoIjoiZXZpZGVuY2VbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiNDg2ZjQzZTgtZDQ1MS00MDBmLTg0ZGItZjA3YmRjMWU0YjA1IiwicGF0aCI6ImV2aWRlbmNlWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6ImMwMzM4MmI3LTk4ZDYtNDRhMC1hYTQxLTcyMTJiMzk4YTY2NCIsInBhdGgiOiJldmlkZW5jZVswXS5kYXRhIn1d",
          privacy: {
            obfuscated: []
          }
        }
      };

      const verified = verify(verifiableCredential);
      expect(verified).toBe(false);
    });
    test("returns false for documents with altered merkleRoot", () => {
      const verifiableCredential = {
        ...sampleBatched1,
        proof: {
          type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
          targetHash: "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4",
          proofs: ["964b066a78bfec3701760893090fa41bd0c86fb1328f2ba07293252a1a7d5530"],
          merkleRoot: "76eee8fc36924975c00420e463aab1a2e6b24fb8cfb81e8c789b2534da4b59a4",
          salts:
            "W3sidmFsdWUiOiIyNGU1NjA2NS0xZDIwLTRiODEtOTI3MC05MDZiYWYwNTQ2M2EiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJkNDY3ZjM0OC05ZTgzLTRmOGYtYjliNS01NTQyNzlkODU0ODMiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiNTY5OGFkYmYtMjIwMy00MjNiLThmZjQtNzgyMDAwZTk5YzRmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6IjQzMzA5MDgyLWZlYWEtNDNlNS1hMDg4LTc4ZWFjMGRlYjMzOCIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiI3ZmFkZjk5YS1jZmYyLTQ4MWItYWI5Yi1jNmVkNTEyMmI3MDQiLCJwYXRoIjoiQGNvbnRleHRbM10ifSx7InZhbHVlIjoiOWRkYjAxYzUtM2JjYi00ZDUwLTgwODktMmNlOTMzZjU2OTg4IiwicGF0aCI6InJlZmVyZW5jZSJ9LHsidmFsdWUiOiI4ZjBmMDAwMi1kZDY3LTQzZjktYjFlOC0xZDE3MjNkZGQ2ZjQiLCJwYXRoIjoibmFtZSJ9LHsidmFsdWUiOiIwNzNiMjE0My04Y2NiLTQxZTQtYTA3MC01MjY0YTRiOGY1NDUiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImIzZGZjOGIyLTMxNzYtNDU0Ny1hNTVjLTQxZWE1ZjM3MjA5MiIsInBhdGgiOiJ2YWxpZEZyb20ifSx7InZhbHVlIjoiYmViMTI4YTktOTIwZS00MGIxLWE3NTQtYzRiNDIyYzgwOWYwIiwicGF0aCI6Imlzc3Vlci5pZCJ9LHsidmFsdWUiOiJlYjg5NmQ4MS1kZjYwLTQ0MzgtOTgyZS0wZGE3NDA4ZDk3MTgiLCJwYXRoIjoiaXNzdWVyLm5hbWUifSx7InZhbHVlIjoiMmYxM2ZiYzItOWJiMS00MzQzLTgzYmMtYTAxNWEzNGIzODI4IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLnR5cGUifSx7InZhbHVlIjoiYjRlMTBjOWEtZWNhOS00MzBkLWI3ODQtNWJiZDE4MDczNTE1IiwicGF0aCI6Imlzc3Vlci5pZGVudGl0eVByb29mLmxvY2F0aW9uIn0seyJ2YWx1ZSI6ImNkZjFlNDE1LTE5NjUtNDdlMi1iNzU2LTAyYzc3MThjNmNkYSIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImNjMTk4MDZhLTk2YTAtNDRiOC1iYTNkLTBlOTkwNzI2OTQwYiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6IjMxMTNiZGIyLTAwZmQtNDAzMC1hMTdkLWE3ODJlNGQyNGMzNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiI3ZDMyNTY0MS05NDY3LTQ1NmEtYWQ5Yy02Mjk4NDdiNDU5NmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0udHlwZSJ9LHsidmFsdWUiOiIzZjBiYjcwNi0zZDQwLTQ2ZTQtYTY4OS01ZTI5OGRkZDQ4ZWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIwY2RmZGU2Ny0yNGIyLTRhOGQtYjUyNS05ZDI1MWIyYTIzYzQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0udHlwZSJ9LHsidmFsdWUiOiI4NDdlMjM2MS1jN2ZhLTQ0MDUtOTlhOS0wN2NkMmViZmU5ZmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuY2xhc3NbMV0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJlNDg1Yjk3MC1mNzA0LTQ2Y2UtOWE3Ny01ZjI5MjBhOTIwZWYiLCJwYXRoIjoidGVtcGxhdGUubmFtZSJ9LHsidmFsdWUiOiIxY2MzNTM4OC0wNzNlLTRhZTgtOTFiMC1lYTc5NTVjYWUyOTgiLCJwYXRoIjoidGVtcGxhdGUudHlwZSJ9LHsidmFsdWUiOiJmYTA2MjI3MS04NjdkLTRhM2QtYjBhNy03OWE1ZTMyM2NiZDgiLCJwYXRoIjoidGVtcGxhdGUudXJsIn0seyJ2YWx1ZSI6ImU3OTZhYTdlLTFhOWMtNDBmOC04NzUzLTVjMDRhZmQ0OGI5ZCIsInBhdGgiOiJvYVByb29mLnR5cGUifSx7InZhbHVlIjoiZDFhZDc0YWQtNzYwZS00ZmZkLWFmYzEtZmZjNDQyY2UyNjA3IiwicGF0aCI6Im9hUHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6ImM0YWRjNTUyLWY3ZTMtNGExYi1hNjMyLTQwNjI1NmVkMzYyNCIsInBhdGgiOiJvYVByb29mLnZhbHVlIn0seyJ2YWx1ZSI6IjllMzQ2MmM2LWZhN2EtNGRkNi1iZGU5LTE5N2I0NjU5ZDQwNyIsInBhdGgiOiJyZWNpcGllbnQubmFtZSJ9LHsidmFsdWUiOiJjODEwODIyMS1hOTM2LTQ3OGEtYWM3YS02YjA5ZjJlYWZmZTMiLCJwYXRoIjoiZXZpZGVuY2VbMF0udHlwZSJ9LHsidmFsdWUiOiIwNGE3MTg4OC1lNjY0LTQxMDgtYWI4ZC1jZDFjMjI0Nzc5YTEiLCJwYXRoIjoiZXZpZGVuY2VbMF0uZmlsZU5hbWUifSx7InZhbHVlIjoiNDg2ZjQzZTgtZDQ1MS00MDBmLTg0ZGItZjA3YmRjMWU0YjA1IiwicGF0aCI6ImV2aWRlbmNlWzBdLm1pbWVUeXBlIn0seyJ2YWx1ZSI6ImMwMzM4MmI3LTk4ZDYtNDRhMC1hYTQxLTcyMTJiMzk4YTY2NCIsInBhdGgiOiJldmlkZW5jZVswXS5kYXRhIn1d",
          privacy: {
            obfuscated: []
          }
        }
      };

      const verified = verify(verifiableCredential);
      expect(verified).toBe(false);
    });

    // describe("sign", () => {
    //   test("throws when the document is not in the batch", () => {
    //     const emptySign = () => wrap(rawDocument, []);
    //     expect(emptySign).toThrow("Document is not in batch");
    //   });

    //   test("signs correctly for single document", () => {
    //     const expectedverifiableCredential = {
    //       ...rawDocument,
    //       signature: {
    //         type: "SHA3MerkleProof",
    //         targetHash: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
    //         proof: [],
    //         merkleRoot: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c"
    //       }
    //     };

    //     const verifiableCredential = wrap(rawDocument);
    //     expect(verifiableCredential).toEqual(expectedverifiableCredential);
    //   });

    //   test("signs correctly for document in a batch", () => {
    //     const batch = [
    //       "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
    //       "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
    //       "7ba10b40626cd6e57c9f9b6264996932259ad79053e8d1225b0336ed06e83bf0",
    //       "d7e0f88baaa5b389a7e031c0939522e1bd3e30146a47141a1192918c6e53926c"
    //     ];
    //     const expectedverifiableCredential = {
    //       ...rawDocument,
    //       signature: {
    //         type: "SHA3MerkleProof",
    //         targetHash: "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
    //         proof: [
    //           "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
    //           "b1fee809d2803cbf7f63070eee763709eadca9abcaeab349b4c85a10bc48bc49"
    //         ],
    //         merkleRoot: "c16a56c5f0bf0e985f731816635fa772ca921a68848090a49cbe10c7a55d521b"
    //       }
    //     };

    //     const verifiableCredential = wrap(rawDocument, batch);
    //     expect(verifiableCredential).toEqual(expectedverifiableCredential);
    //   });

    //   test("signs correctly regardless of batch ordering", () => {
    //     const batch1 = [
    //       "7ba10b40626cd6e57c9f9b6264996932259ad79053e8d1225b0336ed06e83bf0",
    //       "d7e0f88baaa5b389a7e031c0939522e1bd3e30146a47141a1192918c6e53926c",
    //       "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
    //       "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799"
    //     ];
    //     const batch2 = [
    //       "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c",
    //       "46c732825d2111a7019929d7f21988081f88084bb05fd54ab4c1843b53cbe799",
    //       "7ba10b40626cd6e57c9f9b6264996932259ad79053e8d1225b0336ed06e83bf0",
    //       "d7e0f88baaa5b389a7e031c0939522e1bd3e30146a47141a1192918c6e53926c"
    //     ];

    //     expect(wrap(rawDocument, batch1)).toEqual(wrap(rawDocument, batch2));
    //   });
  });
});
