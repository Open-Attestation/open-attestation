import { V4Document, V4SignedWrappedDocument, V4WrappedDocument } from "./types";

const ISSUER_ID = "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89" as const;
export const SAMPLE_SIGNING_KEYS = {
  public: `${ISSUER_ID}#controller`,
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
    id: ISSUER_ID,
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
    id: ISSUER_ID,
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
      id: ISSUER_ID,
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
      id: ISSUER_ID,
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
    targetHash: "dd55a7d96d47e58350f2cfb03ebdf3f859684c9f97ba75eed55b1bdcc761c5aa",
    proofs: [],
    merkleRoot: "dd55a7d96d47e58350f2cfb03ebdf3f859684c9f97ba75eed55b1bdcc761c5aa",
    salts:
      "W3sidmFsdWUiOiJjYTE3MjI0YTg3NTk0NzNhNGUyZjM2YTM3NjljODU0OGM5M2RjZTQ3NmI0MjEwMTNmYTEzYTA2OTUxYTI1YzhjIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjMyYzk3MDRhMmIxMWU1MzhjYTBlZWJhYWMzNmU0ZmRlYTU4ZGY0MDI4ZGVmZmJjOTkzODBjYjZkZjU3MTdiODEiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiNDE3YTFhNzY2YWM5MzhkOWVlY2FhNWRmMDdhOTBhODkyZTM3ZjA1ZmI3MzY5ZWRjNGQwYWNmNWZkMjE4YjhlMiIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImE1Y2FkZDIzMmQ4ZjhlMGU4ZmFhODA3OTMyYWNkZjJhODc1OWY4MWEyMDNmNmEwMjdjMTJhOTBhNjg0MWE1NWYiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiI2NGE4NjBmMmQwOGZjNGIyMDhjZWE3NmU2MjBjM2YwMDRlYzhiMmRhYjdhZTc5ZTZkZmMxZjllYjU1MWMxMmM3IiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiMzcyZmJlNDllMTdjMTA2MGEzNTk1NjVhNDA2M2VlMjkyODU1ODg0OWZhZWRkODE1MGQwYWZjZmY3NzQ2M2NmMyIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiYTE0ODAwOGQxY2JjMzM3ODJmNmNlN2UyOTFhMTM5ODE1YmRhYWFjZjg2MWYxNGYwMDk0NWU5YWIwZTk2ZjdkNiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiI5Yzg4NTc4ZTAzZWRiNjc3NTdiNDI0NzY4MTliNWZiMGQwMDlhMGU0ZjZmMjllOGNhNTBlMWJmNWI4NWQ2ZmZiIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6ImJhOTk1NDA1YWQ4ZmZlZmJmYTExMDA2MzE2ZDdkNjM4NDRlODk2ZmMxNDhkZjdlMWViZjNkYWZhYzI0NTY4YjQiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiZWY1ZTEzODU4YWM1MzYwNTMzODkxZjkxOGJhYjlmZjI3YmQ5YjhiYzA5MzQ4ZTc4NWMwMmI2YjYzZTcxZDNhYSIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImY2N2ZmNGMyZTUwYzU0M2ZmYmEyNGJiMzA4OTY5NGUxOWViZDNjOWJhMmE5MTM3NTA3N2YzOWRlN2M0ODVmY2MiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImIyYzQ2MjkwMDQwMDMwOGM1YjA3MmM1Y2NlMjQ4YmQ2YjRiOTgxODBjOGQ2ZDQ2YjIwNWE0MGE2YzNjMDhmMzciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiM2QwMThlMjllOTI3MTcxN2UwNGI5ZWYwMDJkNWVmNTRmMTRiZmI3NmJlYzdhMTlkN2ZlYjcyMzM3NjU2NzU4ZiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6ImYxNDllNmM5M2ZhNTU5ZjM4OWRjZTcwMDMwYmRmYmVlNmU3OWRjODM1NjJhYmVhN2FkOTMzNTA0OWM4MTI5NGQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiIyZGZjM2VmNDQ2NzA0MmMzMDI4NDU0MTNmMWE5MDQxYmQ2NjY3NThmNDM4MWU4OWU5NWIzZjc4NjYyYzE1NTc5IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjY3MjNhYjA4MzhkODMzNTJlMjhhNjQxMjliMzEwOWQzNzA5YTk3NWYyMDljZmM2NjE0MTNmODUyYzFmZTY0YzYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiMWZiNTRmMGVhZDgyZmEyMzVlMmU5Y2RkY2ViMGQ2NTllMjRhYzhhMzM4OThmODdmMzkzZTBmZmY5OTE1Y2NmZSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjhjMzJlZmNlOGE2ZTIzZGMxNzUzOTVmNzMxM2ZjMGQ4ZTk0ZTA0YjU3ZGMwMzI4YmEyNTk0NTgxMTJjNWQ4MjQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiYmQ1YzM2Yjc1YTVmNzEwYmQ2MzJhOWM1MTY1ZGVkNmI4N2YzODY1MTg5YWRjZTc3M2FlNDMxMTlkYzljMGFiNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI1MmYzYTU1ZWI3MGZmZjMyYjEzZWMyNjlkZjJmODM4Mjg4NTc5YmUyMDg1NmQ3Mjc5NmI3YmY3MDFmMjY5MjU3IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiZTJjZWZiMjkzZGEzZGNmNTIzZjAwNjkwN2YyNTljNTIyOTc3MzQwZjYzNmY4YmU1MmM5ZTg5ZTEzZGVlZTk0MiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiNDNiMjFkZGU2NTY2NjI5MTNjNzJiMDExMzBkMjM0MzlkY2NjMTNiZjVhYjYwMjY5YTVmYjM3NmFlMzBkNjlkMiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiI0NDRmZmU3OTMzMmRkZjExOWRiZWUzZjYzYWQyZTQyYzE2ZTczMDdkMGVmOTE3NDJlZDEzNTkxYWY5M2U0NWRjIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
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
    targetHash: "96a8e79b4c9b14dde88d9d6db26916215502ed09f458d0dc387c1ca73f3549f0",
    proofs: [],
    merkleRoot: "96a8e79b4c9b14dde88d9d6db26916215502ed09f458d0dc387c1ca73f3549f0",
    salts:
      "W3sidmFsdWUiOiI2ZGM0NzZkYmZlOTBiMjMxYzg5MjFiYmIyNTg3NTFkZGJlNzExMGFhOGM2Y2U3ODQwOGZiNmFhMDBiYzI3NTZjIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImY3MTA2OTA3YzJhMDRjNzRiOWYyMzg2Yjg3MGJhMmE1MmYxMmFiZDA1Y2FiOGUyOGFhOTdhZWJhYTk1ZTRhMjAiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiNGEyNzhiYmM0MTllYTY4YTRlN2M1Y2YxMDdmZDUxNWNkNDgwYmNhNDZlZjdjNjQ1NGFiMjQwZWRmY2JjODM4NyIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6IjVhNDQyMTE0M2YxNGZjYmY4MTdhMjgwMWJhOTUzZDY1ZWQ2NDUxNDE5YTkzY2VkM2Y2MWY1NzcxNjI0YzA3MzUiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJiY2M1OGMwZTU3NjgzYmM3NDA2NjM5ZWMwYzI3MjIxMGYzZmQzMGVkYmQ4ZjU5MjM2MjBiMzgxNzYyM2U4YWEwIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiYzUxYWJlZGE2MTNjNGZiMDY5ZDQ2MzNhMTcwNzIyYWE2YmRiMGFlZDkzOTAzZjRiMmJjZTAyZjU1NWZiNDY5OSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiM2U3MjVhNzk1YzZmNDQyNDc5NzZkNWUzNGQ3M2YyMzA4ZTEyNjc3MzNjODY1YWNjYTUwYTc1ODVmNDIwNDI4ZSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJkY2QyMzM5MTVmODVkMjIzNzFlNWFkMzc2Y2I3M2ZkNGVkODcxNzVjNWUzYTgxYjhiMjhmNWE1ZDA3NDllMzdkIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjJlY2MyOGVmZDNjNTU5ZmU5MGNiYTg2NDQ4MmM3YTk0YmU5NTRhNzY4NWY2ZmI5ZGQ5MDJiZTUwMDE5OTRjMzgiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiOTI3ZDM1ZDUzZTE3MThkMWE3ZWM2NDFkMzFmYmU4OThiMGI5YzkyZGRhZmMwMmU4MGU5NjgwMThlNmUyZTgyNCIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjI3OTVkNzgxODY2ZjNmYTI4YThhMzIxMmI4ODdjMGNjMzkyMWM2Njc2NmIxZDJmZDdkYjY1NzBhMGM1Y2ExZTEiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjA2ZmViZjYyNTZhY2FlMWIyZjg5MTE0MjM2NzY2YjNkMzIzZDMwNzQzZGJiZDRmODI0NWU1NjA5MTRhZjcwZmQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiNjBkY2E2Njg3MGNmNzMxZDkwNjcwZTA5YTg2MDA2ZTJlNjRjYzRiZGQ3ZWYyYTQyZjMwYWUwY2M4N2Q3ZmY3MSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjdhMjBiMmMwMTk3MDE0YjA5OWY2MDg4NGM4YjA1NWMzYmIxNjY3YzRiZWRiMjIzMDY4NGI2YTMxZjY1ZjQ4ZTgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJiYzRiMGJiODkzZTIxNGYyMzlkZmQ4ZGY2MGQ1ZDdkZjZmNzBjNjI4N2YzNmQ3ZWVlZGVhMjE1NDMzNjE5ODA2IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImY4N2ZhNjNmMDY1MmY2NzJjYjkyOWI2YzFiYWMwOGFmOTNiZjc5NTgwOWYzMjlmZmEyYmJlMmE1NGJmOThiODEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiYzc4MDE5Njk4NWEzNDFjYzJkZmQwMzA0YTdhOTUzZGFkZGE2MmZhYjhlOGYyZTFlZWViNGNlZDM3YTIwZDJiMyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6Ijc0Y2ZmNjIxZDhhZTM2YmQxNWFlMzFkZTIwMTE1Mzg1MDZmNDhlMjkxNjExYmM3ZmIzNjVkYjNkMTI3ZGYxYzYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiZDg2ZGQ0ZjNkNDA1N2FiN2I3NzI2ZWU0ZmE5Y2U1NjlkZTc3YmZiNGNhNzBmYTY5NzVlNWZjOWEwOTAwZjdkNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI4ZDhmZTQ3MGY3NmEyODNkNzQ1ZmM4MGYwZjEyZmZjOGU5ZjU3OGE5NjY5NDRkODBmOTM2MDhjNWZjOTM4ZTAzIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiNjkwOGFlOTBiYTI0YzZjNmRhZDcxZmEzZmQxNGJiYWYxNTMyOGJhZDliN2Y0NDI5Y2IzN2Q5YjIyYWM4MzRjNCIsInBhdGgiOiJjcmVkZW50aWFsU3RhdHVzLmlkIn0seyJ2YWx1ZSI6IjM2MDU1ODQzZWU1MTNkZDVlYmY5MjUzMTM5ZTI0YjkxZWM5MDk4NzI1Y2ZhZDQzYmE3ODkxNWRiMGFhODJjYTEiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy50eXBlIn0seyJ2YWx1ZSI6IjQzMjJhMDA0NzNjYzIzNWVmNzFkYWNiMDFlNjcwMGNkZWE1YjUxNWIzNzM2MDY0ZWU0NzJhNjM4ZWFmYjUxNzMiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6IjRmNTJjZTRjN2JmNTQxMWNhMGFhOTJhZWY1YWE5NWQyNDYwOThhZmE5N2Q2YWI0YTMwY2JkYTBhNzM5ZTg0ODAiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiMzM3YTkyODViYjFkYzgyYzYyMTFhMTBhMDA5ODkxOTNjMzQyZjczMDFiZTYwZjEzY2E4M2IzYWMxMTQ2MDkzMyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
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
      targetHash: "b449f7fb56ed2961749110037a1c40464548db71c386c925e58211505785e6ce",
      proofs: ["9d71ec0572df22c133656a45bd644a7e6bb1f44cb4670473263d7f2b6f2d4b04"],
      merkleRoot: "2e8038ad3403396fad4af3158f132c06d34fd31516b328b07001bc44f48fbeff",
      salts:
        "W3sidmFsdWUiOiIwMmFjZWRiYmRlZTcwMTQwOTA1MjgxN2ZmNDRlNzE3YzMyNTM0MDEyNjM4NzQyYTE1MzEyMjJkNWRhNTMyZDUyIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjMwZDlmZDBkOWU2ZTc1YTg5ZTYwM2JkZjE3YWZjYzY1NDgzYzIxOWNkMTZiYjJhNmZjOTdhNjI3MjNjZTczNDciLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiZjQxY2JlNzMyMjVjMDI3YjY0ZmQzMDhlMTMxY2FmMTZkYjVkYTNiNTM1ZDE0NDQ0NThmYjk5NDUwMWU0NGU4MCIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6IjE3OTU1NzVkZjZkYzZmOTg4NzFmMDk2M2I3MTdkZDg2ZmU4MmQzMjg1NzliMGYyNDhlMDIzMDE4ZTU4NjVlMmIiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiI1MTFhZTZjMzA3NzNlZDhkMWUyZmYwMjU0ZWI3MWUxMGMxNDVmMWRhMGIzNzQ2ZjliNjE5NjNiMTFjYzA1Njg5IiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiODQ0YzEwZDVlNDhmNTM4NzY4YjkxNTJkOGFkZWE0NDk2NDlmOTk2MjQ1OGQwZTIwYzg0NmRlYjJiZDRhZTg2ZSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiN2I1MjY1ZjVlYTUwNGI4ZTQ4YTczMWFjNzMzMGE4NWY0OGIzMTQyMTZiOWY0ZDVjM2I5MzQ0ZDZlY2U0MGFhNyIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiJjODc5OWRhMWVkNTdiZTk2YWRkNjRlNDc5Y2E0YWNiODVjNzgzMDYxZmM3ODU1NDNkZWZlODdlMmRmYmUzNWMxIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6ImMxYjUyNTkyN2MyM2IwZGJkNWU1ODlkMjFiOWYzODIwMTg3Y2M2MTdiNjhmMjlkMTI4YWU0Njc0MjA0Njg2M2UiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYjZhOWM4M2I4Y2MzYjZjNzlhOWYxNDE3NWJkODgwYjAxZDhkMzJjYTY5N2FkNDUzZWQyYWQyNTM2OWQ0ZGRjMyIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjBhZTM4MjhiZmVhMDk0MDZkZmI3MzliNjI0OTE3NTUxMGM4NWZhMzU2NWM1MjViNWYyMjAwNTMzYzMxN2I4Y2EiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjQ2MTVhMTNmNjU4NzA1MjdlNmJlYjc0Y2FhNzVkNTM5ODU0YzA3MjRjMmFhOWNkN2JmMTkxZjE4ZTk1MjViMTQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiM2EyZDJkYWQ2MmFiYjAyOGMzZGUzZDMxNzUyNTE4YTQ1MGY1NGZhMjc5YjcwYWU2ZDlhNWQ5ODhkMDQwZGQwNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6ImM0OWExYjc4ZjVkNjM5MzIyMzMxNzg4MTBkMzMwMmIzY2Y3MzUwYjJkMTk3YTAyNzRkNWE0MGVjODE1MzE3NTEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJiYjNkMzZhMTI4OGE4NTc0ODhjZDRmNjFmMmU1ZGNmNmM5MmE5YWVhNTM0MTM2ZjJmYjIyZTVmMGM3ZWZjZjYzIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImNhYzcwOGEzMTRhYTE3MDU1Y2YwMTRlZjNiOTc4MTUzYTc5Mzk0OGQyZTJhZDgyZmY5MzY2YzA5ODUxMjY5NmEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiMGQ5OTE4MzJhNWJmMTMzMmVlMDczZTNiMTE0ZjgzOTUwZTU5ODJkZmU4OWU0YzYwMDM5ZjliZjE4M2FjNDQ4MiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjUzMzlkY2I0MDg1YTVlNmJjNWQzMjc5NGY0NjA5MzUwN2EzZGYwNDMxNzBkOTFiZDViOTAwZDA1MjBhYThjZTMiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiNDc3MGRlNzRkNTkzYzAwZGNjMTQ5OTA0OTExZTNmOTFjODE0NmQyZGM2MTUyZDQ5NjMzNjFiMzE4M2JjZWE5NyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiJlNzAyM2Q4YjQ1NTAyY2JlM2M2MmY4ZjRhMWU2MWJhOGI5YzRjMDQ0NThiMmM1YzY1OGU0NzE5YTllOTBmZTQ2IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiY2FhOGM0YWQ0MjFiNDgxODA1ZTIxMTRhNDExOWI2MjZmNmQ3YTk1Y2ExMjI4YmI4NmM3MTU3ZDI0ZDQ3NGM5ZSIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiMDQyZmNiZjBmNTcyMzQ3Y2IxNDIwNmEwOGVmZjc4NTM3YjE0NmIwYzE2NjQyMzZmOTkyNjQwZjUwNDc4NjNiNSIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiJmZjU4OTM0OTUyNGM4MGJhYjlhYzM4YTJlNDAzM2Y2MDc5NmM0ZTJjNDMzY2QwODZmMTE5MWE2NmJiNmYzYjdmIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
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
      targetHash: "9d71ec0572df22c133656a45bd644a7e6bb1f44cb4670473263d7f2b6f2d4b04",
      proofs: ["b449f7fb56ed2961749110037a1c40464548db71c386c925e58211505785e6ce"],
      merkleRoot: "2e8038ad3403396fad4af3158f132c06d34fd31516b328b07001bc44f48fbeff",
      salts:
        "W3sidmFsdWUiOiIxMmQ0OTZmZjhmN2E3Yzc5YzhhNzJlMDA4ZTc4NGFhNDRkNjkwMmUyNDFlMGM4YTA3NTNmMzY5MjM3YzEzODY5IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjI5NjRjZDQxMzgzZjllYjRlN2I3NmY2NjAzMmI1OWFiNDIwOWFjMDY3YTQ2YjUxNGQ5ZDI2NDAyMWNmMmI1YWIiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiZDhmNzcwNjI4ZDNjZjMyY2FkNjc4NmRlODIxMjYwMjE5MmY5NDEyNzEwYTk4OWQ2NmVhOTliNDIwYmRhYmYxYSIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6IjA2NGM5NzQyZWRhODgzMzUxNjAwNDIyYWY5YjU3MmU1NzkwMmFiMjMxNDExNzEyMTc1ZDYwYjA5ZWJmNjcyZTYiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJhZDQ3NTM3M2Y0MGNmZjA1YTY0OGI2OGNkYjllMDA4Zjk1Zjg1Njg3YzNiM2I5ODJkMTNmNmI1ZmQxMGQ4ODU3IiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiNzEzYjcyMWVhNDA5MGQzNDFhMTg2ZmVjYWM3Nzc0ZGJhYjExYjE5ZjYzOTg3ZjZmZDM1ZWZjODkwNjgyNDAzZSIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiZGNkNjY4MTFmMGVlNGQxMTdjZGIzYWQ5NTFjNTE1MmIwYWZjYTlmNmZlY2I1YjQwODc2MDRlMGVjMmY3YzAxNiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIxYTU4YzJiOWQ4YzQwYjUzMTdmYjFmNjcwNmM5Yzc4YTI4OWJiZTFiZTQ4Y2I1MGE5NTdkYzkwMjIzNjdmY2I4IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6ImFkYjM3ZDAwYWU0ODhiZDgyOTFkOTAxZWY2NmIyNTY5ZTQwNDRmZjBhN2U5YTU2MTI2N2U2NGYwZmJiOWE3ZWQiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiZGY2NDNiMGM0ZjI3Y2RiYmJmMDJkZmY2MjVmM2ZlMjA2MGMxMjI4MDNjZDM5ZDA0YWY5YTg0N2M3ZmFlOGUwZSIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImMzNGE0ODBjM2YxYWMyYmY1ZjgyNjc5NDQ0ZDM1ZWE1ODYwMmQ5ZGU0YjA2ZTc3MmI2YTMyYzI2ZWUyMTA2YjEiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6Ijc5MWM1Yjc1ZjkwZjQ4NzEwY2E5ZjY4ZDIzYTBjZTU2MjE0YWZjYjhkOTIwNTljYTRhMzUzNmJmNzYxNTY5N2IiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiODJmMjdjMGY4MDk5OTkxMDhmZGRhYmQ4ZTNiN2NjYTQ3YmNhMTVkZmI4ZjE4MzE4MTVmY2VkNjdiMmYwNjhlYyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjNlYjFjNDdjZTkwOWRiNWQ1MzhmNjE2OWNiMjlkY2M2NzY0YzAwNWRjY2Y3ZGMwZTU4OTI1YmUzMmFmNTJiOTMiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJlMGJmYmI1MWI4YTc5NTNhZWM2OTE5ZjgwZGU0MzRmOWM1ZWVhZDY2Zjc0MTA1YmY0ZDAxM2Y1MjVjNGE0ZDczIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImE5YjU3YTU2NWRmMjYxZTVkNWQ0YTJiMDM2YjQzMzgwN2NjNTlhZmE0NGU1MjZjOGY2MGViYjJlNzYzZWUwYjciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiZDJmMDA4OGRiZWU2YjhhZGExZDlmZWJiNzIxZGJmOTZmMDU5MDVmNDc0YjVhYjZjNjNiYzZhYTg0NjdhNzVlOCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImU2ODc2MDBiNGU4NTEzMjc1ZGUxNDU1YjNiYmU5ODczMTZkMGMwNDI3ZTA3YjgwYWZhZWE2ZDQ5YjZlYzBhMWYiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6ImZmOTVmZjlmNGExYTQ0ZTVhMjFlNzQzMWFkODFhOGI2MzAzZjhjODQzOWJhYWFiZmRhYjU4NDhmNTkyN2Y0ZGEiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiYTcxNGVmZGUyYzdiODhjY2IzODIyMzY0OWMxM2U3MmVhNjNmNWViODcyNGM2MzkxMGJhZWJmOTE0YWYyYWJmZCIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
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
    targetHash: "dd55a7d96d47e58350f2cfb03ebdf3f859684c9f97ba75eed55b1bdcc761c5aa",
    proofs: [],
    merkleRoot: "dd55a7d96d47e58350f2cfb03ebdf3f859684c9f97ba75eed55b1bdcc761c5aa",
    salts:
      "W3sidmFsdWUiOiJjYTE3MjI0YTg3NTk0NzNhNGUyZjM2YTM3NjljODU0OGM5M2RjZTQ3NmI0MjEwMTNmYTEzYTA2OTUxYTI1YzhjIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjMyYzk3MDRhMmIxMWU1MzhjYTBlZWJhYWMzNmU0ZmRlYTU4ZGY0MDI4ZGVmZmJjOTkzODBjYjZkZjU3MTdiODEiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiNDE3YTFhNzY2YWM5MzhkOWVlY2FhNWRmMDdhOTBhODkyZTM3ZjA1ZmI3MzY5ZWRjNGQwYWNmNWZkMjE4YjhlMiIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImE1Y2FkZDIzMmQ4ZjhlMGU4ZmFhODA3OTMyYWNkZjJhODc1OWY4MWEyMDNmNmEwMjdjMTJhOTBhNjg0MWE1NWYiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiI2NGE4NjBmMmQwOGZjNGIyMDhjZWE3NmU2MjBjM2YwMDRlYzhiMmRhYjdhZTc5ZTZkZmMxZjllYjU1MWMxMmM3IiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiMzcyZmJlNDllMTdjMTA2MGEzNTk1NjVhNDA2M2VlMjkyODU1ODg0OWZhZWRkODE1MGQwYWZjZmY3NzQ2M2NmMyIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiYTE0ODAwOGQxY2JjMzM3ODJmNmNlN2UyOTFhMTM5ODE1YmRhYWFjZjg2MWYxNGYwMDk0NWU5YWIwZTk2ZjdkNiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiI5Yzg4NTc4ZTAzZWRiNjc3NTdiNDI0NzY4MTliNWZiMGQwMDlhMGU0ZjZmMjllOGNhNTBlMWJmNWI4NWQ2ZmZiIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6ImJhOTk1NDA1YWQ4ZmZlZmJmYTExMDA2MzE2ZDdkNjM4NDRlODk2ZmMxNDhkZjdlMWViZjNkYWZhYzI0NTY4YjQiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiZWY1ZTEzODU4YWM1MzYwNTMzODkxZjkxOGJhYjlmZjI3YmQ5YjhiYzA5MzQ4ZTc4NWMwMmI2YjYzZTcxZDNhYSIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImY2N2ZmNGMyZTUwYzU0M2ZmYmEyNGJiMzA4OTY5NGUxOWViZDNjOWJhMmE5MTM3NTA3N2YzOWRlN2M0ODVmY2MiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImIyYzQ2MjkwMDQwMDMwOGM1YjA3MmM1Y2NlMjQ4YmQ2YjRiOTgxODBjOGQ2ZDQ2YjIwNWE0MGE2YzNjMDhmMzciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiM2QwMThlMjllOTI3MTcxN2UwNGI5ZWYwMDJkNWVmNTRmMTRiZmI3NmJlYzdhMTlkN2ZlYjcyMzM3NjU2NzU4ZiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6ImYxNDllNmM5M2ZhNTU5ZjM4OWRjZTcwMDMwYmRmYmVlNmU3OWRjODM1NjJhYmVhN2FkOTMzNTA0OWM4MTI5NGQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiIyZGZjM2VmNDQ2NzA0MmMzMDI4NDU0MTNmMWE5MDQxYmQ2NjY3NThmNDM4MWU4OWU5NWIzZjc4NjYyYzE1NTc5IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjY3MjNhYjA4MzhkODMzNTJlMjhhNjQxMjliMzEwOWQzNzA5YTk3NWYyMDljZmM2NjE0MTNmODUyYzFmZTY0YzYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiMWZiNTRmMGVhZDgyZmEyMzVlMmU5Y2RkY2ViMGQ2NTllMjRhYzhhMzM4OThmODdmMzkzZTBmZmY5OTE1Y2NmZSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjhjMzJlZmNlOGE2ZTIzZGMxNzUzOTVmNzMxM2ZjMGQ4ZTk0ZTA0YjU3ZGMwMzI4YmEyNTk0NTgxMTJjNWQ4MjQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiYmQ1YzM2Yjc1YTVmNzEwYmQ2MzJhOWM1MTY1ZGVkNmI4N2YzODY1MTg5YWRjZTc3M2FlNDMxMTlkYzljMGFiNCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI1MmYzYTU1ZWI3MGZmZjMyYjEzZWMyNjlkZjJmODM4Mjg4NTc5YmUyMDg1NmQ3Mjc5NmI3YmY3MDFmMjY5MjU3IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiZTJjZWZiMjkzZGEzZGNmNTIzZjAwNjkwN2YyNTljNTIyOTc3MzQwZjYzNmY4YmU1MmM5ZTg5ZTEzZGVlZTk0MiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiNDNiMjFkZGU2NTY2NjI5MTNjNzJiMDExMzBkMjM0MzlkY2NjMTNiZjVhYjYwMjY5YTVmYjM3NmFlMzBkNjlkMiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiI0NDRmZmU3OTMzMmRkZjExOWRiZWUzZjYzYWQyZTQyYzE2ZTczMDdkMGVmOTE3NDJlZDEzNTkxYWY5M2U0NWRjIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
    privacy: {
      obfuscated: [],
    },
    key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
    signature:
      "0xa3ac9f73a7314c0aad47bad875921f5c88d2af9440d6c309fc2f93dbf43bd8235e84b744cb1ff1c09c214b559ce3bd6eb148c2f68c677cb8408d96e9b5411dfb1c",
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
