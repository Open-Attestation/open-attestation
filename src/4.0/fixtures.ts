import { V4Document, V4SignedWrappedDocument, V4WrappedDocument } from "./types";

const SAMPLE_SIGNING_KEYS = {
  issuerId: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
  public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
  private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
} as const;

export const RAW_DOCUMENT_DID = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  validFrom: "2021-03-08T12:00:00+08:00",
  name: "Republic of Singapore Driving Licence",
  issuer: {
    id: `did:ethr:${SAMPLE_SIGNING_KEYS.issuerId}`,
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
} satisfies V4Document);

export const RAW_DOCUMENT_DID_OSCP = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  validFrom: "2021-03-08T12:00:00+08:00",
  name: "Republic of Singapore Driving Licence",
  issuer: {
    id: `did:ethr:${SAMPLE_SIGNING_KEYS.issuerId}`,
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
  },
  credentialStatus: {
    id: "https://ocsp-sandbox.openattestation.com",
    type: "OpenAttestationOcspResponder",
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
} satisfies V4Document);

export const BATCHED_RAW_DOCUMENTS_DID = freezeObject([
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: `did:ethr:${SAMPLE_SIGNING_KEYS.issuerId}`,
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: {
        identityProofType: "DNS-DID",
        identifier: "example.openattestation.com",
      },
    },
    validFrom: "2021-03-08T12:00:00+08:00",
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
    renderMethod: [
      {
        id: "https://demo-renderer.opencerts.io",
        type: "OpenAttestationEmbeddedRenderer",
        templateName: "GOVTECH_DEMO",
      },
    ],
  },
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: `did:ethr:${SAMPLE_SIGNING_KEYS.issuerId}`,
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: {
        identityProofType: "DNS-DID",
        identifier: "example.openattestation.com",
      },
    },
    validFrom: "2021-03-08T12:00:00+08:00",
    credentialSubject: {
      id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
      type: ["DriversLicense"],
      name: "Jane Doe",
      licenses: [
        {
          class: "3000A",
          description: "Motor spaceships with unladen weight <= 3000tonnes",
          effectiveDate: "2013-05-16T00:00:00+08:00",
        },
      ],
    },
    renderMethod: [
      {
        id: "https://demo-renderer.opencerts.io",
        type: "OpenAttestationEmbeddedRenderer",
        templateName: "GOVTECH_DEMO",
      },
    ],
  },
] satisfies V4Document[]);

export const WRAPPED_DOCUMENT_DID = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: {
      identityProofType: "DNS-DID",
      identifier: "example.openattestation.com",
    },
  },
  validFrom: "2021-03-08T12:00:00+08:00",
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
  renderMethod: [
    {
      id: "https://demo-renderer.opencerts.io",
      type: "OpenAttestationEmbeddedRenderer",
      templateName: "GOVTECH_DEMO",
    },
  ],
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "4b178a75faf7d7ecff1341ee1e0907810df23c88a217b814eb12c2a4454631ec",
    proofs: [],
    merkleRoot: "4b178a75faf7d7ecff1341ee1e0907810df23c88a217b814eb12c2a4454631ec",
    salts:
      "W3sidmFsdWUiOiIyMzkyMzE4OGQ0MzIwYzlkMGEyZGY0MjU2ZTQ2ZTkzZTgzM2FlMWQ4YTU5YzFlYmQ5MTBkOTUxNDc1MjNiMjhmIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjZjMGEzZTZmZDI0NTEyZjg5MWE4ZDY0N2RlZGU1NmIwYjBlMTNkZDcxOTVmMDRiM2EwMzY2ZDZmNDk5OWFkMTAiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiMWFhNDY3NmQwY2FjZGU1ZTljY2MyZmNiYzc1OWRjZTJlNWFhOGY5YTg1ODI5NzFlNjNlM2MzZmVjMzE2OWNiOSIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6IjZmYjU2MDJkYjg1MjY1M2Y2NDg0M2I0ODcyNTNmNGU3ZWI2NzlmZDY3Mjg4NjNmMWRkNjcyY2U1ZWEzMDAzM2YiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJkMmZiMGQ4YzBlMzFkNmIwZDgxODQ1NGYyZDgxNGZkOTg3ODFjNjk4ZDA0OTg3MGJmOTAwNzA2M2Y4ZDAyNjNlIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiNzBjNDk0MzM5ZDQxZjZkOTBmY2ViNzg5ODk2ZjExMTVjMDI1NWY2Njg4Yzg1MGQxNmUxMGRiNzhhZmJjOWYyMSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMDkyYThhMTc0NjYwNjA0YTdmZWNiOTgyNGVhNmMwYTk3ZjMyODM2MzE0MmVjMTg3NWUzZTBjZTFhNzFjZTc1ZSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJmZTM5YTA3ZDYwNDVmZDdlMWQxMjRlOTc1ZmQxNjYxZTQ5NzNlM2Q0NDdkMjBiOTdmZmE0YWRkMDA0YzcyZjhhIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjljY2ZlNzNkMjllZDhmYTU2MWRiMTE5NjZhN2RiZWNhY2JhYTNlOWNmNDI5OTg4Y2VjMzNmNTRkOTQ0NTdhYzIiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiMDNhNWMwMDYyMzFlNWQ1MjJhNmYzOGFkNDE3YjEzYmQyYzgwMjVhZjY5ZGVhYTA0MzkwMjkwNjljNjEzMjE3ZCIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjNjNzhjMzdlMDA2ZjZlMTkyY2ZhZmZjYzM0NzZhODk0MmMxODNiY2JkN2NlMjJlYjhkZWNmNGQ0YTI5OGJmZmIiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjNiMDI3MjkwOThmMTQxY2I3Y2E5OGM2ZmIxODMyZjVhYmMyN2JmZDA5NTlkNzk5ZjUzNDRkYzVjZWY2YmMyMTQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMzQyYmMwYWM0MjU3MmExY2U1N2YxMjcwZGRhNTlmMDFlMzZiMTM5NzhlOTdhODgzMzMxMGVjZGMyYTgzOGUyNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjlmZGIwN2YwNGNiOTllZWViZTVjODFiZmRkZmIwMDRiNWVlMTVmZTBhMGE4ZDIyNjYzZmMxZGRkMzk5NmI3MjgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJlMTY0NTBiODVmNjJlY2JkMTgyODg4ZDQ0YjIzZGQ1YTVkZTdiNjBiN2UzZWI5YzQ1NDRmZjYzM2E4MzBlNTkxIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImY1OTc2ZWJlMTE5MjY5ZjZhZjhlZjIzMGI0ZjgwNDgyMzA5ZmFhNWRjOWI3ZjMwYjc3NTZmNDAxNDI4ZjJlZTQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiNmNlZGZiODkxMzcxMjc3NjA2NmU2MmQyMTU5MWNjYzQ0Y2I5MzlmY2U4MDRlYjZjYTUxZWI2ZTIxYTRmNzc1MCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjFjZmMzMDRmNzNkZTFlNTFhYzFmMDczZGI1YjUwYjEzNGMyNjhjYzRjZjIxNDIwZmVhMmY0NjM1YmMzZTllMzEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiZmExZDEwNjBkNTc5NTU1YWRkY2IwZDU4ZGI4MjNkMDMzOWNkNThiMGUzOTdhNzJjZWI2NDgzZTY3NjNjMjgxYiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI1OTA1MDg3YmU5NWE0YWIzMjY0NGQyZDYzYzE0YjE4OGU0ZTcxODYwN2M1YjYxOWRmNzQyNjIxZTY3N2Q2ZWFkIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiMzRhZTM3YmEzNjY3M2Q3MzM0ODhhNzlkMzZkZDI0NDBkNzZiMzBhMGUyMGNkMzU0YjYyOTU4ZTljZTU2NTA4NyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiMWM2NTM2YmI0MDU1ODMyMTMwN2Y2NzE1MTc4MjA3NzU2YTBlNzBiNTE1NzAxM2Q5MWIwN2MxMWVlODdjNzYyYiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiIyY2E4NjJjMDdjYzkwZTczYjA3ZmQxMmU0YjM2ODhjNDRkZDc5OTI3ZTAzOWQ0NWU5Njc0YzM0ZmYyMmMwYTUxIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
    privacy: {
      obfuscated: [],
    },
  },
} satisfies V4WrappedDocument);

export const WRAPPED_DOCUMENT_DID_OSCP = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: {
      identityProofType: "DNS-DID",
      identifier: "example.openattestation.com",
    },
  },
  validFrom: "2021-03-08T12:00:00+08:00",
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
  credentialStatus: {
    id: "https://ocsp-sandbox.openattestation.com",
    type: "OpenAttestationOcspResponder",
  },
  renderMethod: [
    {
      id: "https://demo-renderer.opencerts.io",
      type: "OpenAttestationEmbeddedRenderer",
      templateName: "GOVTECH_DEMO",
    },
  ],
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "db256b67a181b7c5a1b312b64901a0c332d72a5f2f631473ba2c28a725c3ab21",
    proofs: [],
    merkleRoot: "db256b67a181b7c5a1b312b64901a0c332d72a5f2f631473ba2c28a725c3ab21",
    salts:
      "W3sidmFsdWUiOiI2ZTJhN2E4MjM1NzMzOTM2MGJkYzE0OTYzMTUwNzAyNTg2N2QyOWYxM2YxYjMwZmFmMDQ4Y2VmM2QyMzc2YWM2IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImRkZGI5MDVmNmIzZWQ0OGVlMzkwZDljYjQ4MTdkMjk4OWMyY2VmMzQyM2UxNGE4YjQzMDMzYmFhNDM0NmY2ZGUiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiMWNiZjBjYjY2ODZkNWIyMzJkM2QwZDZiNTk1MTA0NDc0OGY4NmNlMjJkZDE1OGIxNzUwZTc2YWUyYzAzZDkwNyIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImJlZjJmZjNhM2MxNDEzMDYxMDVkNGMzMTJlZmZkN2M2OTUxN2U3ZjM5YTBjYTQ3ZTZkZTk4Y2M1ZTFkMzllY2UiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiI1N2M5YWIzYzRlM2RiNjE5Nzc0NjZhNjQ4ZmM5ZThjNjI2NzQ1ZDE4NmIyYWRlZDIxNDhiNDQwYWU0MWRmYjhiIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiZmYwNDE0MjcxYWYwNzk5ZWM4YzgwMTQzMzI2NmVmNGE5YzAwNzQxMDVlNTNmMmQ3OWYwYjYzYjBjNjk1Y2Q2MCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiOTEyNjc2YWZjZTkyYjBhNGU4MzhkNzZjZDYyZmNmMGY0YTc1NmE1MTI0NWI0YWU4YTQxN2ZkNzYxNmVhMDVkMSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJmNDYzYmNkYWIzYTcwNGYzMWRhOWQ5MjUwNTM3OTE1MDBiYTdjMDQzZTNiZDEzNzU3ZTgyNTI5MzYzZGNhNjc0IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6Ijc2YWIzZWQwODk2NzZkOGJmM2FhZjE3OGQyYTUzYzI3NGZjMGUyMmFiMjJkNjU3NmIxYTUzYTAxMjMxNjUxYjAiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiNjMyYzI5MzdhZGYwMGIwYWU0NGRlYzZkNGI1NmJmN2RkYTU3ZDEzYjk3MWUxNzhlZjJiZTdmNDMwNDJlMTI4YiIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjkxOGNiYjU1MDg4ZGFjNDEzMzYxODEwZDE0ZTBlM2U4Mzk4N2Y2N2NjZDU1YTE5OGQ2YzZhOWEzYWM4Y2VkMDQiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImI5NmVkN2FjZDZjZjQwNmViZGMxZmJlY2VhY2M1ZWYxZDhkODlmZDNhZTZmZTRjMzkyMTM3M2NhY2YxYTc5NDAiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiOTVmNDFmYWZiYjNhZmY4NmM4ODU0ZTRjOWQ4MTAzY2E3NGM0NTBiODg3ZmQwOGMwNDFiYzI4NzlmN2RiMDAzYyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjU2ZmU1YjZmZDYwNjE0OWZmYzhhZGZkNjY2ZDgxNGJiYzZjNWMzZjU0YjA2ZmQ4YjJjZTFmNDc2M2RkNWMwNmMiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJmNWZhM2MyMDhiODRiNDdkZDczYTIwYmM5YjczYWY1MTI3MzIwZGUxNTIwNGExMjA0NjgzZDI0NGUwNzhkYmU5IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjkzODcxZTQ2MmEzZjIyNDE1YzU2ODhhOGQ3NGYyZjFlZjMwZTEwYWNlOWZiMmIyNTllOWVjMmVlZWVjMWI2NGQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiN2FmNWFjNzViYjNkZWYyNTQwOTViNWE4ZDFiNGFkZmJiZmQ3YTM3MTY4N2UzZGY2OTJmYjhlMmM2YTMyZjZiNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjAwZDA2MTlhNzQ0ZWUxODIwMzQ5NzZhZmRjZmU2ZjE5ZDE1NWZkMjgwZDQzYjM0ZjhjNDM4OGJiMDQwOTBkOTQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiOTUyNTdkMjJmMGMyYzRkNTY3MjkzMWM0OGY1OTBjY2RmMGU4NzNmY2ZmMTdjZDA2NmRmNjBjNzMxMzgxZGMwNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI3ZTZlODE5MmM1OWVhMDllOGUxZDM3NTI4NGEzN2JhMTFkNmFlNTVmNmFiNGIwMjRhMGU4YjM0M2MwZTlhMWI4IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiMTRmN2U1ZWU4Zjk0ZTAyZDFiODcxYjE4YzRmZjAwOTA0ZDc4OGNhMjU4NDhlYjVlOTMwOTZmNTFhMzI0NGIwYiIsInBhdGgiOiJjcmVkZW50aWFsU3RhdHVzLmlkIn0seyJ2YWx1ZSI6IjFjNzRmODhjODNhOWZhYWQ5YjU1MjE4NjcwZDg5NzM0NTY0MjY2OTg5MzdlYTQyNmFkZmY4ZmVmOTYzMWVkNzMiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy50eXBlIn0seyJ2YWx1ZSI6IjA0N2I1YzA0NDAzMjlmM2ZkODZmMDQxODRmMTk1OGZlZDQyNDhiMDI2YmM2NGI5NDM5MmNiMGRjYmU5M2VlYWYiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6IjQyZGM4Y2EzZGJiMjI2NGI4ODg0OWIyNWFkZWQ0ZWE2NWQ2ZmMzYTZlNWUyNjExMGE1MDUwNmRjYzdhYzhmNzciLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiODg2MjJkNDRjMTBiY2VlMzUxMGRiNmE4ZjNhMGYxM2M1ODBmNmZlNWY3OGNkODVmM2FjYTIzMGE2M2QyYTZjMyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
    privacy: {
      obfuscated: [],
    },
  },
} satisfies V4WrappedDocument);

export const BATCHED_WRAPPED_DOCUMENTS_DID = freezeObject([
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: "did:ethr:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: {
        identityProofType: "DNS-DID",
        identifier: "example.openattestation.com",
      },
    },
    validFrom: "2021-03-08T12:00:00+08:00",
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
    renderMethod: [
      {
        id: "https://demo-renderer.opencerts.io",
        type: "OpenAttestationEmbeddedRenderer",
        templateName: "GOVTECH_DEMO",
      },
    ],
    proof: {
      type: "OpenAttestationMerkleProofSignature2018",
      proofPurpose: "assertionMethod",
      targetHash: "08969c7baf46807ee65e495b2a93c0e27dfdc77085562ce9ab1249a7fb261681",
      proofs: ["ce284d21e98ac301c0e963ea6d020570091e05591dc2b787a698512e82b39001"],
      merkleRoot: "6fa0bdfa20b114c3e9e92fb511be62f416533a35df99a440ecc28ff4a3f601d2",
      salts:
        "W3sidmFsdWUiOiIwMzgyZWU0MjFlNTgyMzJlMGJjNTI0MDY1NjhhZTdiNWZhNDhlOWRjYzczZmVkM2VhOTZkOTAzNGQ4ZWZkNDlhIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImViMmI1ZmIwODhlZDk5YzY0NzJmYmQ4MjMyNjVhYjlkMzZhNmQ0MDFiMGEyNmM5N2Q3Zjc0MDkwYWJiYTE4OGEiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiYWNmNGFhMGJmZDEyMTRmZGEwZDAzNzczNmNhMDFiMzhkOTBlZDA4MzQ5ODUwMWY5NDlmOTgyNjg1NmE2MTM3OSIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6IjM5Yzc1MjFmNDdlNTJlNWZlOGI2NmEyYjhjZmEzYTQwNDM1ZjQ2Y2NiOWY3MGQxYWY4MThkNmNkNzk1MzQ4MzQiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJiNWY3MmI3N2M1NjU3YjZiOTMyN2QyMGYwZTUwYzQxMGVmNzRlNDMzYTM0NTRlOTRmMTEzOTZmMTIwYzJjMjc5IiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiOTU1MjExMzNmNzgzZjI5NzlkODgyMzI4MDlmMDgxNmUzNDVmMjE4MTk0ZTJkMTgwYzZmYTcwMTBhNDI4ODFkYyIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMTQwZmVlNjI5Y2M2MjY3Njk1NzA4YzY2ZTg2OGI0ZjVhZTBiMDg1YjYzNDczM2I1YWE1N2M4ZTQxM2I1NTliNiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJiMjFmZTkyMDNlNWYxNzFjMjE1NDIyY2Y2ZTZkOWEzNzFkMmIyZGJkMjU5ZDE0Y2JmMDZiYTllZjQ4NzEzYzk3IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6ImE5Mjg0OTFiMzYyNzcyMjUxNzM0ZDEwNGQwOGJiMTgzMjczM2JlYzZiYjdmYWI0YTE4ZTdiNGRlY2QzMjE0YmMiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiNWViMmMyNTU2ODgyZjgzZjM0MTQ5MTczMGM0OWI4NTE4OTljMTA3NzY2Yzk5YWQwYzhhMGRkZTQxNDkzZjYxYyIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjVlMTgyNThiODdjMjJiMGIzY2Y4OWVhMjZhOTI5N2ZkYjVmYjI0NTA2Mzg0MzNlYzcxN2YyYTBmMzE0NTJlMmYiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImIyYWU3ODllZmVjZmE4ZmEzMmZmNTdlYTNjYTJmZjJjZmVmOThmOThmZGVhY2U4M2Q0NGEwNTVjZGU4MDE2MDgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMGQ1ZWI3YmY3OTE1MmI0M2EwMTQyYjhkNTVkMzRmMzRlOGQ0N2U5MzgwMDVhYTVjMTRjMjk2MWNiMjM0OWFkYSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6ImIyZWM0NTYzMjhlMzhjYWYyYmNlYTk5YWM5NTc0ZWEzZGExNjJkNmJlZDVlZTRkZGM3MzI5NjhkMmIwMDZjZGQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI3OTIwNmQwNDNlNjVhYmU2MmFmYmIwNmViNGMxMWNmZTg2NjkzNWRhOGYyYzkzODI4NjVlZjg1YjVhMzc1NTUwIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjAyYjJjMTlhNDY2ZjNiYWU5ZDhmNWI0NzUyZGEzZmU2MWM1MTIxYzc1Mzc0N2I1NzNmNTdlYzBmOGExODIzZDciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiNTNiOTA2MjdlNWY1OTM4YjdkNWY0NzhjM2JiNDE4NjkwOWI1OTY1MjVhM2I4NWNlZWU2M2JjNGYyZGQ1ZmRkNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImNhOGFlMzIwZjU5NWJmMmUwMmQ3MTAxOGE5YjA0YWI1MDNiOGJiMTIyM2I2NDM5MWNjYTZiY2MyOTk5MjdmOTciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiYjk1MzhlMjkwNzdlMzg1MzlmN2E0MTliZGMzNmFhYWVjMTMyNGY0MjQzOTA2YzIyN2JmMzhkZDU4NTA4M2NlZCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiIyN2RmYWY1Y2M1NzJlMTFmODhkMDFmNGUwMzQ0ZWRiMzA4OWQ2NDc5YmY0ODIyODBiZmNmNGE4YzZjOTY1NmIwIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiZTBjMjFhMzQ1NTZjZTMzNjViOTE5YmUwNjlmODVkM2EyNmQ2MTcyM2Q4YjlmN2QwZjY5ZTkzMjMxZDY4ZGM2ZiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiODY4YzNjOTYwNGJlYWMxMDZiZDQzMTc3NDRjYTNjZTI2YzU3YWFiODc2YWUwMWQwZWU5NzNmYWE1NDNlNWRmOCIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiJiNzY3YTcyMmUzNmU4MjAxYWNjMjg2MTAzYzBkZmY4Y2I2MjI4YWQyMmVkZWJmMjc4ODcxOTQ1MDVmMGVlNmNkIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
      privacy: {
        obfuscated: [],
      },
    },
  },
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: "did:ethr:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: {
        identityProofType: "DNS-DID",
        identifier: "example.openattestation.com",
      },
    },
    validFrom: "2021-03-08T12:00:00+08:00",
    credentialSubject: {
      id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
      type: ["DriversLicense"],
      name: "Jane Doe",
      licenses: [
        {
          class: "3000A",
          description: "Motor spaceships with unladen weight <= 3000tonnes",
          effectiveDate: "2013-05-16T00:00:00+08:00",
        },
      ],
    },
    renderMethod: [
      {
        id: "https://demo-renderer.opencerts.io",
        type: "OpenAttestationEmbeddedRenderer",
        templateName: "GOVTECH_DEMO",
      },
    ],
    proof: {
      type: "OpenAttestationMerkleProofSignature2018",
      proofPurpose: "assertionMethod",
      targetHash: "ce284d21e98ac301c0e963ea6d020570091e05591dc2b787a698512e82b39001",
      proofs: ["08969c7baf46807ee65e495b2a93c0e27dfdc77085562ce9ab1249a7fb261681"],
      merkleRoot: "6fa0bdfa20b114c3e9e92fb511be62f416533a35df99a440ecc28ff4a3f601d2",
      salts:
        "W3sidmFsdWUiOiI1ZGU5NjM1OGRlZGVjODIwMWFhYTJjZjRkOGI4ZjYyNzA0NDc2ZTRkYzdiZDQ5OGEwOTc5MGI1MDc1NzY0NWQyIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImI2YzkyMDc4YjM5OTU3NmM1YmNlZjVhOTBjYmMwMzQxNjEzN2UyZTBjODAzM2JhM2FiZDNkYTU3NjEzZGYwZGMiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiNjM0Nzk4NGNiN2Q3MDA4NTczNjJlYmFjZTgwMDEzZjQwODA0NzNiMDkyYjAyMzQ3ZDY1MGUwMGM4MGRjMTQ5ZiIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImVkNGJiMDQwMWQ0NDY0NTljNjQ1YWUyMjI2MGQ5M2YxYzllOTkwYzg3ZGZhYzM2YjI2N2QwMTVlZTM4MDRlMWYiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiI1NTU4OThjZmE3ZWUxZThjY2VmOGIxYWMyYjBjY2RlNWJlZmFkMDE2NTJjOTY3NmVlM2VlNGExNTNmODlhM2JhIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiNmVmYjc3ZDY2ZDQ3MDcxNzQ5NTIyOTI4MzE1MDI5OTlkYjViN2FmOWQ2NjQ3OWRiYzFiMzlhZjhiNmI0ZTU1NSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMmNjOGU1OTcxMDFhYmE0NzIyYmYzZGY0MWQwYjYyNjM3MGFiNzRhOGZiZjhjMmM2MTlmNDIzN2Y3ZWFhMzJmOCIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJmY2IxNDNjOWUwNmQzMTZlNzdlYmIzMDkxNDFiMWI5ZDE1YTRhMTQwYzk4ODFhYTY0OTY0MTQ1NDVhM2RhYzUxIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6Ijc0NDVkNDQzMDdmOWU2ODBjNTFkMWYxZjEzYzE5YTU2NDFkNmFiNmMzYmE0NmRjMDFmMWIyZDU0YTE4ZWJkMTEiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYmVjYjY3OTBjMWQ1MmE2YmRlMjFkMzRjYTUxZDQ5ZGViNDBkMmE0MzQ2MGYyZjI4ZDA1NzY0YjVhNzFmODFhNCIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjkzMzQ2ZDg0NmI1MzJkZmY0NTc5NGQ0OTVkNzk3ZDZmYzZkYTRjYTgyMzRmMzQwNjljODNjYTU0MWQwNzA4NzgiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImU5OTZiYTM2NTFiZjZiMGY2YWU4NDUyYjljOTM3NjBiZjRkYzRiNDYwNjZlNGZkYTQ0YzBiZTJkY2FhMmFjZTEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiZGIwZGQ0NjcyYWYxZjdkZGJiNGVhNTYwOGMzZjBkMjc5MDljMTAxM2FjYmJkZDcwOWVjMDZjYmQ0YTM3OGZmMCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjA1MWZkNTUzN2Q0ZjViNzVmNWY2MTk2NmI1ODc4MDhkNGNlZTQ1N2EzOTNlMmQ0MWZmZGFjMzllZjk5ZjcwNTUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI3NTU3NzYxY2VhZTgzYzVmN2YwZTNkMmM4YjYxYzllMWVkZTNmMTIyNzVmZDgzOTIyNDNjNmQ4ZDNhNTYzNTM4IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImQ3NzE4NTkxMDUwNjc1MDhlMGQ5ZTMxMWYxZDRhZTEyNmM3ZTNkMjhjMzY4OWUxNThhNjFjNmUwZGQxZTRkMjEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiZWEzZmEzNDdjNGUxODVhNDhhY2NiMTY4NjMzNDY2ZmMyMjc4YjdkYmEzNzNiNDM1ODI1YmIzNDdiNzMxMDA3YiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImVjNDZhODc5ODI0MGQwMGNkOTJkNTBjYzE5ZTVhZDE3NjUyYjJiZjJmOGQyOTlhOWVhOTNlYWE4YmE2MDgwNzgiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6ImZhYTk2NWViNjIwMmNlNDhhNjczNzRiZTA5M2VhNTJjNDRhM2JhMzZmYmNkZjBhMWY1MzZjNTZkM2NmOGVlNzMiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiYjlkZTJiZDRkMGZjMmVlYmZkNDE1ZTcwZTRlMjYzY2Y5MDEwM2MyYzEyMTlkZDU0OGYzOWE4Y2I2NWNlYjU5YyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
      privacy: {
        obfuscated: [],
      },
    },
  },
] satisfies V4WrappedDocument[]);

export const SIGNED_WRAPPED_DOCUMENT_DID = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: {
      identityProofType: "DNS-DID",
      identifier: "example.openattestation.com",
    },
  },
  validFrom: "2021-03-08T12:00:00+08:00",
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
  renderMethod: [
    {
      id: "https://demo-renderer.opencerts.io",
      type: "OpenAttestationEmbeddedRenderer",
      templateName: "GOVTECH_DEMO",
    },
  ],
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "4b178a75faf7d7ecff1341ee1e0907810df23c88a217b814eb12c2a4454631ec",
    proofs: [],
    merkleRoot: "4b178a75faf7d7ecff1341ee1e0907810df23c88a217b814eb12c2a4454631ec",
    salts:
      "W3sidmFsdWUiOiIyMzkyMzE4OGQ0MzIwYzlkMGEyZGY0MjU2ZTQ2ZTkzZTgzM2FlMWQ4YTU5YzFlYmQ5MTBkOTUxNDc1MjNiMjhmIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjZjMGEzZTZmZDI0NTEyZjg5MWE4ZDY0N2RlZGU1NmIwYjBlMTNkZDcxOTVmMDRiM2EwMzY2ZDZmNDk5OWFkMTAiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiMWFhNDY3NmQwY2FjZGU1ZTljY2MyZmNiYzc1OWRjZTJlNWFhOGY5YTg1ODI5NzFlNjNlM2MzZmVjMzE2OWNiOSIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6IjZmYjU2MDJkYjg1MjY1M2Y2NDg0M2I0ODcyNTNmNGU3ZWI2NzlmZDY3Mjg4NjNmMWRkNjcyY2U1ZWEzMDAzM2YiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJkMmZiMGQ4YzBlMzFkNmIwZDgxODQ1NGYyZDgxNGZkOTg3ODFjNjk4ZDA0OTg3MGJmOTAwNzA2M2Y4ZDAyNjNlIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiNzBjNDk0MzM5ZDQxZjZkOTBmY2ViNzg5ODk2ZjExMTVjMDI1NWY2Njg4Yzg1MGQxNmUxMGRiNzhhZmJjOWYyMSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMDkyYThhMTc0NjYwNjA0YTdmZWNiOTgyNGVhNmMwYTk3ZjMyODM2MzE0MmVjMTg3NWUzZTBjZTFhNzFjZTc1ZSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJmZTM5YTA3ZDYwNDVmZDdlMWQxMjRlOTc1ZmQxNjYxZTQ5NzNlM2Q0NDdkMjBiOTdmZmE0YWRkMDA0YzcyZjhhIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjljY2ZlNzNkMjllZDhmYTU2MWRiMTE5NjZhN2RiZWNhY2JhYTNlOWNmNDI5OTg4Y2VjMzNmNTRkOTQ0NTdhYzIiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiMDNhNWMwMDYyMzFlNWQ1MjJhNmYzOGFkNDE3YjEzYmQyYzgwMjVhZjY5ZGVhYTA0MzkwMjkwNjljNjEzMjE3ZCIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjNjNzhjMzdlMDA2ZjZlMTkyY2ZhZmZjYzM0NzZhODk0MmMxODNiY2JkN2NlMjJlYjhkZWNmNGQ0YTI5OGJmZmIiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjNiMDI3MjkwOThmMTQxY2I3Y2E5OGM2ZmIxODMyZjVhYmMyN2JmZDA5NTlkNzk5ZjUzNDRkYzVjZWY2YmMyMTQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMzQyYmMwYWM0MjU3MmExY2U1N2YxMjcwZGRhNTlmMDFlMzZiMTM5NzhlOTdhODgzMzMxMGVjZGMyYTgzOGUyNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjlmZGIwN2YwNGNiOTllZWViZTVjODFiZmRkZmIwMDRiNWVlMTVmZTBhMGE4ZDIyNjYzZmMxZGRkMzk5NmI3MjgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJlMTY0NTBiODVmNjJlY2JkMTgyODg4ZDQ0YjIzZGQ1YTVkZTdiNjBiN2UzZWI5YzQ1NDRmZjYzM2E4MzBlNTkxIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImY1OTc2ZWJlMTE5MjY5ZjZhZjhlZjIzMGI0ZjgwNDgyMzA5ZmFhNWRjOWI3ZjMwYjc3NTZmNDAxNDI4ZjJlZTQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiNmNlZGZiODkxMzcxMjc3NjA2NmU2MmQyMTU5MWNjYzQ0Y2I5MzlmY2U4MDRlYjZjYTUxZWI2ZTIxYTRmNzc1MCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjFjZmMzMDRmNzNkZTFlNTFhYzFmMDczZGI1YjUwYjEzNGMyNjhjYzRjZjIxNDIwZmVhMmY0NjM1YmMzZTllMzEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiZmExZDEwNjBkNTc5NTU1YWRkY2IwZDU4ZGI4MjNkMDMzOWNkNThiMGUzOTdhNzJjZWI2NDgzZTY3NjNjMjgxYiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI1OTA1MDg3YmU5NWE0YWIzMjY0NGQyZDYzYzE0YjE4OGU0ZTcxODYwN2M1YjYxOWRmNzQyNjIxZTY3N2Q2ZWFkIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiMzRhZTM3YmEzNjY3M2Q3MzM0ODhhNzlkMzZkZDI0NDBkNzZiMzBhMGUyMGNkMzU0YjYyOTU4ZTljZTU2NTA4NyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiMWM2NTM2YmI0MDU1ODMyMTMwN2Y2NzE1MTc4MjA3NzU2YTBlNzBiNTE1NzAxM2Q5MWIwN2MxMWVlODdjNzYyYiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiIyY2E4NjJjMDdjYzkwZTczYjA3ZmQxMmU0YjM2ODhjNDRkZDc5OTI3ZTAzOWQ0NWU5Njc0YzM0ZmYyMmMwYTUxIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
    privacy: {
      obfuscated: [],
    },
    key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
    signature:
      "0x1744f9615fa8d725cf4ae14f2654762dd8e0ee88a9b6d8af13cec688019a7a501e9bae10fa407fdbe359977f8124a26a0061a0ef0ea212c42fd1d91e0998928d1c",
  },
} satisfies V4SignedWrappedDocument);

export const SIGNED_WRAPPED_DOCUMENT_DID_OSCP = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: {
      identityProofType: "DNS-DID",
      identifier: "example.openattestation.com",
    },
  },
  validFrom: "2021-03-08T12:00:00+08:00",
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
  credentialStatus: {
    id: "https://ocsp-sandbox.openattestation.com",
    type: "OpenAttestationOcspResponder",
  },
  renderMethod: [
    {
      id: "https://demo-renderer.opencerts.io",
      type: "OpenAttestationEmbeddedRenderer",
      templateName: "GOVTECH_DEMO",
    },
  ],
  proof: {
    type: "OpenAttestationMerkleProofSignature2018",
    proofPurpose: "assertionMethod",
    targetHash: "db256b67a181b7c5a1b312b64901a0c332d72a5f2f631473ba2c28a725c3ab21",
    proofs: [],
    merkleRoot: "db256b67a181b7c5a1b312b64901a0c332d72a5f2f631473ba2c28a725c3ab21",
    salts:
      "W3sidmFsdWUiOiI2ZTJhN2E4MjM1NzMzOTM2MGJkYzE0OTYzMTUwNzAyNTg2N2QyOWYxM2YxYjMwZmFmMDQ4Y2VmM2QyMzc2YWM2IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImRkZGI5MDVmNmIzZWQ0OGVlMzkwZDljYjQ4MTdkMjk4OWMyY2VmMzQyM2UxNGE4YjQzMDMzYmFhNDM0NmY2ZGUiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiMWNiZjBjYjY2ODZkNWIyMzJkM2QwZDZiNTk1MTA0NDc0OGY4NmNlMjJkZDE1OGIxNzUwZTc2YWUyYzAzZDkwNyIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImJlZjJmZjNhM2MxNDEzMDYxMDVkNGMzMTJlZmZkN2M2OTUxN2U3ZjM5YTBjYTQ3ZTZkZTk4Y2M1ZTFkMzllY2UiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiI1N2M5YWIzYzRlM2RiNjE5Nzc0NjZhNjQ4ZmM5ZThjNjI2NzQ1ZDE4NmIyYWRlZDIxNDhiNDQwYWU0MWRmYjhiIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiZmYwNDE0MjcxYWYwNzk5ZWM4YzgwMTQzMzI2NmVmNGE5YzAwNzQxMDVlNTNmMmQ3OWYwYjYzYjBjNjk1Y2Q2MCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiOTEyNjc2YWZjZTkyYjBhNGU4MzhkNzZjZDYyZmNmMGY0YTc1NmE1MTI0NWI0YWU4YTQxN2ZkNzYxNmVhMDVkMSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJmNDYzYmNkYWIzYTcwNGYzMWRhOWQ5MjUwNTM3OTE1MDBiYTdjMDQzZTNiZDEzNzU3ZTgyNTI5MzYzZGNhNjc0IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6Ijc2YWIzZWQwODk2NzZkOGJmM2FhZjE3OGQyYTUzYzI3NGZjMGUyMmFiMjJkNjU3NmIxYTUzYTAxMjMxNjUxYjAiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiNjMyYzI5MzdhZGYwMGIwYWU0NGRlYzZkNGI1NmJmN2RkYTU3ZDEzYjk3MWUxNzhlZjJiZTdmNDMwNDJlMTI4YiIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjkxOGNiYjU1MDg4ZGFjNDEzMzYxODEwZDE0ZTBlM2U4Mzk4N2Y2N2NjZDU1YTE5OGQ2YzZhOWEzYWM4Y2VkMDQiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImI5NmVkN2FjZDZjZjQwNmViZGMxZmJlY2VhY2M1ZWYxZDhkODlmZDNhZTZmZTRjMzkyMTM3M2NhY2YxYTc5NDAiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiOTVmNDFmYWZiYjNhZmY4NmM4ODU0ZTRjOWQ4MTAzY2E3NGM0NTBiODg3ZmQwOGMwNDFiYzI4NzlmN2RiMDAzYyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjU2ZmU1YjZmZDYwNjE0OWZmYzhhZGZkNjY2ZDgxNGJiYzZjNWMzZjU0YjA2ZmQ4YjJjZTFmNDc2M2RkNWMwNmMiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJmNWZhM2MyMDhiODRiNDdkZDczYTIwYmM5YjczYWY1MTI3MzIwZGUxNTIwNGExMjA0NjgzZDI0NGUwNzhkYmU5IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjkzODcxZTQ2MmEzZjIyNDE1YzU2ODhhOGQ3NGYyZjFlZjMwZTEwYWNlOWZiMmIyNTllOWVjMmVlZWVjMWI2NGQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiN2FmNWFjNzViYjNkZWYyNTQwOTViNWE4ZDFiNGFkZmJiZmQ3YTM3MTY4N2UzZGY2OTJmYjhlMmM2YTMyZjZiNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjAwZDA2MTlhNzQ0ZWUxODIwMzQ5NzZhZmRjZmU2ZjE5ZDE1NWZkMjgwZDQzYjM0ZjhjNDM4OGJiMDQwOTBkOTQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiOTUyNTdkMjJmMGMyYzRkNTY3MjkzMWM0OGY1OTBjY2RmMGU4NzNmY2ZmMTdjZDA2NmRmNjBjNzMxMzgxZGMwNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI3ZTZlODE5MmM1OWVhMDllOGUxZDM3NTI4NGEzN2JhMTFkNmFlNTVmNmFiNGIwMjRhMGU4YjM0M2MwZTlhMWI4IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiMTRmN2U1ZWU4Zjk0ZTAyZDFiODcxYjE4YzRmZjAwOTA0ZDc4OGNhMjU4NDhlYjVlOTMwOTZmNTFhMzI0NGIwYiIsInBhdGgiOiJjcmVkZW50aWFsU3RhdHVzLmlkIn0seyJ2YWx1ZSI6IjFjNzRmODhjODNhOWZhYWQ5YjU1MjE4NjcwZDg5NzM0NTY0MjY2OTg5MzdlYTQyNmFkZmY4ZmVmOTYzMWVkNzMiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy50eXBlIn0seyJ2YWx1ZSI6IjA0N2I1YzA0NDAzMjlmM2ZkODZmMDQxODRmMTk1OGZlZDQyNDhiMDI2YmM2NGI5NDM5MmNiMGRjYmU5M2VlYWYiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6IjQyZGM4Y2EzZGJiMjI2NGI4ODg0OWIyNWFkZWQ0ZWE2NWQ2ZmMzYTZlNWUyNjExMGE1MDUwNmRjYzdhYzhmNzciLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiODg2MjJkNDRjMTBiY2VlMzUxMGRiNmE4ZjNhMGYxM2M1ODBmNmZlNWY3OGNkODVmM2FjYTIzMGE2M2QyYTZjMyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
    privacy: {
      obfuscated: [],
    },
    key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
    signature:
      "0x1d889961f3b28e3433ee56e1d3226d1b069d6696f2cac99d1f1504f31c1257b216e9e42bfa8c434eaeb80bc38b0af269cab3ffd03d4410539589d9173bc4ba881c",
  },
} satisfies V4SignedWrappedDocument);

export const SIGNED_WRAPPED_DOCUMENT_DID_OBFUSCATED = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: {
      identityProofType: "DNS-DID",
      identifier: "example.openattestation.com",
    },
  },
  validFrom: "2021-03-08T12:00:00+08:00",
  credentialSubject: {
    id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    type: ["DriversLicense"],
    name: "John Doe",
    licenses: [
      {
        class: "3",
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
    targetHash: "4b178a75faf7d7ecff1341ee1e0907810df23c88a217b814eb12c2a4454631ec",
    proofs: [],
    merkleRoot: "4b178a75faf7d7ecff1341ee1e0907810df23c88a217b814eb12c2a4454631ec",
    salts:
      "W3sidmFsdWUiOiIyMzkyMzE4OGQ0MzIwYzlkMGEyZGY0MjU2ZTQ2ZTkzZTgzM2FlMWQ4YTU5YzFlYmQ5MTBkOTUxNDc1MjNiMjhmIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjZjMGEzZTZmZDI0NTEyZjg5MWE4ZDY0N2RlZGU1NmIwYjBlMTNkZDcxOTVmMDRiM2EwMzY2ZDZmNDk5OWFkMTAiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiMWFhNDY3NmQwY2FjZGU1ZTljY2MyZmNiYzc1OWRjZTJlNWFhOGY5YTg1ODI5NzFlNjNlM2MzZmVjMzE2OWNiOSIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6IjZmYjU2MDJkYjg1MjY1M2Y2NDg0M2I0ODcyNTNmNGU3ZWI2NzlmZDY3Mjg4NjNmMWRkNjcyY2U1ZWEzMDAzM2YiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJkMmZiMGQ4YzBlMzFkNmIwZDgxODQ1NGYyZDgxNGZkOTg3ODFjNjk4ZDA0OTg3MGJmOTAwNzA2M2Y4ZDAyNjNlIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiNzBjNDk0MzM5ZDQxZjZkOTBmY2ViNzg5ODk2ZjExMTVjMDI1NWY2Njg4Yzg1MGQxNmUxMGRiNzhhZmJjOWYyMSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMDkyYThhMTc0NjYwNjA0YTdmZWNiOTgyNGVhNmMwYTk3ZjMyODM2MzE0MmVjMTg3NWUzZTBjZTFhNzFjZTc1ZSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJmZTM5YTA3ZDYwNDVmZDdlMWQxMjRlOTc1ZmQxNjYxZTQ5NzNlM2Q0NDdkMjBiOTdmZmE0YWRkMDA0YzcyZjhhIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjljY2ZlNzNkMjllZDhmYTU2MWRiMTE5NjZhN2RiZWNhY2JhYTNlOWNmNDI5OTg4Y2VjMzNmNTRkOTQ0NTdhYzIiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiMDNhNWMwMDYyMzFlNWQ1MjJhNmYzOGFkNDE3YjEzYmQyYzgwMjVhZjY5ZGVhYTA0MzkwMjkwNjljNjEzMjE3ZCIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjNjNzhjMzdlMDA2ZjZlMTkyY2ZhZmZjYzM0NzZhODk0MmMxODNiY2JkN2NlMjJlYjhkZWNmNGQ0YTI5OGJmZmIiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjNiMDI3MjkwOThmMTQxY2I3Y2E5OGM2ZmIxODMyZjVhYmMyN2JmZDA5NTlkNzk5ZjUzNDRkYzVjZWY2YmMyMTQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMzQyYmMwYWM0MjU3MmExY2U1N2YxMjcwZGRhNTlmMDFlMzZiMTM5NzhlOTdhODgzMzMxMGVjZGMyYTgzOGUyNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjlmZGIwN2YwNGNiOTllZWViZTVjODFiZmRkZmIwMDRiNWVlMTVmZTBhMGE4ZDIyNjYzZmMxZGRkMzk5NmI3MjgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJlMTY0NTBiODVmNjJlY2JkMTgyODg4ZDQ0YjIzZGQ1YTVkZTdiNjBiN2UzZWI5YzQ1NDRmZjYzM2E4MzBlNTkxIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjZjZWRmYjg5MTM3MTI3NzYwNjZlNjJkMjE1OTFjY2M0NGNiOTM5ZmNlODA0ZWI2Y2E1MWViNmUyMWE0Zjc3NTAiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIxY2ZjMzA0ZjczZGUxZTUxYWMxZjA3M2RiNWI1MGIxMzRjMjY4Y2M0Y2YyMTQyMGZlYTJmNDYzNWJjM2U5ZTMxIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmNsYXNzIn0seyJ2YWx1ZSI6ImZhMWQxMDYwZDU3OTU1NWFkZGNiMGQ1OGRiODIzZDAzMzljZDU4YjBlMzk3YTcyY2ViNjQ4M2U2NzYzYzI4MWIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiNTkwNTA4N2JlOTVhNGFiMzI2NDRkMmQ2M2MxNGIxODhlNGU3MTg2MDdjNWI2MTlkZjc0MjYyMWU2NzdkNmVhZCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjM0YWUzN2JhMzY2NzNkNzMzNDg4YTc5ZDM2ZGQyNDQwZDc2YjMwYTBlMjBjZDM1NGI2Mjk1OGU5Y2U1NjUwODciLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6IjFjNjUzNmJiNDA1NTgzMjEzMDdmNjcxNTE3ODIwNzc1NmEwZTcwYjUxNTcwMTNkOTFiMDdjMTFlZTg3Yzc2MmIiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiMmNhODYyYzA3Y2M5MGU3M2IwN2ZkMTJlNGIzNjg4YzQ0ZGQ3OTkyN2UwMzlkNDVlOTY3NGMzNGZmMjJjMGE1MSIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
    privacy: {
      obfuscated: ["0394c26c5be1bde929bf5aec2e076fc6843ace379be541c30707dab467baa59f"],
    },
    key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
    signature:
      "0x1744f9615fa8d725cf4ae14f2654762dd8e0ee88a9b6d8af13cec688019a7a501e9bae10fa407fdbe359977f8124a26a0061a0ef0ea212c42fd1d91e0998928d1c",
  },
  renderMethod: [
    {
      id: "https://demo-renderer.opencerts.io",
      type: "OpenAttestationEmbeddedRenderer",
      templateName: "GOVTECH_DEMO",
    },
  ],
} satisfies V4SignedWrappedDocument);

export const BATCHED_SIGNED_WRAPPED_DOCUMENTS_DID = freezeObject([
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: "did:ethr:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: {
        identityProofType: "DNS-DID",
        identifier: "example.openattestation.com",
      },
    },
    validFrom: "2021-03-08T12:00:00+08:00",
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
    renderMethod: [
      {
        id: "https://demo-renderer.opencerts.io",
        type: "OpenAttestationEmbeddedRenderer",
        templateName: "GOVTECH_DEMO",
      },
    ],
    proof: {
      type: "OpenAttestationMerkleProofSignature2018",
      proofPurpose: "assertionMethod",
      targetHash: "08969c7baf46807ee65e495b2a93c0e27dfdc77085562ce9ab1249a7fb261681",
      proofs: ["ce284d21e98ac301c0e963ea6d020570091e05591dc2b787a698512e82b39001"],
      merkleRoot: "6fa0bdfa20b114c3e9e92fb511be62f416533a35df99a440ecc28ff4a3f601d2",
      salts:
        "W3sidmFsdWUiOiIwMzgyZWU0MjFlNTgyMzJlMGJjNTI0MDY1NjhhZTdiNWZhNDhlOWRjYzczZmVkM2VhOTZkOTAzNGQ4ZWZkNDlhIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImViMmI1ZmIwODhlZDk5YzY0NzJmYmQ4MjMyNjVhYjlkMzZhNmQ0MDFiMGEyNmM5N2Q3Zjc0MDkwYWJiYTE4OGEiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiYWNmNGFhMGJmZDEyMTRmZGEwZDAzNzczNmNhMDFiMzhkOTBlZDA4MzQ5ODUwMWY5NDlmOTgyNjg1NmE2MTM3OSIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6IjM5Yzc1MjFmNDdlNTJlNWZlOGI2NmEyYjhjZmEzYTQwNDM1ZjQ2Y2NiOWY3MGQxYWY4MThkNmNkNzk1MzQ4MzQiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJiNWY3MmI3N2M1NjU3YjZiOTMyN2QyMGYwZTUwYzQxMGVmNzRlNDMzYTM0NTRlOTRmMTEzOTZmMTIwYzJjMjc5IiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiOTU1MjExMzNmNzgzZjI5NzlkODgyMzI4MDlmMDgxNmUzNDVmMjE4MTk0ZTJkMTgwYzZmYTcwMTBhNDI4ODFkYyIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMTQwZmVlNjI5Y2M2MjY3Njk1NzA4YzY2ZTg2OGI0ZjVhZTBiMDg1YjYzNDczM2I1YWE1N2M4ZTQxM2I1NTliNiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJiMjFmZTkyMDNlNWYxNzFjMjE1NDIyY2Y2ZTZkOWEzNzFkMmIyZGJkMjU5ZDE0Y2JmMDZiYTllZjQ4NzEzYzk3IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6ImE5Mjg0OTFiMzYyNzcyMjUxNzM0ZDEwNGQwOGJiMTgzMjczM2JlYzZiYjdmYWI0YTE4ZTdiNGRlY2QzMjE0YmMiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiNWViMmMyNTU2ODgyZjgzZjM0MTQ5MTczMGM0OWI4NTE4OTljMTA3NzY2Yzk5YWQwYzhhMGRkZTQxNDkzZjYxYyIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjVlMTgyNThiODdjMjJiMGIzY2Y4OWVhMjZhOTI5N2ZkYjVmYjI0NTA2Mzg0MzNlYzcxN2YyYTBmMzE0NTJlMmYiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImIyYWU3ODllZmVjZmE4ZmEzMmZmNTdlYTNjYTJmZjJjZmVmOThmOThmZGVhY2U4M2Q0NGEwNTVjZGU4MDE2MDgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMGQ1ZWI3YmY3OTE1MmI0M2EwMTQyYjhkNTVkMzRmMzRlOGQ0N2U5MzgwMDVhYTVjMTRjMjk2MWNiMjM0OWFkYSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6ImIyZWM0NTYzMjhlMzhjYWYyYmNlYTk5YWM5NTc0ZWEzZGExNjJkNmJlZDVlZTRkZGM3MzI5NjhkMmIwMDZjZGQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI3OTIwNmQwNDNlNjVhYmU2MmFmYmIwNmViNGMxMWNmZTg2NjkzNWRhOGYyYzkzODI4NjVlZjg1YjVhMzc1NTUwIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjAyYjJjMTlhNDY2ZjNiYWU5ZDhmNWI0NzUyZGEzZmU2MWM1MTIxYzc1Mzc0N2I1NzNmNTdlYzBmOGExODIzZDciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiNTNiOTA2MjdlNWY1OTM4YjdkNWY0NzhjM2JiNDE4NjkwOWI1OTY1MjVhM2I4NWNlZWU2M2JjNGYyZGQ1ZmRkNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImNhOGFlMzIwZjU5NWJmMmUwMmQ3MTAxOGE5YjA0YWI1MDNiOGJiMTIyM2I2NDM5MWNjYTZiY2MyOTk5MjdmOTciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiYjk1MzhlMjkwNzdlMzg1MzlmN2E0MTliZGMzNmFhYWVjMTMyNGY0MjQzOTA2YzIyN2JmMzhkZDU4NTA4M2NlZCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiIyN2RmYWY1Y2M1NzJlMTFmODhkMDFmNGUwMzQ0ZWRiMzA4OWQ2NDc5YmY0ODIyODBiZmNmNGE4YzZjOTY1NmIwIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiZTBjMjFhMzQ1NTZjZTMzNjViOTE5YmUwNjlmODVkM2EyNmQ2MTcyM2Q4YjlmN2QwZjY5ZTkzMjMxZDY4ZGM2ZiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiODY4YzNjOTYwNGJlYWMxMDZiZDQzMTc3NDRjYTNjZTI2YzU3YWFiODc2YWUwMWQwZWU5NzNmYWE1NDNlNWRmOCIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiJiNzY3YTcyMmUzNmU4MjAxYWNjMjg2MTAzYzBkZmY4Y2I2MjI4YWQyMmVkZWJmMjc4ODcxOTQ1MDVmMGVlNmNkIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
      privacy: {
        obfuscated: [],
      },
      key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0x153aeb0f59bef692f1b5bec2f20fc08f72863b0a670e87ac7c68460d311fc7a574189bb92056a15f1ef283c1784303528364d2124a006de3dba586f6162df5481b",
    },
  },
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: "did:ethr:did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: {
        identityProofType: "DNS-DID",
        identifier: "example.openattestation.com",
      },
    },
    validFrom: "2021-03-08T12:00:00+08:00",
    credentialSubject: {
      id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
      type: ["DriversLicense"],
      name: "Jane Doe",
      licenses: [
        {
          class: "3000A",
          description: "Motor spaceships with unladen weight <= 3000tonnes",
          effectiveDate: "2013-05-16T00:00:00+08:00",
        },
      ],
    },
    renderMethod: [
      {
        id: "https://demo-renderer.opencerts.io",
        type: "OpenAttestationEmbeddedRenderer",
        templateName: "GOVTECH_DEMO",
      },
    ],
    proof: {
      type: "OpenAttestationMerkleProofSignature2018",
      proofPurpose: "assertionMethod",
      targetHash: "ce284d21e98ac301c0e963ea6d020570091e05591dc2b787a698512e82b39001",
      proofs: ["08969c7baf46807ee65e495b2a93c0e27dfdc77085562ce9ab1249a7fb261681"],
      merkleRoot: "6fa0bdfa20b114c3e9e92fb511be62f416533a35df99a440ecc28ff4a3f601d2",
      salts:
        "W3sidmFsdWUiOiI1ZGU5NjM1OGRlZGVjODIwMWFhYTJjZjRkOGI4ZjYyNzA0NDc2ZTRkYzdiZDQ5OGEwOTc5MGI1MDc1NzY0NWQyIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImI2YzkyMDc4YjM5OTU3NmM1YmNlZjVhOTBjYmMwMzQxNjEzN2UyZTBjODAzM2JhM2FiZDNkYTU3NjEzZGYwZGMiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiNjM0Nzk4NGNiN2Q3MDA4NTczNjJlYmFjZTgwMDEzZjQwODA0NzNiMDkyYjAyMzQ3ZDY1MGUwMGM4MGRjMTQ5ZiIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImVkNGJiMDQwMWQ0NDY0NTljNjQ1YWUyMjI2MGQ5M2YxYzllOTkwYzg3ZGZhYzM2YjI2N2QwMTVlZTM4MDRlMWYiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiI1NTU4OThjZmE3ZWUxZThjY2VmOGIxYWMyYjBjY2RlNWJlZmFkMDE2NTJjOTY3NmVlM2VlNGExNTNmODlhM2JhIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiNmVmYjc3ZDY2ZDQ3MDcxNzQ5NTIyOTI4MzE1MDI5OTlkYjViN2FmOWQ2NjQ3OWRiYzFiMzlhZjhiNmI0ZTU1NSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMmNjOGU1OTcxMDFhYmE0NzIyYmYzZGY0MWQwYjYyNjM3MGFiNzRhOGZiZjhjMmM2MTlmNDIzN2Y3ZWFhMzJmOCIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJmY2IxNDNjOWUwNmQzMTZlNzdlYmIzMDkxNDFiMWI5ZDE1YTRhMTQwYzk4ODFhYTY0OTY0MTQ1NDVhM2RhYzUxIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6Ijc0NDVkNDQzMDdmOWU2ODBjNTFkMWYxZjEzYzE5YTU2NDFkNmFiNmMzYmE0NmRjMDFmMWIyZDU0YTE4ZWJkMTEiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYmVjYjY3OTBjMWQ1MmE2YmRlMjFkMzRjYTUxZDQ5ZGViNDBkMmE0MzQ2MGYyZjI4ZDA1NzY0YjVhNzFmODFhNCIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjkzMzQ2ZDg0NmI1MzJkZmY0NTc5NGQ0OTVkNzk3ZDZmYzZkYTRjYTgyMzRmMzQwNjljODNjYTU0MWQwNzA4NzgiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImU5OTZiYTM2NTFiZjZiMGY2YWU4NDUyYjljOTM3NjBiZjRkYzRiNDYwNjZlNGZkYTQ0YzBiZTJkY2FhMmFjZTEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiZGIwZGQ0NjcyYWYxZjdkZGJiNGVhNTYwOGMzZjBkMjc5MDljMTAxM2FjYmJkZDcwOWVjMDZjYmQ0YTM3OGZmMCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjA1MWZkNTUzN2Q0ZjViNzVmNWY2MTk2NmI1ODc4MDhkNGNlZTQ1N2EzOTNlMmQ0MWZmZGFjMzllZjk5ZjcwNTUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI3NTU3NzYxY2VhZTgzYzVmN2YwZTNkMmM4YjYxYzllMWVkZTNmMTIyNzVmZDgzOTIyNDNjNmQ4ZDNhNTYzNTM4IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImQ3NzE4NTkxMDUwNjc1MDhlMGQ5ZTMxMWYxZDRhZTEyNmM3ZTNkMjhjMzY4OWUxNThhNjFjNmUwZGQxZTRkMjEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiZWEzZmEzNDdjNGUxODVhNDhhY2NiMTY4NjMzNDY2ZmMyMjc4YjdkYmEzNzNiNDM1ODI1YmIzNDdiNzMxMDA3YiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImVjNDZhODc5ODI0MGQwMGNkOTJkNTBjYzE5ZTVhZDE3NjUyYjJiZjJmOGQyOTlhOWVhOTNlYWE4YmE2MDgwNzgiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6ImZhYTk2NWViNjIwMmNlNDhhNjczNzRiZTA5M2VhNTJjNDRhM2JhMzZmYmNkZjBhMWY1MzZjNTZkM2NmOGVlNzMiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiYjlkZTJiZDRkMGZjMmVlYmZkNDE1ZTcwZTRlMjYzY2Y5MDEwM2MyYzEyMTlkZDU0OGYzOWE4Y2I2NWNlYjU5YyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
      privacy: {
        obfuscated: [],
      },
      key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      signature:
        "0x153aeb0f59bef692f1b5bec2f20fc08f72863b0a670e87ac7c68460d311fc7a574189bb92056a15f1ef283c1784303528364d2124a006de3dba586f6162df5481b",
    },
  },
] satisfies V4SignedWrappedDocument[]);

// Freeze fixture to prevent accidental changes during tests
function freezeObject<T>(obj: T): T {
  return deepFreeze(obj) as T;
}

function deepFreeze(obj: unknown) {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => deepFreeze(obj[prop as keyof typeof obj]));
  }
  return obj;
}
