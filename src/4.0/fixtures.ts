import { V4Document, V4SignedWrappedDocument, V4WrappedDocument } from "./types";

export const RAW_DOCUMENT_DID = {
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
} satisfies V4Document;

export const RAW_DOCUMENT_DID_OSCP = {
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
} satisfies V4Document;

export const WRAPPED_DOCUMENT_DID = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
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
    targetHash: "f065a97f2ec23ff1469dedbcf9e41916e2a5e46b001e512d2d27d10ee87d8433",
    proofs: [],
    merkleRoot: "f065a97f2ec23ff1469dedbcf9e41916e2a5e46b001e512d2d27d10ee87d8433",
    salts:
      "W3sidmFsdWUiOiIzMThlMDgwY2NjZWYwZmRjMWEyNjhjN2FjOTEwNmNiYzUwNTEyMzkyNTc0MDNhZTU2MmI3YTFhNmU5YjkzY2ZjIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjE2MTJkMDliZjUzNGZkMmZhNTFmYjlhOWI0NTk1MzE0NTlmNzU3NDA1ZmExMjllMjY3YWEwNTUxOTlhZDY2ZjAiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiY2NlMDA0ZGM0M2NiZGY0ZmE5NjRlN2Q3ZjQ0YzQ5ZTMzNDhiMzExZmQxYjc0MzhhYTI2ZjI5YmI2OGU5MGU3NCIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6IjNhZmJmZDc0Mzg1YWQ2NzM0YjE3MDgyOGJhNWUyYWI1YzM4MTY1YTBmYWNlOTJlNGUwODRmNzkyMjFlZDJkMDAiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiIxYTMwZTE4MTI3N2I2ZjFlZTczOTlmMTQxZWU5MjY2MDIwMWUxYTRlYmZkODEzOTJiNjgxYTEwMjMxMTUzY2Q1IiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiMWU4ZDRlODY5ZjVkMzE1YmIxMzcyZjRhOTQxYWNjNjgxMWY2OWIwZmRiMmFkOWM3MTRjMGJiNTZhMmMzMjdmZiIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiYzVjN2MxNzVhNmU5ZTFlZDQ1OTkxYTExYjhiNjczZmRiNWU4ZTU4NDU5OTliM2FkODYwMjM5OTdiOWUzNWEzNyIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIyMjNkZDJhOGMwZTZhOGJlMTE2ZmUxMzliM2Q0YjRkYWZlMTBkNWJiNWEwNmVjNzE2YjNhM2JiNDZlYjI3ZDNjIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjM0YzJmMTU4OWM2MTFmYWZmOTE4MTAwODk3MGJiMGY1NTc3MWQ1ODI0ODQxOGY3OGVhOWM4NTk3NTgwZDM1ZTkiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYWE0MmVhNDE3MGJhNmRhMTVmZTdiMzIyZTUxMzc3ODA5M2E2NjE3MTE1NzZmOTA2M2JmY2Y4YzdlMGEzYjRhYSIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImU5ZjNlMTJiYTUzZDA3M2Y0ZjNiZTU2ZDUzN2ZjYjIwZmI0ZTM0YzZkM2RlZGZkNTcyMzkzODAzOTViZGM4ZTkiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjhkNGIyMDYyZmFmNzRhNmZhNGE5NmE2OTQ0NzIyMWFjNjhjZTk0MjBjOWQ2ZTFhNDFjODM2MmI1ODQwMmI5ODQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiOTMxNmM0YTRhZGJiMzQwYTBjYTViNDljNTZmNWIxZWMzNjA5N2UyMjg4YzJkY2I0YmU4ZjhiY2MxNDA4NjIyYyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjJlZmY0Y2JlZjFkNmQ1ZTEwOTZhNDAyNGY4ODhmM2U2YTEwMWZkYjIxZTRjZmI1ZjdmYTA4Y2ZhZmZkMzk2YjciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI0YjAxYjNmZWIzOTcyYTBmMDBjNTJkNDU2YmYxZWY1ZWJkODI3YjkxMDFjMzI4NTQwNzExM2NiODZhODNiY2JmIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjcxMjE4ZTA2YTNlNGM1NTc5NTIwNzdkNzQ1NTJlZTMyNDIxNzMxMjU2YTcwZDI1Nzg3ZGQyNmFkMDk1YmY5NzciLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiNWM2NzdhYzgwMGQ3MDRiZjUwYzZiYjAyN2Q0OTg1YmQ2OTg0Y2VhYjExNzUzOTk0ZWQ5YTI5OTIxYjhmYWRmNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImVhMjY1MDM0OTFlYjhjZjNiN2EzMTg1MGEwZTM3OTQxMjFiN2YzOTQ5OTI1NmIyNGQ3OWNkODE3MDVjNDcxOTgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiNzlhOWZiOTVkM2U5NTlkNjFlODFhNmQwMGY3ZTlkZjAwZTAzNTMzYTYyZDZlZDkyNWI4MTIyNjY5YThkYzZkNyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI0YzhkOWQ0YzRkYjRhODU4NmJkODgzZmViZmNhNTUzNmYxYmVmNDJhM2NmYTJmYTQxNWY0YWFkZjIyZmY1MTlkIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiNGNkOWMwOGU3NDE2MzU0YjhiNjBlYzA1YzQzZDY3YWMwOTAzNmQ4YWRlZGYyZGVjMjIxNWU1NmU4MGM1MDg5MCIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiOGRjNGY3NDllN2JhZmZmZWJmM2FmOGY4ZDJjYjUwNTAzZGFmOGZhZTVkM2Q3YjhjNTNhZDM1NTFiMWM1NDI0MyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiJkZjY0NmI2YjYwMTJmZWQxYzE5N2E5MjhjNGJjZTVhOWJlNTc0YjU4YmFhYjZkN2E4OTAwZDBiZDdkYjg4N2IyIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
    privacy: {
      obfuscated: [],
    },
  },
} satisfies V4WrappedDocument;

export const SIGNED_WRAPPED_DOCUMENT_DID = {
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
} satisfies V4SignedWrappedDocument;

export const SIGNED_WRAPPED_DOCUMENT_DID_OBFUSCATED = {
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
  credentialStatus: { id: "https://ocsp-sandbox.openattestation.com", type: "OpenAttestationOcspResponder" },
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
      { class: "3", effectiveDate: "2013-05-16T00:00:00+08:00" },
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
    targetHash: "a9651b2c97ce35ed512ccce6e39cd575a964c82d2f7d311e3aaf2722147f67d2",
    proofs: [],
    merkleRoot: "a9651b2c97ce35ed512ccce6e39cd575a964c82d2f7d311e3aaf2722147f67d2",
    salts:
      "W3sidmFsdWUiOiI4MWI1NmU5MjQzNWQ3MTQ4ZDE3MTYwNzJmZmEyYTMzZWUwZDhkMjcyMTIwMGE0MjhjMjU4MTNlNmJhYjk3OGM2IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImFjOGVhYWVlZDdhNDE1ZjY4MzA4ZDRhOGM5ZjJhNmJmYzRmNTQyNTlmNjRjY2ZlYTMzNTk2N2JhYjMyMjJlYTciLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiNDUxNWFlNjEzZDYzZWY3MzE1NzhmNmM4MmY0MDczMTJmNTg4MGRmY2UzMWU5MmIwMGUwYzY0MDVmZWIxMTZkZiIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImQxZDQ4NzMwNTI2ODQ5NDFjMTU3ZjYzMWJjYTNmODRmY2Q0ZTFjMzRlNzk2MWJkYTBiY2I1OTlhZGM2ZjY3NWIiLCJwYXRoIjoidHlwZVsxXSJ9LHsidmFsdWUiOiI2MDIwNGI2NTA5Mzk0MWEzYmQ4MWI5NGQ2YTYxZjhkNzgzM2Q1MGQyYjQ3OWJiMTY5NWUzNmI4NTMwODkyODYwIiwicGF0aCI6InZhbGlkRnJvbSJ9LHsidmFsdWUiOiJhMWQxMWYwYjEwNDI5OTM1N2Y1OGZlYzI2Y2JmYTkwZTllN2NjMjYyZjIzYmJhMTcwZDU5YzQ3NThiMTBmYTE0IiwicGF0aCI6Im5hbWUifSx7InZhbHVlIjoiMWM1ODQ3MmFjZTE5NWFmZmVlZThkOWU0YmNiMWRlZWIxNzhkZDFiZmE1ZmYwMWJhZmM5ZDNiMjRkZjE2ZGNlMyIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiZmMzM2M0MzYzMDRkM2Y0NTJhMWU3ZDk3NWVkZjJlOWJmZmM5NTQ3NmE4MmJlYjNiOGVlMDg3ZWMxMjVjMjE3ZiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiI0NjVlYzZmYTBkNmJlMzliYjFiODliNzY4Y2VlMTFhMzc3NGRmYTBjM2NjN2MxM2VlMjg4NDc0MmM4NmQyZmFiIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjhlYTI4M2QzY2RkMjI0MjM5YmE0YjBiNDEyNGJlMmI5YWQzMmFiMDAwYWMzNjkyMjVmZDhhZGUwMzU0ZjdjY2IiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiM2NiNDU3ODBkZWY5M2Y5NGY2NzQwZGU0MDBkYzFmNjY2ZmE0YjdkYmQ1YjQ3NmJmNjFkNjUzZTQ3ZmY2YTA1NyIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImZlNzZjNWM2MGQ4YWI4ZDE3NTAxY2Q5YWVmYzczZDk4YWE0MmI0YzUzM2YxOWQxMTUxNTRiMDhjMGIwOWU1ZTkiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy5pZCJ9LHsidmFsdWUiOiJiOGFkYTIxODZhZGY1M2U1ZDg2YmQ3MjI2OTJiODU5ZTZkOTUwYjVjY2M3M2ZkMmFlYTUzZmRhYzQ0NWNiYTczIiwicGF0aCI6ImNyZWRlbnRpYWxTdGF0dXMudHlwZSJ9LHsidmFsdWUiOiJkNjlkZTZiMDZlM2M5YzA1ZDhiYzBiZTY1OWQ1YTY0MWNjNzEyZDIzNGU2ZDkzZTFhZDg2MzAwZjIwYTEwYzk0IiwicGF0aCI6InJlbmRlck1ldGhvZFswXS5pZCJ9LHsidmFsdWUiOiI2YWY1ZWY4ZTliMjFjZDU3NjNkMTg3NGM0ZjIxZTFmZmVjYmEzNWZiMDRhZWFmOWIyYWFjNmMzOTAxYmRkNjFjIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50eXBlIn0seyJ2YWx1ZSI6IjQ0MGQ0MDI4OWM1OWYyNWZkZTcxNDBkOTMyNWIyZWJiYjE2MWVmNmM3YjUyMmVmNDg0OTVhN2FjYTRiNDcxZmYiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnRlbXBsYXRlTmFtZSJ9LHsidmFsdWUiOiIzY2Q0MGExN2U0YzE3ZmRjNjk4OWRiMjRhZjBmNjI3NzQ1ODU5OTAxZmI2MzBlZTdiMTU5MTQ1Zjg1YTVjMzI1IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmlkIn0seyJ2YWx1ZSI6IjhkMTFlMTg3YjY0MDAxNGUwNzA3Y2M4YjM5NGE3ZTE2ZTAyYTQyOGVlZDhhOWRjNjQ5YTI3MTg3ODYwMWRlNmIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QudHlwZVswXSJ9LHsidmFsdWUiOiIyNmFlYmU4MGI5Y2U3YjBiNjVkM2E2NTVhMmNkYTE2NDI3MTkxNmMwZjRmNTE3YTJiMjc5MDg3NGQyYzRkYmZlIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0Lm5hbWUifSx7InZhbHVlIjoiODNlZDJjMmQ2OThkY2QxYTBlNDY2N2QzYWYyMjNmMWViY2Q5YzMxY2U5MDlmNTk0ZmRlOTdkYWEzNWEzY2QxNSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5jbGFzcyJ9LHsidmFsdWUiOiJjY2E1ZTExMzdhYmY3OGYzMzViMzNlNjA3YmZmNmU4YWZkM2YyZTJkOTc2YWZiOWM1OGE1Nzk4YmEwZTllYmVlIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiYmY2YWI5YzQ2ZTVmZjBkNzM1Nzc2MjUxOTQ1NmFlYmI1YTU1NGJjNDg0NTRmN2EyYTU2NTdiNGIyODQ3ZTFmMSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5jbGFzcyJ9LHsidmFsdWUiOiI1NTJmOGQ0Y2MxMjRmYzIyYjQxM2I4YjYzYzBhZjcwZWI0MDgzNDYxOWMxNDRjYWZmYWI3MDFmMGE1MzYzMmJjIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmRlc2NyaXB0aW9uIn0seyJ2YWx1ZSI6ImJhZWE5NWEyYmVlNTU3NWRlY2UzM2ZiZjFhODBhZWYxMmY2NWExYjY4NGRkMjQ0ZjZmNThmMjJmYjJiYWQ4N2UiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uZWZmZWN0aXZlRGF0ZSJ9XQ==",
    privacy: { obfuscated: ["c866663b38353fdb46a372cd0302fd7752cc75bee4b8fc4d65c2e3b22f2466f7"] },
    key: "did:ethr:0xe93502ce1A52C1c0e99A2eB6666263EA53dB0a5e#controller",
    signature:
      "0xfa3bb0c734fd8853b58447cbf64c87198bf8dea6e5da81a325dd74b0105972be77944ef532f45fdbfe463c061462c7cf468025cbdf772200cbf37c76934448ee1b",
  },
} satisfies V4SignedWrappedDocument;

export const SIGNED_WRAPPED_DOCUMENT_DID_OSCP = {
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
  credentialStatus: { id: "https://ocsp-sandbox.openattestation.com", type: "OpenAttestationOcspResponder" },
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
    targetHash: "a9651b2c97ce35ed512ccce6e39cd575a964c82d2f7d311e3aaf2722147f67d2",
    proofs: [],
    merkleRoot: "a9651b2c97ce35ed512ccce6e39cd575a964c82d2f7d311e3aaf2722147f67d2",
    salts:
      "W3sidmFsdWUiOiI4MWI1NmU5MjQzNWQ3MTQ4ZDE3MTYwNzJmZmEyYTMzZWUwZDhkMjcyMTIwMGE0MjhjMjU4MTNlNmJhYjk3OGM2IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImFjOGVhYWVlZDdhNDE1ZjY4MzA4ZDRhOGM5ZjJhNmJmYzRmNTQyNTlmNjRjY2ZlYTMzNTk2N2JhYjMyMjJlYTciLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiNDUxNWFlNjEzZDYzZWY3MzE1NzhmNmM4MmY0MDczMTJmNTg4MGRmY2UzMWU5MmIwMGUwYzY0MDVmZWIxMTZkZiIsInBhdGgiOiJ0eXBlWzBdIn0seyJ2YWx1ZSI6ImQxZDQ4NzMwNTI2ODQ5NDFjMTU3ZjYzMWJjYTNmODRmY2Q0ZTFjMzRlNzk2MWJkYTBiY2I1OTlhZGM2ZjY3NWIiLCJwYXRoIjoidHlwZVsxXSJ9LHsidmFsdWUiOiI2MDIwNGI2NTA5Mzk0MWEzYmQ4MWI5NGQ2YTYxZjhkNzgzM2Q1MGQyYjQ3OWJiMTY5NWUzNmI4NTMwODkyODYwIiwicGF0aCI6InZhbGlkRnJvbSJ9LHsidmFsdWUiOiJhMWQxMWYwYjEwNDI5OTM1N2Y1OGZlYzI2Y2JmYTkwZTllN2NjMjYyZjIzYmJhMTcwZDU5YzQ3NThiMTBmYTE0IiwicGF0aCI6Im5hbWUifSx7InZhbHVlIjoiMWM1ODQ3MmFjZTE5NWFmZmVlZThkOWU0YmNiMWRlZWIxNzhkZDFiZmE1ZmYwMWJhZmM5ZDNiMjRkZjE2ZGNlMyIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiZmMzM2M0MzYzMDRkM2Y0NTJhMWU3ZDk3NWVkZjJlOWJmZmM5NTQ3NmE4MmJlYjNiOGVlMDg3ZWMxMjVjMjE3ZiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiI0NjVlYzZmYTBkNmJlMzliYjFiODliNzY4Y2VlMTFhMzc3NGRmYTBjM2NjN2MxM2VlMjg4NDc0MmM4NmQyZmFiIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjhlYTI4M2QzY2RkMjI0MjM5YmE0YjBiNDEyNGJlMmI5YWQzMmFiMDAwYWMzNjkyMjVmZDhhZGUwMzU0ZjdjY2IiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiM2NiNDU3ODBkZWY5M2Y5NGY2NzQwZGU0MDBkYzFmNjY2ZmE0YjdkYmQ1YjQ3NmJmNjFkNjUzZTQ3ZmY2YTA1NyIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImZlNzZjNWM2MGQ4YWI4ZDE3NTAxY2Q5YWVmYzczZDk4YWE0MmI0YzUzM2YxOWQxMTUxNTRiMDhjMGIwOWU1ZTkiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy5pZCJ9LHsidmFsdWUiOiJiOGFkYTIxODZhZGY1M2U1ZDg2YmQ3MjI2OTJiODU5ZTZkOTUwYjVjY2M3M2ZkMmFlYTUzZmRhYzQ0NWNiYTczIiwicGF0aCI6ImNyZWRlbnRpYWxTdGF0dXMudHlwZSJ9LHsidmFsdWUiOiJkNjlkZTZiMDZlM2M5YzA1ZDhiYzBiZTY1OWQ1YTY0MWNjNzEyZDIzNGU2ZDkzZTFhZDg2MzAwZjIwYTEwYzk0IiwicGF0aCI6InJlbmRlck1ldGhvZFswXS5pZCJ9LHsidmFsdWUiOiI2YWY1ZWY4ZTliMjFjZDU3NjNkMTg3NGM0ZjIxZTFmZmVjYmEzNWZiMDRhZWFmOWIyYWFjNmMzOTAxYmRkNjFjIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50eXBlIn0seyJ2YWx1ZSI6IjQ0MGQ0MDI4OWM1OWYyNWZkZTcxNDBkOTMyNWIyZWJiYjE2MWVmNmM3YjUyMmVmNDg0OTVhN2FjYTRiNDcxZmYiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnRlbXBsYXRlTmFtZSJ9LHsidmFsdWUiOiIzY2Q0MGExN2U0YzE3ZmRjNjk4OWRiMjRhZjBmNjI3NzQ1ODU5OTAxZmI2MzBlZTdiMTU5MTQ1Zjg1YTVjMzI1IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmlkIn0seyJ2YWx1ZSI6IjhkMTFlMTg3YjY0MDAxNGUwNzA3Y2M4YjM5NGE3ZTE2ZTAyYTQyOGVlZDhhOWRjNjQ5YTI3MTg3ODYwMWRlNmIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QudHlwZVswXSJ9LHsidmFsdWUiOiIyNmFlYmU4MGI5Y2U3YjBiNjVkM2E2NTVhMmNkYTE2NDI3MTkxNmMwZjRmNTE3YTJiMjc5MDg3NGQyYzRkYmZlIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0Lm5hbWUifSx7InZhbHVlIjoiODNlZDJjMmQ2OThkY2QxYTBlNDY2N2QzYWYyMjNmMWViY2Q5YzMxY2U5MDlmNTk0ZmRlOTdkYWEzNWEzY2QxNSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5jbGFzcyJ9LHsidmFsdWUiOiJkZjNmMjY5NzE5YTczYzA1NDc4Y2Q1YTk0MTQwMDVmMjA2NWNhNWNhODg5NGUwNjc2NDllYmEwMzcyNjBmNDgzIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmRlc2NyaXB0aW9uIn0seyJ2YWx1ZSI6ImNjYTVlMTEzN2FiZjc4ZjMzNWIzM2U2MDdiZmY2ZThhZmQzZjJlMmQ5NzZhZmI5YzU4YTU3OThiYTBlOWViZWUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiJiZjZhYjljNDZlNWZmMGQ3MzU3NzYyNTE5NDU2YWViYjVhNTU0YmM0ODQ1NGY3YTJhNTY1N2I0YjI4NDdlMWYxIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmNsYXNzIn0seyJ2YWx1ZSI6IjU1MmY4ZDRjYzEyNGZjMjJiNDEzYjhiNjNjMGFmNzBlYjQwODM0NjE5YzE0NGNhZmZhYjcwMWYwYTUzNjMyYmMiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiYmFlYTk1YTJiZWU1NTc1ZGVjZTMzZmJmMWE4MGFlZjEyZjY1YTFiNjg0ZGQyNDRmNmY1OGYyMmZiMmJhZDg3ZSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5lZmZlY3RpdmVEYXRlIn1d",
    privacy: { obfuscated: [] },
    key: "did:ethr:0xe93502ce1A52C1c0e99A2eB6666263EA53dB0a5e#controller",
    signature:
      "0xfa3bb0c734fd8853b58447cbf64c87198bf8dea6e5da81a325dd74b0105972be77944ef532f45fdbfe463c061462c7cf468025cbdf772200cbf37c76934448ee1b",
  },
} satisfies V4SignedWrappedDocument;
