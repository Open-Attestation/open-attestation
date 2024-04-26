import { W3cVerifiableCredential, V4Document, V4WrappedDocument, V4SignedWrappedDocument } from "../types";

const RAW_DOCUMENT: V4Document = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  validFrom: "2021-03-08T12:00:00+08:00",
  name: "Republic of Singapore Driving Licence",
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
  },
  renderMethod: [
    {
      id: "https://demo-renderer.opencerts.io",
      type: "OpenAttestationEmbeddedRenderer",
      templateName: "GOVTECH_DEMO",
    },
  ],
  credentialSubject: {
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    type: ["DriversLicense"],
    name: "John Doe",
    licenses: [
      {
        class: "3",
        description: "Motor cars with unladen weight <= 3000kg",
        effectiveDate: "2013-05-16T00:00:00+08:00",
      },
      {
        class: "3A",
        description: "Motor cars with unladen weight <= 3000kg",
        effectiveDate: "2013-05-16T00:00:00+08:00",
      },
    ],
  },
};

const SIGNED_WRAPPED: V4SignedWrappedDocument = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  validFrom: "2021-03-08T12:00:00+08:00",
  name: "Republic of Singapore Driving Licence",
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
  },
  renderMethod: [
    {
      id: "https://demo-renderer.opencerts.io",
      type: "OpenAttestationEmbeddedRenderer",
      templateName: "GOVTECH_DEMO",
    },
  ],
  credentialSubject: {
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    type: ["DriversLicense"],
    name: "John Doe",
    licenses: [
      {
        class: "3",
        description: "Motor cars with unladen weight <= 3000kg",
        effectiveDate: "2013-05-16T00:00:00+08:00",
      },
      {
        class: "3A",
        description: "Motor cars with unladen weight <= 3000kg",
        effectiveDate: "2013-05-16T00:00:00+08:00",
      },
    ],
  },
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "f49be3b06f7a7eb074775ad12aae43936084c86646e3640eae18e7aeca4f7468",
    proofs: [],
    merkleRoot: "f49be3b06f7a7eb074775ad12aae43936084c86646e3640eae18e7aeca4f7468",
    salts:
      "W3sidmFsdWUiOiJiMzAzYWIyNmEyNjI1MGQ2YWNkMmI1Yzk0NmY3NDdhMTdkOTRlZTZmZjVhNDE2Mjk5OTQ4MDA0Y2EwNWE3MTBiIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjBiNGRmOGVhZDkwMzMwNjMyYjhkNWNkYWVjOGRkZTI0NzQ0NjFkMTE2NzgwNzU4OTRiMmUwY2JmZDQ1M2ZlNTUiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiZGE2NDE1MGViNzViYzY2NzdkYTkxYTFhMTk3YWUzMmYwMDBlN2M3OTEyN2Q2M2EzMWRiMzg5MWQ3YjQxNTYwOCIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6Ijc4MDhkZTQyZjdkMWZkNzE4ZDFhMmRhMDUzZDA4ZmQ2Y2JjOTliZDU3YzhmZTQyN2MxNzllZWQ1YmRlY2IyMTQiLCJwYXRoIjoidHlwZVsxXSJ9LHsidmFsdWUiOiI2ZDM1ODU2ZTRkMjg1MjllZmIyZjE2ZmRjMDFlMWE5MjQ5NDlhYzE5NzkwYjAxNmJkM2EyOGUxNjg0Mjc4NzNlIiwicGF0aCI6InZhbGlkRnJvbSJ9LHsidmFsdWUiOiI2NTQ5ZTkzOGU3MjgxMTM3NzZkOTViNTdhOTg1ZTY0MmFmYmNhZWMzOTg3ODhlZGIzNmZiZDMwZDY4ODMxZWRhIiwicGF0aCI6Im5hbWUifSx7InZhbHVlIjoiZDVhOTMxMTk5ZjVmZjBiM2MxZjQ3NjhlODNiNWNiODVmYmM0Y2Q4MDY2YmM3OTlkZTVlYWFmODViOWNhNjM4ZCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMTM3YmU4NzU2ZmU4YWUxMGI4ODI1ODQ5N2QyZjBkYmZlZDcwN2U5YTZlMzE1NDJiYjBiZGE3YjFhOTNhNmJmZCIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiI4NGUyOGZhMWM0MTQyYjg5M2ZiMTNkZjJjYTQyMTkxOGQwODEzNzNlYjc2ZTdiOWU5YTUwMzBmYzJhODBhNWZjIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjdmYTQ0MDRlZTdhNTJjNGI3YWM3N2U1ODIwMDc2OTQ2YTU3MzNmMGJlNjIzOWJiZDUwNWZhYTY5MzVjNjkwMzUiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYzcxMGRjZDdjMjNmODhhYWY2ZDJjM2Q0ZDgxYzg3NzkzODcxYjI1NjI4MjJjN2YwNjliZmM4ZTA2ODdjNzRhYSIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImI0NWU5ZjA5Mzg0NTVjMWY1YjhiMzJmN2E1MWZhMDkzOWYyYjg1ZmM4YWFkZDQzMzU2NjdlNzFjYzY2OGMwYmMiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6IjcyNDE3MDVlNTY5YjdmNjVlMmM1ZWZlMmYzZjIwYWVmMDdlMTdhZTIzNzI5NWRkYzJhYWM1MDAxZjI0YjAzNDkiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiYTcyZDdlMmY3NTE4ZGZkYWY1N2JmMzI1Njg0YTNjY2Y3YmI2MDFkNjI0NGE0YzZmNDVhMzJmOTY5NjBiOGI1YiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn0seyJ2YWx1ZSI6IjNhODI4MTc3MDQxZDI5MDk4NjkzNjhhZjQ3OGE2ZjJkYjU2MWIyYWQyZTY1YmYyNzlkNjE2MzAyNjc1MWJhMTciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiODgyMWY4YzI3OTlkMDVjMmFmODBlZGZmYTc5ODQxMTFiZWM4Y2Y2ZTU1YWZiOWIxMWY3ZGE0YjU4NDE1MmRiYyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjBhMjUxOGExNzExMmE3YmY5OTY0M2FiYjc0YWI1ZTllZGViYmEzYzdlMGYzZDM5M2M5MGJjMGZiNDUzOWRmZmYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiIzMmZiN2JjM2NiZjFjMmZmYjcxYjQ2N2EzNWYyNTFmNGFiNzZkODA0MWUxYTNlMmQ4NzgwODc1NDBhZTQxYzIzIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImZhNTRjNzRkMTYzNzMwZTNlOWRmNzYyMGRhMTllYjcxNjNjNGQyMDNiMDZhYTU0NzZmNzBmMzRiMDMzN2Y4MTIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiNmUxMWE0MjkyMjEyNDdmNTJiOTU0ZjYxYzc2MTI3ZGYzZWYzY2E4NTA0ZmZlNGUyZDk1NWFjOWNmMjBmNDU3NiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImU3M2I3ZTNiM2E3OTA4MmQyNWU0OTA5YjU4MzdkZGFjNzRmZDA4ZjVlNjljOTcxZDJlYmViZGY5OWEyN2Q1MmYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiZjk1MzcxNWJjMzNlMTAzNzBjNGQ5MWUwMTZmN2M4MThjZWRjMGI1ZGRkMmZiODhmNGNiNGIzZTlhMzMwN2ZiMyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiJjM2NkZWNiZjNkOTgzZmUxNDRhNmI5NTJkZTY4ZmExYjUwZjUxOTQwZDgzMjY3MjQ5MTg1YWNmNTFiNmI2MDQ5IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifV0=",
    privacy: { obfuscated: [] },
    key: "did:ethr:0xe93502ce1A52C1c0e99A2eB6666263EA53dB0a5e#controller",
    signature:
      "0x170fbb2d5916a7b3a4863feb8b705f5560c0b42311b164b2da32e682a8633b6f2c332f963db8267ab9a1c3be16ba1091388ed70e6e2a4ec240f5c0865557c6aa1c",
  },
};

describe("v4 guard", () => {
  describe("given a raw document", () => {
    test("should pass w3c vc validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = RAW_DOCUMENT;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(RAW_DOCUMENT);
    });

    test("should pass document validation without removal of any data", () => {
      const results = V4Document.parse(RAW_DOCUMENT);
      expect(results).toEqual(RAW_DOCUMENT);
    });

    test("should fail wrapped document validation", () => {
      const results = V4WrappedDocument.safeParse(RAW_DOCUMENT);
      expect(results.success).toBe(false);
      expect((results as { error: unknown }).error).toMatchInlineSnapshot(`
          [ZodError: [
            {
              "code": "invalid_type",
              "expected": "object",
              "received": "undefined",
              "path": [
                "proof"
              ],
              "message": "Required"
            }
          ]]
        `);
    });

    test("should fail signed wrapped document validation", () => {
      const results = V4SignedWrappedDocument.safeParse(RAW_DOCUMENT);
      expect(results.success).toBe(false);
      expect((results as { error: unknown }).error).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_type",
            "expected": "object",
            "received": "undefined",
            "path": [
              "proof"
            ],
            "message": "Required"
          }
        ]]
      `);
    });
  });

  describe("given a signed wrapped document", () => {
    test("should pass w3c vc validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = SIGNED_WRAPPED;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(SIGNED_WRAPPED);
    });

    test("should pass document validation without removal of any data", () => {
      const v4Document: V4Document = SIGNED_WRAPPED;
      const results = V4Document.parse(v4Document);
      expect(results).toEqual(SIGNED_WRAPPED);
    });

    test("should pass wrapped document validation without removal of any data", () => {
      const v4WrappedDocument: V4WrappedDocument = SIGNED_WRAPPED;
      const results = V4WrappedDocument.parse(v4WrappedDocument);
      expect(results).toEqual(SIGNED_WRAPPED);
    });

    test("should pass signed wrapped document validation without removal of any data", () => {
      const results = V4SignedWrappedDocument.parse(SIGNED_WRAPPED);
      expect(results).toEqual(SIGNED_WRAPPED);
    });
  });
});
