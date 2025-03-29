import { OAVerifiableCredential, OADigested, OASigned, W3cVerifiableCredential } from "./types";
import { ContextUrl } from "./context";

const ISSUER_ID = "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90" as const;
export const SAMPLE_SIGNING_KEYS = {
  public: `${ISSUER_ID}#controller`,
  private: "0xcd27dc84c82c5814e7edac518edd5f263e7db7f25adb7a1afe13996a95583cf2",
} as const;

/* Raw */
export const RAW_VC_DID = freezeObject({
  "@context": [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4],
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
} satisfies OAVerifiableCredential);

export const RAW_VC_DID_OSCP = freezeObject({
  "@context": [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4],
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
} satisfies OAVerifiableCredential);

export const RAW_BATCHED_VC_DID = freezeObject([
  {
    "@context": [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4],
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
    "@context": [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4],
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
] satisfies OAVerifiableCredential[]);

export const RAW_W3C_VC_TRADETRUST_TRANSFERABLE_RECORDS = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    ContextUrl.oa_vc_v4,
    "https://w3id.org/vc/status-list/2021/v1",
    "https://trustvc.io/context/transferable-records-context.json",
    "https://trustvc.io/context/attachments-context.json",
  ],
  credentialStatus: {
    type: "TransferableRecords",
    tokenNetwork: {
      chain: "MATIC",
      chainId: "80001",
    },
    tokenRegistry: "0xE0a94770B8e969B5D9179d6dA8730B01e19279e2",
    tokenId: "398124e7f1ec797a3dea6322e5ce4ff5ee242ab6293c2acf41a95178dfb27dae",
  },
  id: "urn:uuid:0192d19c-d82c-7cc7-9431-cb495374f43b",
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
  issuer: "did:web:trustvc.github.io:did:1",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
}) satisfies W3cVerifiableCredential;

export const RAW_W3C_VC_TRADETRUST_STATUS_LIST = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    ContextUrl.oa_vc_v4,
    "https://w3id.org/vc/status-list/2021/v1",
    "https://trustvc.io/context/transferable-records-context.json",
    "https://trustvc.io/context/attachments-context.json",
  ],
  credentialStatus: [
    {
      id: "https://trustvc.github.io/did/credentials/statuslist/1#1",
      statusListCredential: "https://trustvc.github.io/did/credentials/statuslist/1",
      statusListIndex: "1",
      statusPurpose: "revocation",
      type: "StatusList2021Entry",
    },
    {
      id: "https://trustvc.github.io/did/credentials/statuslist/1#1",
      statusListCredential: "https://trustvc.github.io/did/credentials/statuslist/1",
      statusListIndex: "1",
      statusPurpose: "suspension",
      type: "StatusList2021Entry",
    },
  ],
  id: "urn:uuid:0192d19c-d82c-7cc7-9431-cb495374f43b",
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
  issuer: "did:web:trustvc.github.io:did:1",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
}) satisfies W3cVerifiableCredential;

/* Digested */
export const DIGESTED_VC_DID = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
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
    { id: "https://demo-renderer.opencerts.io", type: "OpenAttestationEmbeddedRenderer", templateName: "GOVTECH_DEMO" },
  ],
  proof: {
    type: "OpenAttestationHashProof2018",
    proofPurpose: "assertionMethod",
    targetHash: "0b1f90bc8e87cfce8ec49cea60d406291ad130ddedc26e866a8c4f2152747abc",
    proofs: [],
    merkleRoot: "0b1f90bc8e87cfce8ec49cea60d406291ad130ddedc26e866a8c4f2152747abc",
    salts:
      "W3sidmFsdWUiOiJhOGEzMGE4ZTFjNWQ4ODk2NWI3NDZkZjBhYWYyMTMyN2Q4MDNkMzQ4ZThlOGRhMTlmNTNhMWU5ODFkOTFhMDQ0IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjFmMzIwMzg4MjU3NTRkZTc1OGYwYmU2NjdiNjQ0ZjNjZGVkM2FlM2UwOGI0MTdhMmViZTljYmU1NmYyNGM0NTAiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiODQ0OTkwM2FhNDMxZDEzZTEzNTBiYjVhZTczMTM3OTRlMGQyMTMwNmM3NDA0YzI4NzJhY2Y3ZDY2NGIyMjNhZiIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImFkN2Y1Mjg0OTc1MGViNjZhNjJlZmFmYWUwYjQxNGEwZGQ5OGUwNGJkMmI5YzU2NjliYWM1YzRiNDNjMDk3MTMiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJjY2I4ZDFkZDgyMDc2Y2EyOTQ5MWUxZTBjODAxOGM5MWY0Zjc5NGRiM2RkMDA1YmFjMGY4MzM1YmFmODFmZWRkIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiYmNlNzNhMjBlMDNiNmM0ZDM1M2VkY2IzMTM0NzZhOTZhNTRkMGNjYzVkNWQ1OWIzMjRhOWU1YTQ2NjQzZmFiNiIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMjBhMDM0ZjcxMDliNDRmOGEyZTIxMWM1ZTE5YzQ2Nzk1NGY2OWU2NmQzOTZjZjFlYjk1NTViZDc2NjkyN2UyNSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIwNWVmYTdiNWM1MDFhZWIxNTE5NTE0MDczNzdmYjJmODc2MTk1ZTAzYzkwZjUzZTdhYWZjNGMzZmFhNDI1YjhhIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjEzYzE3YjQ5ZTc2YjQ3NjJjZGRiYmRjYjFiZDU2ZmUyNDIyZDEwYmJkMmY2MjAzZGZiNzRkZGRlYjBiZWNkYTMiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiNjBmM2JiMTY1YjhlMzcxOGJhZjQ0ZjVlMTdkNDljY2Y4ZGE5MGViYTMxNjUwZDRjM2IzODlkNmFiZGFiNTViYiIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImY1YjFjYjc3ZTZmNDQwM2NmMmM4NDg1MGIwNTcyMGI5NTk5Yjk0NmUwMWI2MzcwODUzZWY0YzUyYmQwYTZmZjEiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImM3MWM3ZDZjYTdhMjY5OWVhZjdjOTgwYzlmMjM1MWY3NDc3ZDliZDFlNzJlNGY2NTIxZjZhMzI0ZWEzYjdmMWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMDdlODkzMTgyZGFjNjRjOWVkZGU4MjMwYzdjZTdmMWM2NTRmZjgxN2Y5OGIzZTkxMWU4ZTg1Yzc4ODY0MWZhZCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6ImU4YzdmMjQyYTI5YThmYjJiMjEyMjVhYzlmOTk5ZmVhOTNlNmRhYzc5YTNlYjQwYWRlMTc2ZGRmYzFjMmRlMTgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI5ZDNkMThlMTY0YTg3YmQ3MmFlNDczYTIzZjc5ZjBkNzU2NTFiZjExODViMmI0N2ZlYjhiOGFiNWU3YWY1YzUyIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6Ijk4MjIwZTE5NmU4YmE4NWI3MDc2YzdiMzE1MDBkOTU0Nzk1MTk5NDQ4YmM1Y2IyMzM0ZjNhYjU1OTA3NGNkNTMiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiNTNlOTdmNDBkZTExNDkxMjNlNmNlMmNhN2I0MzlhMzI3NzYxMGZkNmZmZTZlMTcwYjEwMjdlOWMzNThmYjg2MSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjA1OTQ1MWQzMWNlZjM5MDg1YWMxNGVkYjE1NjJjYzFkNTE0YmYzZWQ0N2I3YzBkNWM0MjdiYmM0NGNlOGU5YmIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiN2E3YmUzMzMzNjI4MDAyNmVkN2NkZmFlZDkwZWI1Zjg0ZDZiMGVkZjdiNTkxZjk5MjQ3NmYzNDBjMWViZjUzYyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiJkNzMxMDA3NmM1NzZmNzU0MzcwNjQ5MTYxOTEyNWY0YmQ5NDNlMDEwNWM3ZDM1ZjZjNThjZTI3ZjcwMzNiNjliIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiYTk3MzFhMzFkMzkzNmJmNjAyNzMxNTAwYjIzMjY3ZTA2MzcxOGEzZjJkMGFiZTI4MDhlOGJiMzQxODQxYWZlZCIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiNDg4MjRkYjdjY2U3ZTY5MGQ3NjgyMGM1N2M1OWNlZGI5ZDZiNGVjMDlhMDY0ZDFmYTJhMmI0OGZhYzJlN2FhZCIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiJjMzY1M2FkNzg4MzhkNDhmM2Q1ZGNkNmE2OGRmNGU0MmMxMTM1ZmY4MzhiYzI5MTY4NDQzMDdjZDljZmM4ZWY4IiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
    privacy: { obfuscated: [] },
  },
} satisfies OADigested<OAVerifiableCredential>);

export const DIGESTED_VC_DID_OSCP = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
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
  credentialStatus: { id: "https://ocsp-sandbox.openattestation.com", type: "OpenAttestationOcspResponder" },
  renderMethod: [
    { id: "https://demo-renderer.opencerts.io", type: "OpenAttestationEmbeddedRenderer", templateName: "GOVTECH_DEMO" },
  ],
  proof: {
    type: "OpenAttestationHashProof2018",
    proofPurpose: "assertionMethod",
    targetHash: "0f60b3ef4b9b826de4753c4e68bb5ac9fdd2496549f901331a9d07464469366c",
    proofs: [],
    merkleRoot: "0f60b3ef4b9b826de4753c4e68bb5ac9fdd2496549f901331a9d07464469366c",
    salts:
      "W3sidmFsdWUiOiI3N2RhNDUzOWYwY2M3ZmVmODg0ZmU0MTVkNzE2ZTRjODc5N2NiMDMyZGJlZDQzOWM2ZWViOTU2NmJlZDk1MmI0IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImY2NWZhZWI4MzVmZTI4MzYyMDBhZGUyYTUzZjM4MzJkMGE2YTVjZjZiZjc2OGRlNmMxYjE3OTQ1OGIwMGI2MDIiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiMjVkOGNmNDY3MTAzMmMzMTUzZDdlY2I2OTQ1OGU2MzNkZWE0YmYwYTc0MGI4YzZiMDFlYjE5M2I4NzE2ZDYzYSIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImQxNjEyODkzZGI2YjM3MDY0MjgzM2FkNjYwYjQ5N2ZiMTY0ZWZlZTZkNWY0ZDhhMjg0YjkxNWNkNGNhNzJkM2YiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJjZjkzMTg5ZTBjNTE0ZGUwMWJlOTI5ZWRhNjk4ZTdlOWQ5ZmRiMzJlOTVjZTdlOTM1NGM4OWJlYjc3Mzg1NjNkIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiYzgzNzJlYmU2NWJiMzdhOTI0YTljMmZiNGE3Yzc4MmQxMzI1ZjE0NTY3OTFjODJmZmI4NGUwY2FmYWFlMDg2OCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMzg1MzJhNzJiMDA1Njc4Yjc2M2Y0NTdlY2IxZTI1NzhhMDVkYzQ5ZjdlZDhhYzk5N2EyNDJjZWNjNGY3MDcyMiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIzMTQ1OWY5ZmUyNTdkMDVlZTkwNjg4NmYxYmU3ZjBmOTU4YTUxZGM3YTJlNTY5N2EyOGNjZjI3YWVhOGRmNDg4IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6ImVkOTQ0Mzk0ZmQ5YzY3OWI5MDg0MjNmNjJlZWU5M2YxODJmNjdmZmIxM2MxNGM2ODJjZDMyZmNkMTk3MmVlN2IiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYTBjODBhOTI4ZGI3MDExYTI0ODIzYzUzZGJlNjNmNGU5ZTc3M2IyMjkyZWNjOThkMWFiNjZiMjVjYTBmYzY3YiIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6Ijk4Y2JlZjE3NDZkZjM1MmQ5Njg4NmYyYWQ1N2NmOWI5ODg2ZWJhZTJlYzA1ZTM4YWE1YTc5ZTM2YTE2OWY1NGMiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjlhYzhkMzA5ZGEyZGYzNWNhN2RkNDFkYTc3NzRkYzFhNWY4NTE3NmFiNGU3ZGY1MDgzNzBiNDNlNmU2Y2FhNGEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiZjkwYWU2YWVjNzlhODg0OTJkYzFlN2IwYThmNDExYWEwN2Y2YjY5NGMwZjQzNjhhZTMzZWVlNTllYzVhZDM2NyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjBhMWNhMTQwMmI4MDEwNWQzNGY4NmVjZjNjMDgxYTE3ZTVlODhiY2UwN2ZjNzgyMGRkYzdmZDY1OTA5ZDcwM2MiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI2NTk1NGE0ZTNiZGRlNmQ5NGEyYjA4OTQ3YTU3YTdkOWEzYzAwNWEyN2ZmNzA0ZmNjMDI2MDI0MmNkNjczNGI1IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6Ijg3ZDc4NzBjYmVkOGZkYzIyNjA4MWMyZmY5ZmZmNmU3ZmJiZWYyMDUyMDg5YjU1MDg4MDg4MzliNWZlMWNlMGUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiMTgwMzBkZjQ5MzRhMDhlYmM3YTEwNjZlOWRlODZhMDAxYmZhNjcyNWI2Y2FiYjA5NGNmZWI5NzE4YTU3ZDViNiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImUyNWQ1MzFmMTIwNzM0ZWY2ZmY1MTU3MjViYjM5MGJkMjU4MTE2NWM4YTMxZTViMTRmNWUzZTMzM2I2OGZmNWUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiMTNiMjYyN2E4Yzk0YzkwYWI0M2JjZGExNDNkNTI2MDM0YWM0ZDVkNThhMTc2OTIzMDcwZTAzMGM2MTkwOWVlYiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI2YjIzZWZkODVhZjZjZWZkMTBjM2EwNzczNjdlMjE4Mzc1MTlkN2ExYTBhMzVmODFkZDBhNWYzNTA0MTg4NjE4IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiMTI4MzY5ZDk5NTU2ZGYwOWMwOGE4NmZkODU4NmJlMWJlNWVjODcxYjY3NGQwNzJmN2U4ODdmNWZiYjViNjE5NiIsInBhdGgiOiJjcmVkZW50aWFsU3RhdHVzLmlkIn0seyJ2YWx1ZSI6ImYzNTBjOGYwNjlkNmIyM2M3NmE0MjQ3ZTIyOWRjOGM1MDVjMTFhZTNkNjFmYjE3ZDJlNDIxZWU1NzY4OGQ4YTMiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy50eXBlIn0seyJ2YWx1ZSI6IjJkMTUzYzc1OGNiMTY1YjM1MTFhNjA4MjBkMzNiY2ZmYTViNmE3OWFiNWI5ZDNlMTA0NGZiNTk0NjNhNzM3MDUiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6ImJmOGJlY2M2Yjg1MDJkODBiNTg4ZmRmZmJhY2JmMmU1NTIzNjE1MzBjYmUxMGI4NzM5OTQ0NWYwZmZkYTkwOTAiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiOTRmYmI5NWE1ZmNhZjU0YTcwYTAxODZiNjg1OWM5YmY5MzYzNWU0OTQ0N2U3ZmMxYWIyY2RmNTM5ZDllZjNiNyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
    privacy: { obfuscated: [] },
  },
} satisfies OADigested<OAVerifiableCredential>);

export const DIGESTED_BATCHED_VC_DID = freezeObject([
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
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
      type: "OpenAttestationHashProof2018",
      proofPurpose: "assertionMethod",
      targetHash: "d744b98a001ed34fa133762206e312b5105478f0cc25bf86c3a2a35866597264",
      proofs: ["63edb5b6919143505c522fc96d31bac58ce7b4aa57d366d2df2026c5bb425a64"],
      merkleRoot: "aad2420d57f9250aaa4933bc1dfe540575f3b233475c51f173c9299b4a97853b",
      salts:
        "W3sidmFsdWUiOiI5YjBhYWZjZDY0YjZmOTMzZDc3ZDUwY2ExZWMzZTYwYzlkYTYzMjk0Y2NlZWRiYTU3ZDMzZjlkYzQ5MjMyMjA2IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6Ijg0Nzg2MDg5MDNmYjQ0ODQ3NTFhYWM3MGMxZmZjN2E0YTI0OTAyODA5ZTQ3MTI1Y2Q5YWE5ZDMwMTllMjI2MmUiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiZTQ1YjRjYWU1NmI5ZDI5M2M5NDZkM2RhY2U1ZjE0YWNiZmYwYWZkN2QzOWM1MmIxZWY5MTc2MzFlMGFmYzRmNCIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImJkZDczNmU0MDU2YzUyYTYxMTIzMzZiYjNiZGQ3ZTNjMjQ1MTEwZjk3ZTg4Y2NlYjZlMmNlN2M4NTM2MDIzMDYiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJkOGQyYjcwMTExYTYwNzQyYjVjZTkzMGFiYWNhYTk0NDQ2MzJiMjk5ZjNkNzYyZjI5N2Q0ZmY1MjViMTYzMTVlIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiMTMxOTUwZDhhNGQ1ZGM1Y2ZkYjdkODAwZWQzNTBiNmRkZTYwZWI2ZDFkNjBiODM0YmE4YmFmNDc1ODk5ZWMxZCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiYmI1ZWM1YjkyNzRhNjg2Yjg4YzVjOTA5MTYwZDU0ZDkxMjM5MWE2ZTg4NzAwMTZhYzcyNGM1NmMyMDlkMzI4OSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIyYWE0NDFkNzMxZDllYjdiYTU5YTRjYTljZWYzYmMxOGQyYzgyMzE0NmJjY2Y1MjIxYWU0YWRlNzdkYzM3MmU4IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjNhZDllMzc0ZTdhZjYxYWViNWE5ZDNiNzg4M2VlM2YwYjg4NWMyZjk4ZjZkOTM0ZGY4MzkxOGY3M2E1OGYzZDQiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYjM4NDdiYjJiZDE2OTM5YTRhNDM4YjRlNjlhNGFhM2NiNjVlNTdjYTlmNzc5ZDIxN2NhODIwM2Y4MmNhMmUwZSIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjEwYWEyYTVhMmQyMmZlNjliZWJlNGQxMmY4ZmM5ZDViNTk1YTRjYzk2OTE0OGFjZjIzZTgyZmMyZGVkYWMyOGIiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImM2ZDVkY2NmNmFjYmQyODhmOTc0NjhhMWE3M2YyMGE2YTQzZWZjZTdiYTI0YzA0NTg1MGQ2ZThhNmVhMDU0MzYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiZTA5ZmUyYWQxYjgwYTBlYjZkMWQzMzAwNTBlYTU1ZmRmNjMzMWVhZDFjNTFhYTQwOGNlODliOTIzZTdmMTI0MCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjAxZDUyNTMwM2ZmODk0NGExOGVmMjgzMjczNmNmYjdkZmRlNTc2ZDY2NDQzNTBmOTE4OWEyNzZkYTE2YjRkNmIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiIzYWM2NDgzOWZiMDkwMjY0YjFmZjY0NGQ3MDIwODY5YmZiNGFmZDhiYjNjNzdjZWU1ZTc4NWIxZDU2ODBkOGMwIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjBkZWY1MWE2ZmI2MTc4NjI2ZThlYzNiMGQ5MzZkZjY1MTM3MjhiMDM4ZGVhZGFlOTRlNWZkYjk4Nzg0ZDYzZWQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiZTQwNTZkNmI4ODdmMWY2ZDA3ZjdhMWU5MmYxOTZiYWM3NzlhYThmOWE3MzAwM2NlOWIwYjEyNjNhNWYxZWE2MiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImFlMmYzYzg0OTBkMDI2ZWQ0MDdhZDAzOGY5ZWY0NGU1MzM5M2YyN2Q2MmUwMzQ1YTg0OGQ1MGI5YmNmYjgxOTIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiODQ0OGYwYWU3ZDU1NDE1M2NkY2I1YTllOThjNDIyZWRhYzAxNjhiZjQ4YmI5ZDAzMjU2NWMyNjJjYzg1MTVlOSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiIzZDM2MTFmYTQ2NDExNGI5ZGEzMDQ4MzQ3Y2Y1MDBlNmI1NmFiZjdhOTY2MGY3NTg4ZWFlNzVkOTI5ODJiYmY2IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiMzMzMGY1Yzc3MDE0NzE1NGI3NGE4ZWY5ZjAxZDE0YjEwZGU0NGMzY2FlZWY2M2Q2YjkyMDdlYjJiZjEyMGI2MiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiYzgwZDM4MTY4ZDcyMDkxNWM4YzJmZGFmNmYxMDE0MmRlZWJjOTM0MDUyZjNiNTgyMmE2YjM3ZWNlYTBmY2JmYSIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiIyYjllOGFlZGJlNTkwMTRmMTQ4M2RjYjg2NDgwZDljM2M0ZmFlNDY1ODQyZmZlY2I5YjhiNjAwMTc5ZjE3MDQ0IiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
      privacy: { obfuscated: [] },
    },
  },
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
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
      type: "OpenAttestationHashProof2018",
      proofPurpose: "assertionMethod",
      targetHash: "63edb5b6919143505c522fc96d31bac58ce7b4aa57d366d2df2026c5bb425a64",
      proofs: ["d744b98a001ed34fa133762206e312b5105478f0cc25bf86c3a2a35866597264"],
      merkleRoot: "aad2420d57f9250aaa4933bc1dfe540575f3b233475c51f173c9299b4a97853b",
      salts:
        "W3sidmFsdWUiOiJhN2EyZjYyMmMxMjdiMTZlMzIwYjA2MTA1YzZkN2FmMmVlNjZjYjBlNDQ1ZTdhNzA0NzExMzQ0OTZjZDM5YmVlIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6Ijg4NmI1OGExZTI2Yzg5NjYxMjI4MDBiZGY2NTMxNDQwMmZiNmJkYjkxNGNlMDQzOWJiNWQ3ODM4OWI5N2NlNjciLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiOTk0MjRlMmY1YWE0NjVlNTM3YWE4NDY2ODM2OGQ3YTJjYTFmODg5YTlmOWFlNDk1YzA1ZDM5ZTMzNzY0ZmI3YyIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImY1N2ViM2M2ODQ5NjRiMWQ2ZDZjNWQ1MTY1NjI1MjY4MTUwZjg3OTM3YWQ0NjYzZGQyYjhlZWUyNWFjYTBmMmYiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiIyZGQ4Yzk5N2EwYTliODFlNDgyM2IxMDc4MWEwODk0MTRiMTFmODk4MjNjMTdkNWUzYmM1OGIzZTYyNGY5MTBjIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiY2ExYmVlODNkMjQwNGVjMGQ5NjQwM2Y5ZDQ0N2RiMWY3NGRlMmJlMTZhYzdiNGUwYWZmNzdhYjU4ZDFmZmE2MyIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiY2RjMjc3MjQ2ZTEyN2I5M2MxYzczN2VlNWJmNDk5ZTI1Y2MyNTYxY2VmOTAyNWQ1NzEyNWJhNjc1NzQxOGJhYiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiI0N2U1ZjdkNWQxMzEwZDEwYTk3OGUxMzM1Yjc1NjNkZTMyYTEwMjRmOTdmYjU0YWZmM2JiYjQ3ZDgzNmViNmNlIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjlhY2I1ZDc1ZmIxMmEyMTg1ODkxNjUzODViN2MxMmQzYmM1ZGY3MzJlMmRjNzg5MmRjZDQ3NDRjNzhhNDRmN2EiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiZjM0OGZjYTU1MTg0MzA0Y2E3NDMxMzBjYzc5N2IwZGE4MjVmZTZiMjkxZTZjNTczMGNmOGU5OTNhZmI2OTRiNyIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjE1YmRjOGFiN2MyOTZiZDc1OGI0OGU1NTcwMDQ1ZGFiNjI3NmE1MWU4MGIxOGQwODM1ZjBkMDkxZTU2M2Y5MzgiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjA2MGVkMTMxMTE3YzM1NjhkY2VmOTRhMzE4ZTc0ZGJlYzIyNTlhZjYwNDI2YTdkZjU0ODQ2OTY4YWU2MTU0YWIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiNDcyZjgwYzY0OGMxOWNhNTUxNDIxZDVlYmUyYzBmZDA2ZDlkNDFjMTdkZGJjNzUyYTdlODM0MTJiYTIwMWQyNSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjBkOWI4NTVkNzk4NWI4YTBkMmM3NGI4NmNkMWRhOGZkNTgwZDMzYzRiNzMxMzcxM2FhMDk5NWI4ODFhOTg4MTUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJmMDc1YmIyZGE3Yzc1YjE5OWJiYzYyYmNmOTVhNjcxNDFhM2EwYWU3MTRjYzU5NGI3MDFmYmQ2OWZlY2NhNTljIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImMxOWMzODk0NWVmODc5MzhhNjJmYjM4NGY3ODY3ODIzMzA2NjU5YTEwYzVjNGRhZGQxNjI5MzcyMDIyYWMxZjUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiOGZlNWM5ZDQ5ZGY0ZmNlMGY5OWIyZmM2ODNkYWE3ZTE2MmRmMDZkMTYzODE4MGViOWVjYWEzMDY3Y2I2ODg1NyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjFmNWM5ZWJmZjQ5ZDQzMDc3M2FkMGJiMjQ2NTExNDg4MTM3NTk3N2I3Y2I2OThmNzkxNjg4ODQ0ZjRiMWFmNjkiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6IjQ2YzhjOGEyMWU0OGQzZjlhZGM3OTBmMDRjNDI0NzkwZTRmZmEwMWE5YjMwNTBlNWVlMGJlMWJhZmQzNTIxZDMiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiY2U5OGFhMDI3NDg1N2RlNWY0YTRhYjI4ZmVjMDBmZjlmMTY2YzJiYWNjODMyYzkwNDlmNTliZTc3YTUwNmQ1YiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
      privacy: { obfuscated: [] },
    },
  },
] satisfies OADigested<OAVerifiableCredential>[]);

/* Signed */
export const SIGNED_VC_DID = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
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
    { id: "https://demo-renderer.opencerts.io", type: "OpenAttestationEmbeddedRenderer", templateName: "GOVTECH_DEMO" },
  ],
  proof: {
    type: "OpenAttestationHashProof2018",
    proofPurpose: "assertionMethod",
    targetHash: "0b1f90bc8e87cfce8ec49cea60d406291ad130ddedc26e866a8c4f2152747abc",
    proofs: [],
    merkleRoot: "0b1f90bc8e87cfce8ec49cea60d406291ad130ddedc26e866a8c4f2152747abc",
    salts:
      "W3sidmFsdWUiOiJhOGEzMGE4ZTFjNWQ4ODk2NWI3NDZkZjBhYWYyMTMyN2Q4MDNkMzQ4ZThlOGRhMTlmNTNhMWU5ODFkOTFhMDQ0IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjFmMzIwMzg4MjU3NTRkZTc1OGYwYmU2NjdiNjQ0ZjNjZGVkM2FlM2UwOGI0MTdhMmViZTljYmU1NmYyNGM0NTAiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiODQ0OTkwM2FhNDMxZDEzZTEzNTBiYjVhZTczMTM3OTRlMGQyMTMwNmM3NDA0YzI4NzJhY2Y3ZDY2NGIyMjNhZiIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImFkN2Y1Mjg0OTc1MGViNjZhNjJlZmFmYWUwYjQxNGEwZGQ5OGUwNGJkMmI5YzU2NjliYWM1YzRiNDNjMDk3MTMiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJjY2I4ZDFkZDgyMDc2Y2EyOTQ5MWUxZTBjODAxOGM5MWY0Zjc5NGRiM2RkMDA1YmFjMGY4MzM1YmFmODFmZWRkIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiYmNlNzNhMjBlMDNiNmM0ZDM1M2VkY2IzMTM0NzZhOTZhNTRkMGNjYzVkNWQ1OWIzMjRhOWU1YTQ2NjQzZmFiNiIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMjBhMDM0ZjcxMDliNDRmOGEyZTIxMWM1ZTE5YzQ2Nzk1NGY2OWU2NmQzOTZjZjFlYjk1NTViZDc2NjkyN2UyNSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIwNWVmYTdiNWM1MDFhZWIxNTE5NTE0MDczNzdmYjJmODc2MTk1ZTAzYzkwZjUzZTdhYWZjNGMzZmFhNDI1YjhhIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjEzYzE3YjQ5ZTc2YjQ3NjJjZGRiYmRjYjFiZDU2ZmUyNDIyZDEwYmJkMmY2MjAzZGZiNzRkZGRlYjBiZWNkYTMiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiNjBmM2JiMTY1YjhlMzcxOGJhZjQ0ZjVlMTdkNDljY2Y4ZGE5MGViYTMxNjUwZDRjM2IzODlkNmFiZGFiNTViYiIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImY1YjFjYjc3ZTZmNDQwM2NmMmM4NDg1MGIwNTcyMGI5NTk5Yjk0NmUwMWI2MzcwODUzZWY0YzUyYmQwYTZmZjEiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImM3MWM3ZDZjYTdhMjY5OWVhZjdjOTgwYzlmMjM1MWY3NDc3ZDliZDFlNzJlNGY2NTIxZjZhMzI0ZWEzYjdmMWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMDdlODkzMTgyZGFjNjRjOWVkZGU4MjMwYzdjZTdmMWM2NTRmZjgxN2Y5OGIzZTkxMWU4ZTg1Yzc4ODY0MWZhZCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6ImU4YzdmMjQyYTI5YThmYjJiMjEyMjVhYzlmOTk5ZmVhOTNlNmRhYzc5YTNlYjQwYWRlMTc2ZGRmYzFjMmRlMTgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI5ZDNkMThlMTY0YTg3YmQ3MmFlNDczYTIzZjc5ZjBkNzU2NTFiZjExODViMmI0N2ZlYjhiOGFiNWU3YWY1YzUyIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6Ijk4MjIwZTE5NmU4YmE4NWI3MDc2YzdiMzE1MDBkOTU0Nzk1MTk5NDQ4YmM1Y2IyMzM0ZjNhYjU1OTA3NGNkNTMiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiNTNlOTdmNDBkZTExNDkxMjNlNmNlMmNhN2I0MzlhMzI3NzYxMGZkNmZmZTZlMTcwYjEwMjdlOWMzNThmYjg2MSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjA1OTQ1MWQzMWNlZjM5MDg1YWMxNGVkYjE1NjJjYzFkNTE0YmYzZWQ0N2I3YzBkNWM0MjdiYmM0NGNlOGU5YmIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiN2E3YmUzMzMzNjI4MDAyNmVkN2NkZmFlZDkwZWI1Zjg0ZDZiMGVkZjdiNTkxZjk5MjQ3NmYzNDBjMWViZjUzYyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiJkNzMxMDA3NmM1NzZmNzU0MzcwNjQ5MTYxOTEyNWY0YmQ5NDNlMDEwNWM3ZDM1ZjZjNThjZTI3ZjcwMzNiNjliIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiYTk3MzFhMzFkMzkzNmJmNjAyNzMxNTAwYjIzMjY3ZTA2MzcxOGEzZjJkMGFiZTI4MDhlOGJiMzQxODQxYWZlZCIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiNDg4MjRkYjdjY2U3ZTY5MGQ3NjgyMGM1N2M1OWNlZGI5ZDZiNGVjMDlhMDY0ZDFmYTJhMmI0OGZhYzJlN2FhZCIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiJjMzY1M2FkNzg4MzhkNDhmM2Q1ZGNkNmE2OGRmNGU0MmMxMTM1ZmY4MzhiYzI5MTY4NDQzMDdjZDljZmM4ZWY4IiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
    privacy: { obfuscated: [] },
    key: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
    signature:
      "0x949b76d8df493a56c1cf21303a74d6a54904461c1c10f4619b43ad7d339c64467c61eb4c0873f279cd21d5bdd044d3af5318f14d63f57acbd4cde30f271f3eb71c",
  },
} satisfies OASigned<OAVerifiableCredential>);

export const SIGNED_VC_DID_OSCP = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
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
  credentialStatus: { id: "https://ocsp-sandbox.openattestation.com", type: "OpenAttestationOcspResponder" },
  renderMethod: [
    { id: "https://demo-renderer.opencerts.io", type: "OpenAttestationEmbeddedRenderer", templateName: "GOVTECH_DEMO" },
  ],
  proof: {
    type: "OpenAttestationHashProof2018",
    proofPurpose: "assertionMethod",
    targetHash: "0f60b3ef4b9b826de4753c4e68bb5ac9fdd2496549f901331a9d07464469366c",
    proofs: [],
    merkleRoot: "0f60b3ef4b9b826de4753c4e68bb5ac9fdd2496549f901331a9d07464469366c",
    salts:
      "W3sidmFsdWUiOiI3N2RhNDUzOWYwY2M3ZmVmODg0ZmU0MTVkNzE2ZTRjODc5N2NiMDMyZGJlZDQzOWM2ZWViOTU2NmJlZDk1MmI0IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImY2NWZhZWI4MzVmZTI4MzYyMDBhZGUyYTUzZjM4MzJkMGE2YTVjZjZiZjc2OGRlNmMxYjE3OTQ1OGIwMGI2MDIiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiMjVkOGNmNDY3MTAzMmMzMTUzZDdlY2I2OTQ1OGU2MzNkZWE0YmYwYTc0MGI4YzZiMDFlYjE5M2I4NzE2ZDYzYSIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImQxNjEyODkzZGI2YjM3MDY0MjgzM2FkNjYwYjQ5N2ZiMTY0ZWZlZTZkNWY0ZDhhMjg0YjkxNWNkNGNhNzJkM2YiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJjZjkzMTg5ZTBjNTE0ZGUwMWJlOTI5ZWRhNjk4ZTdlOWQ5ZmRiMzJlOTVjZTdlOTM1NGM4OWJlYjc3Mzg1NjNkIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiYzgzNzJlYmU2NWJiMzdhOTI0YTljMmZiNGE3Yzc4MmQxMzI1ZjE0NTY3OTFjODJmZmI4NGUwY2FmYWFlMDg2OCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMzg1MzJhNzJiMDA1Njc4Yjc2M2Y0NTdlY2IxZTI1NzhhMDVkYzQ5ZjdlZDhhYzk5N2EyNDJjZWNjNGY3MDcyMiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIzMTQ1OWY5ZmUyNTdkMDVlZTkwNjg4NmYxYmU3ZjBmOTU4YTUxZGM3YTJlNTY5N2EyOGNjZjI3YWVhOGRmNDg4IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6ImVkOTQ0Mzk0ZmQ5YzY3OWI5MDg0MjNmNjJlZWU5M2YxODJmNjdmZmIxM2MxNGM2ODJjZDMyZmNkMTk3MmVlN2IiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYTBjODBhOTI4ZGI3MDExYTI0ODIzYzUzZGJlNjNmNGU5ZTc3M2IyMjkyZWNjOThkMWFiNjZiMjVjYTBmYzY3YiIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6Ijk4Y2JlZjE3NDZkZjM1MmQ5Njg4NmYyYWQ1N2NmOWI5ODg2ZWJhZTJlYzA1ZTM4YWE1YTc5ZTM2YTE2OWY1NGMiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjlhYzhkMzA5ZGEyZGYzNWNhN2RkNDFkYTc3NzRkYzFhNWY4NTE3NmFiNGU3ZGY1MDgzNzBiNDNlNmU2Y2FhNGEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiZjkwYWU2YWVjNzlhODg0OTJkYzFlN2IwYThmNDExYWEwN2Y2YjY5NGMwZjQzNjhhZTMzZWVlNTllYzVhZDM2NyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjBhMWNhMTQwMmI4MDEwNWQzNGY4NmVjZjNjMDgxYTE3ZTVlODhiY2UwN2ZjNzgyMGRkYzdmZDY1OTA5ZDcwM2MiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI2NTk1NGE0ZTNiZGRlNmQ5NGEyYjA4OTQ3YTU3YTdkOWEzYzAwNWEyN2ZmNzA0ZmNjMDI2MDI0MmNkNjczNGI1IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6Ijg3ZDc4NzBjYmVkOGZkYzIyNjA4MWMyZmY5ZmZmNmU3ZmJiZWYyMDUyMDg5YjU1MDg4MDg4MzliNWZlMWNlMGUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiMTgwMzBkZjQ5MzRhMDhlYmM3YTEwNjZlOWRlODZhMDAxYmZhNjcyNWI2Y2FiYjA5NGNmZWI5NzE4YTU3ZDViNiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImUyNWQ1MzFmMTIwNzM0ZWY2ZmY1MTU3MjViYjM5MGJkMjU4MTE2NWM4YTMxZTViMTRmNWUzZTMzM2I2OGZmNWUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiMTNiMjYyN2E4Yzk0YzkwYWI0M2JjZGExNDNkNTI2MDM0YWM0ZDVkNThhMTc2OTIzMDcwZTAzMGM2MTkwOWVlYiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI2YjIzZWZkODVhZjZjZWZkMTBjM2EwNzczNjdlMjE4Mzc1MTlkN2ExYTBhMzVmODFkZDBhNWYzNTA0MTg4NjE4IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiMTI4MzY5ZDk5NTU2ZGYwOWMwOGE4NmZkODU4NmJlMWJlNWVjODcxYjY3NGQwNzJmN2U4ODdmNWZiYjViNjE5NiIsInBhdGgiOiJjcmVkZW50aWFsU3RhdHVzLmlkIn0seyJ2YWx1ZSI6ImYzNTBjOGYwNjlkNmIyM2M3NmE0MjQ3ZTIyOWRjOGM1MDVjMTFhZTNkNjFmYjE3ZDJlNDIxZWU1NzY4OGQ4YTMiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy50eXBlIn0seyJ2YWx1ZSI6IjJkMTUzYzc1OGNiMTY1YjM1MTFhNjA4MjBkMzNiY2ZmYTViNmE3OWFiNWI5ZDNlMTA0NGZiNTk0NjNhNzM3MDUiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6ImJmOGJlY2M2Yjg1MDJkODBiNTg4ZmRmZmJhY2JmMmU1NTIzNjE1MzBjYmUxMGI4NzM5OTQ0NWYwZmZkYTkwOTAiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiOTRmYmI5NWE1ZmNhZjU0YTcwYTAxODZiNjg1OWM5YmY5MzYzNWU0OTQ0N2U3ZmMxYWIyY2RmNTM5ZDllZjNiNyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
    privacy: { obfuscated: [] },
    key: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
    signature:
      "0xa9f89c00bac009044f02ca0e0c605389a927e4b011fa7c0f9a3bfd987598d8a442cd51218a31e387737ad42adeb9b9405c545a4d70ad75d06f7a7701e87440631c",
  },
} satisfies OASigned<OAVerifiableCredential>);

export const SIGNED_VC_DID_OBFUSCATED = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
  ],
  name: "Republic of Singapore Driving Licence",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
  },
  validFrom: "2021-03-08T12:00:00+08:00",
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
    type: "OpenAttestationHashProof2018",
    proofPurpose: "assertionMethod",
    targetHash: "0b1f90bc8e87cfce8ec49cea60d406291ad130ddedc26e866a8c4f2152747abc",
    proofs: [],
    merkleRoot: "0b1f90bc8e87cfce8ec49cea60d406291ad130ddedc26e866a8c4f2152747abc",
    salts:
      "W3sidmFsdWUiOiJhOGEzMGE4ZTFjNWQ4ODk2NWI3NDZkZjBhYWYyMTMyN2Q4MDNkMzQ4ZThlOGRhMTlmNTNhMWU5ODFkOTFhMDQ0IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6IjFmMzIwMzg4MjU3NTRkZTc1OGYwYmU2NjdiNjQ0ZjNjZGVkM2FlM2UwOGI0MTdhMmViZTljYmU1NmYyNGM0NTAiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiODQ0OTkwM2FhNDMxZDEzZTEzNTBiYjVhZTczMTM3OTRlMGQyMTMwNmM3NDA0YzI4NzJhY2Y3ZDY2NGIyMjNhZiIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImFkN2Y1Mjg0OTc1MGViNjZhNjJlZmFmYWUwYjQxNGEwZGQ5OGUwNGJkMmI5YzU2NjliYWM1YzRiNDNjMDk3MTMiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJjY2I4ZDFkZDgyMDc2Y2EyOTQ5MWUxZTBjODAxOGM5MWY0Zjc5NGRiM2RkMDA1YmFjMGY4MzM1YmFmODFmZWRkIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiYmNlNzNhMjBlMDNiNmM0ZDM1M2VkY2IzMTM0NzZhOTZhNTRkMGNjYzVkNWQ1OWIzMjRhOWU1YTQ2NjQzZmFiNiIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMjBhMDM0ZjcxMDliNDRmOGEyZTIxMWM1ZTE5YzQ2Nzk1NGY2OWU2NmQzOTZjZjFlYjk1NTViZDc2NjkyN2UyNSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIwNWVmYTdiNWM1MDFhZWIxNTE5NTE0MDczNzdmYjJmODc2MTk1ZTAzYzkwZjUzZTdhYWZjNGMzZmFhNDI1YjhhIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjEzYzE3YjQ5ZTc2YjQ3NjJjZGRiYmRjYjFiZDU2ZmUyNDIyZDEwYmJkMmY2MjAzZGZiNzRkZGRlYjBiZWNkYTMiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiNjBmM2JiMTY1YjhlMzcxOGJhZjQ0ZjVlMTdkNDljY2Y4ZGE5MGViYTMxNjUwZDRjM2IzODlkNmFiZGFiNTViYiIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6ImY1YjFjYjc3ZTZmNDQwM2NmMmM4NDg1MGIwNTcyMGI5NTk5Yjk0NmUwMWI2MzcwODUzZWY0YzUyYmQwYTZmZjEiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImM3MWM3ZDZjYTdhMjY5OWVhZjdjOTgwYzlmMjM1MWY3NDc3ZDliZDFlNzJlNGY2NTIxZjZhMzI0ZWEzYjdmMWYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMDdlODkzMTgyZGFjNjRjOWVkZGU4MjMwYzdjZTdmMWM2NTRmZjgxN2Y5OGIzZTkxMWU4ZTg1Yzc4ODY0MWZhZCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6ImU4YzdmMjQyYTI5YThmYjJiMjEyMjVhYzlmOTk5ZmVhOTNlNmRhYzc5YTNlYjQwYWRlMTc2ZGRmYzFjMmRlMTgiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI5ZDNkMThlMTY0YTg3YmQ3MmFlNDczYTIzZjc5ZjBkNzU2NTFiZjExODViMmI0N2ZlYjhiOGFiNWU3YWY1YzUyIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjUzZTk3ZjQwZGUxMTQ5MTIzZTZjZTJjYTdiNDM5YTMyNzc2MTBmZDZmZmU2ZTE3MGIxMDI3ZTljMzU4ZmI4NjEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZWZmZWN0aXZlRGF0ZSJ9LHsidmFsdWUiOiIwNTk0NTFkMzFjZWYzOTA4NWFjMTRlZGIxNTYyY2MxZDUxNGJmM2VkNDdiN2MwZDVjNDI3YmJjNDRjZThlOWJiIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmNsYXNzIn0seyJ2YWx1ZSI6IjdhN2JlMzMzMzYyODAwMjZlZDdjZGZhZWQ5MGViNWY4NGQ2YjBlZGY3YjU5MWY5OTI0NzZmMzQwYzFlYmY1M2MiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiZDczMTAwNzZjNTc2Zjc1NDM3MDY0OTE2MTkxMjVmNGJkOTQzZTAxMDVjN2QzNWY2YzU4Y2UyN2Y3MDMzYjY5YiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImE5NzMxYTMxZDM5MzZiZjYwMjczMTUwMGIyMzI2N2UwNjM3MThhM2YyZDBhYmUyODA4ZThiYjM0MTg0MWFmZWQiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6IjQ4ODI0ZGI3Y2NlN2U2OTBkNzY4MjBjNTdjNTljZWRiOWQ2YjRlYzA5YTA2NGQxZmEyYTJiNDhmYWMyZTdhYWQiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiYzM2NTNhZDc4ODM4ZDQ4ZjNkNWRjZDZhNjhkZjRlNDJjMTEzNWZmODM4YmMyOTE2ODQ0MzA3Y2Q5Y2ZjOGVmOCIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
    privacy: { obfuscated: ["7f2ecdae29b49b3a971d5acdfbbf9225a193e735ce41b89b0d84cca801794fc9"] },
    key: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
    signature:
      "0x949b76d8df493a56c1cf21303a74d6a54904461c1c10f4619b43ad7d339c64467c61eb4c0873f279cd21d5bdd044d3af5318f14d63f57acbd4cde30f271f3eb71c",
  },
  renderMethod: [
    { id: "https://demo-renderer.opencerts.io", type: "OpenAttestationEmbeddedRenderer", templateName: "GOVTECH_DEMO" },
  ],
} satisfies OASigned<OAVerifiableCredential>);

export const SIGNED_BATCHED_VC_DID = freezeObject([
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
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
      type: "OpenAttestationHashProof2018",
      proofPurpose: "assertionMethod",
      targetHash: "d744b98a001ed34fa133762206e312b5105478f0cc25bf86c3a2a35866597264",
      proofs: ["63edb5b6919143505c522fc96d31bac58ce7b4aa57d366d2df2026c5bb425a64"],
      merkleRoot: "aad2420d57f9250aaa4933bc1dfe540575f3b233475c51f173c9299b4a97853b",
      salts:
        "W3sidmFsdWUiOiI5YjBhYWZjZDY0YjZmOTMzZDc3ZDUwY2ExZWMzZTYwYzlkYTYzMjk0Y2NlZWRiYTU3ZDMzZjlkYzQ5MjMyMjA2IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6Ijg0Nzg2MDg5MDNmYjQ0ODQ3NTFhYWM3MGMxZmZjN2E0YTI0OTAyODA5ZTQ3MTI1Y2Q5YWE5ZDMwMTllMjI2MmUiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiZTQ1YjRjYWU1NmI5ZDI5M2M5NDZkM2RhY2U1ZjE0YWNiZmYwYWZkN2QzOWM1MmIxZWY5MTc2MzFlMGFmYzRmNCIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImJkZDczNmU0MDU2YzUyYTYxMTIzMzZiYjNiZGQ3ZTNjMjQ1MTEwZjk3ZTg4Y2NlYjZlMmNlN2M4NTM2MDIzMDYiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJkOGQyYjcwMTExYTYwNzQyYjVjZTkzMGFiYWNhYTk0NDQ2MzJiMjk5ZjNkNzYyZjI5N2Q0ZmY1MjViMTYzMTVlIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiMTMxOTUwZDhhNGQ1ZGM1Y2ZkYjdkODAwZWQzNTBiNmRkZTYwZWI2ZDFkNjBiODM0YmE4YmFmNDc1ODk5ZWMxZCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiYmI1ZWM1YjkyNzRhNjg2Yjg4YzVjOTA5MTYwZDU0ZDkxMjM5MWE2ZTg4NzAwMTZhYzcyNGM1NmMyMDlkMzI4OSIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIyYWE0NDFkNzMxZDllYjdiYTU5YTRjYTljZWYzYmMxOGQyYzgyMzE0NmJjY2Y1MjIxYWU0YWRlNzdkYzM3MmU4IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjNhZDllMzc0ZTdhZjYxYWViNWE5ZDNiNzg4M2VlM2YwYjg4NWMyZjk4ZjZkOTM0ZGY4MzkxOGY3M2E1OGYzZDQiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYjM4NDdiYjJiZDE2OTM5YTRhNDM4YjRlNjlhNGFhM2NiNjVlNTdjYTlmNzc5ZDIxN2NhODIwM2Y4MmNhMmUwZSIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjEwYWEyYTVhMmQyMmZlNjliZWJlNGQxMmY4ZmM5ZDViNTk1YTRjYzk2OTE0OGFjZjIzZTgyZmMyZGVkYWMyOGIiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6ImM2ZDVkY2NmNmFjYmQyODhmOTc0NjhhMWE3M2YyMGE2YTQzZWZjZTdiYTI0YzA0NTg1MGQ2ZThhNmVhMDU0MzYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiZTA5ZmUyYWQxYjgwYTBlYjZkMWQzMzAwNTBlYTU1ZmRmNjMzMWVhZDFjNTFhYTQwOGNlODliOTIzZTdmMTI0MCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjAxZDUyNTMwM2ZmODk0NGExOGVmMjgzMjczNmNmYjdkZmRlNTc2ZDY2NDQzNTBmOTE4OWEyNzZkYTE2YjRkNmIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiIzYWM2NDgzOWZiMDkwMjY0YjFmZjY0NGQ3MDIwODY5YmZiNGFmZDhiYjNjNzdjZWU1ZTc4NWIxZDU2ODBkOGMwIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjBkZWY1MWE2ZmI2MTc4NjI2ZThlYzNiMGQ5MzZkZjY1MTM3MjhiMDM4ZGVhZGFlOTRlNWZkYjk4Nzg0ZDYzZWQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiZTQwNTZkNmI4ODdmMWY2ZDA3ZjdhMWU5MmYxOTZiYWM3NzlhYThmOWE3MzAwM2NlOWIwYjEyNjNhNWYxZWE2MiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImFlMmYzYzg0OTBkMDI2ZWQ0MDdhZDAzOGY5ZWY0NGU1MzM5M2YyN2Q2MmUwMzQ1YTg0OGQ1MGI5YmNmYjgxOTIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiODQ0OGYwYWU3ZDU1NDE1M2NkY2I1YTllOThjNDIyZWRhYzAxNjhiZjQ4YmI5ZDAzMjU2NWMyNjJjYzg1MTVlOSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiIzZDM2MTFmYTQ2NDExNGI5ZGEzMDQ4MzQ3Y2Y1MDBlNmI1NmFiZjdhOTY2MGY3NTg4ZWFlNzVkOTI5ODJiYmY2IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiMzMzMGY1Yzc3MDE0NzE1NGI3NGE4ZWY5ZjAxZDE0YjEwZGU0NGMzY2FlZWY2M2Q2YjkyMDdlYjJiZjEyMGI2MiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0uaWQifSx7InZhbHVlIjoiYzgwZDM4MTY4ZDcyMDkxNWM4YzJmZGFmNmYxMDE0MmRlZWJjOTM0MDUyZjNiNTgyMmE2YjM3ZWNlYTBmY2JmYSIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udHlwZSJ9LHsidmFsdWUiOiIyYjllOGFlZGJlNTkwMTRmMTQ4M2RjYjg2NDgwZDljM2M0ZmFlNDY1ODQyZmZlY2I5YjhiNjAwMTc5ZjE3MDQ0IiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50ZW1wbGF0ZU5hbWUifV0=",
      privacy: { obfuscated: [] },
      key: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
      signature:
        "0xc65309e0adf50ba6b91607c6913e15cd629412cf8180255e52c160cdf59bcfa0609f6eed71c379e3062b9fea39a5590dfc54323a352933c6ef9b694b63e2d74f1c",
    },
  },
  {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
    ],
    name: "Republic of Singapore Driving Licence",
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuer: {
      id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
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
      type: "OpenAttestationHashProof2018",
      proofPurpose: "assertionMethod",
      targetHash: "63edb5b6919143505c522fc96d31bac58ce7b4aa57d366d2df2026c5bb425a64",
      proofs: ["d744b98a001ed34fa133762206e312b5105478f0cc25bf86c3a2a35866597264"],
      merkleRoot: "aad2420d57f9250aaa4933bc1dfe540575f3b233475c51f173c9299b4a97853b",
      salts:
        "W3sidmFsdWUiOiJhN2EyZjYyMmMxMjdiMTZlMzIwYjA2MTA1YzZkN2FmMmVlNjZjYjBlNDQ1ZTdhNzA0NzExMzQ0OTZjZDM5YmVlIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6Ijg4NmI1OGExZTI2Yzg5NjYxMjI4MDBiZGY2NTMxNDQwMmZiNmJkYjkxNGNlMDQzOWJiNWQ3ODM4OWI5N2NlNjciLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiOTk0MjRlMmY1YWE0NjVlNTM3YWE4NDY2ODM2OGQ3YTJjYTFmODg5YTlmOWFlNDk1YzA1ZDM5ZTMzNzY0ZmI3YyIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImY1N2ViM2M2ODQ5NjRiMWQ2ZDZjNWQ1MTY1NjI1MjY4MTUwZjg3OTM3YWQ0NjYzZGQyYjhlZWUyNWFjYTBmMmYiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiIyZGQ4Yzk5N2EwYTliODFlNDgyM2IxMDc4MWEwODk0MTRiMTFmODk4MjNjMTdkNWUzYmM1OGIzZTYyNGY5MTBjIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiY2ExYmVlODNkMjQwNGVjMGQ5NjQwM2Y5ZDQ0N2RiMWY3NGRlMmJlMTZhYzdiNGUwYWZmNzdhYjU4ZDFmZmE2MyIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiY2RjMjc3MjQ2ZTEyN2I5M2MxYzczN2VlNWJmNDk5ZTI1Y2MyNTYxY2VmOTAyNWQ1NzEyNWJhNjc1NzQxOGJhYiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiI0N2U1ZjdkNWQxMzEwZDEwYTk3OGUxMzM1Yjc1NjNkZTMyYTEwMjRmOTdmYjU0YWZmM2JiYjQ3ZDgzNmViNmNlIiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6IjlhY2I1ZDc1ZmIxMmEyMTg1ODkxNjUzODViN2MxMmQzYmM1ZGY3MzJlMmRjNzg5MmRjZDQ3NDRjNzhhNDRmN2EiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiZjM0OGZjYTU1MTg0MzA0Y2E3NDMxMzBjYzc5N2IwZGE4MjVmZTZiMjkxZTZjNTczMGNmOGU5OTNhZmI2OTRiNyIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6IjE1YmRjOGFiN2MyOTZiZDc1OGI0OGU1NTcwMDQ1ZGFiNjI3NmE1MWU4MGIxOGQwODM1ZjBkMDkxZTU2M2Y5MzgiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjA2MGVkMTMxMTE3YzM1NjhkY2VmOTRhMzE4ZTc0ZGJlYzIyNTlhZjYwNDI2YTdkZjU0ODQ2OTY4YWU2MTU0YWIiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiNDcyZjgwYzY0OGMxOWNhNTUxNDIxZDVlYmUyYzBmZDA2ZDlkNDFjMTdkZGJjNzUyYTdlODM0MTJiYTIwMWQyNSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjBkOWI4NTVkNzk4NWI4YTBkMmM3NGI4NmNkMWRhOGZkNTgwZDMzYzRiNzMxMzcxM2FhMDk5NWI4ODFhOTg4MTUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiJmMDc1YmIyZGE3Yzc1YjE5OWJiYzYyYmNmOTVhNjcxNDFhM2EwYWU3MTRjYzU5NGI3MDFmYmQ2OWZlY2NhNTljIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6ImMxOWMzODk0NWVmODc5MzhhNjJmYjM4NGY3ODY3ODIzMzA2NjU5YTEwYzVjNGRhZGQxNjI5MzcyMDIyYWMxZjUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiOGZlNWM5ZDQ5ZGY0ZmNlMGY5OWIyZmM2ODNkYWE3ZTE2MmRmMDZkMTYzODE4MGViOWVjYWEzMDY3Y2I2ODg1NyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjFmNWM5ZWJmZjQ5ZDQzMDc3M2FkMGJiMjQ2NTExNDg4MTM3NTk3N2I3Y2I2OThmNzkxNjg4ODQ0ZjRiMWFmNjkiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6IjQ2YzhjOGEyMWU0OGQzZjlhZGM3OTBmMDRjNDI0NzkwZTRmZmEwMWE5YjMwNTBlNWVlMGJlMWJhZmQzNTIxZDMiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiY2U5OGFhMDI3NDg1N2RlNWY0YTRhYjI4ZmVjMDBmZjlmMTY2YzJiYWNjODMyYzkwNDlmNTliZTc3YTUwNmQ1YiIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
      privacy: { obfuscated: [] },
      key: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
      signature:
        "0xc65309e0adf50ba6b91607c6913e15cd629412cf8180255e52c160cdf59bcfa0609f6eed71c379e3062b9fea39a5590dfc54323a352933c6ef9b694b63e2d74f1c",
    },
  },
] satisfies OASigned<OAVerifiableCredential>[]);

export const SIGNED_W3C_VC_TRADETRUST_STATUS_LIST = freezeObject({
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
    "https://w3id.org/vc/status-list/2021/v1",
    "https://trustvc.io/context/transferable-records-context.json",
    "https://trustvc.io/context/attachments-context.json",
  ],
  credentialStatus: [
    {
      id: "https://trustvc.github.io/did/credentials/statuslist/1#1",
      statusListCredential: "https://trustvc.github.io/did/credentials/statuslist/1",
      statusListIndex: "1",
      statusPurpose: "revocation",
      type: "StatusList2021Entry",
    },
    {
      id: "https://trustvc.github.io/did/credentials/statuslist/1#1",
      statusListCredential: "https://trustvc.github.io/did/credentials/statuslist/1",
      statusListIndex: "1",
      statusPurpose: "suspension",
      type: "StatusList2021Entry",
    },
  ],
  id: "urn:uuid:0192d19c-d82c-7cc7-9431-cb495374f43b",
  renderMethod: [
    { id: "https://demo-renderer.opencerts.io", type: "OpenAttestationEmbeddedRenderer", templateName: "GOVTECH_DEMO" },
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
  issuer: "did:web:trustvc.github.io:did:1",
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  proof: {
    type: "OpenAttestationHashProof2018",
    proofPurpose: "assertionMethod",
    targetHash: "c347ab52080cb90b05ec53250a8c4605d5c5e42f73a318995f42cf96c9baf38f",
    proofs: [],
    merkleRoot: "c347ab52080cb90b05ec53250a8c4605d5c5e42f73a318995f42cf96c9baf38f",
    salts:
      "W3sidmFsdWUiOiIwMTk4YzhhZWQ4NDM2NzBlZTE3N2RmNzRkZWJiNTBhZjAwMmEwYmE0ZmY1Mzg0NDEyYzAyNTNmMDc1MGJjYTZlIiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImU2NjY4YWYzYjQyMmY4ZjY4ZDM3YmI3N2ZiOTE4OGNmNzBhMDI0NTkyZGJjMjA0YzJiODRjZmU4YWU2N2FlZjAiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiNTJjZGRmY2JkY2MyNGI2Y2UyYjM2Mjk5NmJlZTllYzBiMDRiNmMwZjZhZjQ3NDYxNWJhZWEzNTViMTdkYTU5ZSIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiJlZTdiMDhjOTdjOGVlODEzNGJiNjFmYTM5NjM1ZGI5NWQzMTExY2U1YjQ5NjQ1OGYyY2JkZDg4MWUzNjk4NGI3IiwicGF0aCI6IkBjb250ZXh0WzNdIn0seyJ2YWx1ZSI6Ijc1NmIwNDFmYzI0Mjc5ZTczZDZhNWNjMzEyZTY0YWM5ZmFkOGJhMjUyYWRkYTg3YjU4MWFjYWExZWQzNDk2MDIiLCJwYXRoIjoiQGNvbnRleHRbNF0ifSx7InZhbHVlIjoiMjNhZGMyZjJiZmIzZjFhYjRkYzg1ZjA1NTQzMGJmZWJjMjNmZjBkNzNjYWFhN2I3N2MzZTM2Mzc1YzhhNGQyZCIsInBhdGgiOiJpZCJ9LHsidmFsdWUiOiI2NDdhODg4MDJlZDg1MzJkNGNlNGNmMTdkNmEzYjJhZjAzNWU5M2Y0NmEyMGMwNzA4NGYyNDQ5MGYxMDZiMzVkIiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiNTBiZGUwNDkxMThlZWYwYTg0MjNiYmMyOGVkYTk1MTg0YjI0YTgxZmQ2NDI0MDNmOTdmZjk3NTdlNjk0N2IyMiIsInBhdGgiOiJ0eXBlWzFdIn0seyJ2YWx1ZSI6ImEwYjBkMTMwYzQ5ZTBlOTYwYTI0YzQ4NGI4ZGE2MDYxNTg5NTUxZDMwYWU1NDQ4OWE0YjkzYTQzYzk3MjM4NDIiLCJwYXRoIjoiaXNzdWVyIn0seyJ2YWx1ZSI6ImUwYTQ2NTFjZDMxMjk2ZjM5NjNmNzhhOGFkMjk3NDMxNzM1ZTMxZjZkM2RjMTVjYzdjYWI0MzdiNDQ2NzNjZGUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiMDU4ZGExYTUxYWIwOWQwNjU3MWM3YzZkYzA2NzMxYzk5MTFhZDkzODQ3ZmUzNzVkMDA2MGQzMjgwZGQ3ZDg2YyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjBmOWU0M2YwMGMyNjkyYjBmNDE4YTk5ODc1MGFmMzgwNzdhMzc2MmVmNWI2ODUyZjA2MjAxMWVmNDMwNjc2ODUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiIzODI3M2UyMmViNjJiNDJhODVmY2E3YmUxYjAwOTVhMjU1ZjA1NDFkYzhmYTU3M2NkZjg0YTM5MjNmMzM5ZDY5IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6IjNiODgwZTM4YWMzODViYjM1ZGY1NmE4OTVhZTNhYmNmZGQ4MDMxNGJiMDQwOWVlMWQ4YWZlNzhlNTBkY2I2YWMiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiODBkNTlhM2U1NmIwZmY5YTYwZDRjZjA4YWQ3NzU0NTNlMTVlOWFhNGFlNDZhNTNlODhlNjNiZTQyYzMyMjIzZSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6IjIyMDMyNjUzZmY3NGFiOGJlZjg3M2Y0ZDVjYTQ2ZTA1YTI0NDg1ODhjOTVmMTYzNWFmN2Y2NjA1NzA5NTBlZTYiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiZmMzMGU1Yjg4M2E2YWVkZTJlZmE3Mzk0MDA3NzkyMTE3NDc3Mjc2YmFmM2MwMzJlMTVkYTI0NDdlMWQ2MjBlZCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiIxMTQzNDgzYzk0NmI0YTI0ZDFmNDgxYzE1Y2Y0YWQ1YmU1ZDk3MjRlYzBmYzEwMDAxOGY0NTFmNTBiNGU0MzNjIiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiNjAwMzEzYjZjZDBjOWE2OTAwY2RkNjQzMTc2MGM2OGFlNzk0YmZlNGFlZTZiN2QzN2M5NGExOTY5ZTc1MTJhOSIsInBhdGgiOiJjcmVkZW50aWFsU3RhdHVzWzBdLmlkIn0seyJ2YWx1ZSI6IjllZjc2MDNlYWMwNTcwMTJiYWRmZWFiYWE0OTE5ZDQ1ZDEwYjlhODNiNmYxMTAxZjY3YzAzMjc2YWVlMWQwZGQiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1c1swXS50eXBlIn0seyJ2YWx1ZSI6IjU3MGM1ODFmZjliMjdhYTZhNjA1M2I4OTBiNmMwNzU5N2RmMzBiY2UzN2UzMDlmZTRkZmNjNDBhOWY5MTlhYTIiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1c1swXS5zdGF0dXNMaXN0Q3JlZGVudGlhbCJ9LHsidmFsdWUiOiJiYjBkYzg0YjQ3YzkyMWMyYjUyMmM2YzY2NTE1MGZmMjM5ZDNjMDA3YmZiZmQ3ZWU1Yjk3OTZkYmIwOTdjMDVjIiwicGF0aCI6ImNyZWRlbnRpYWxTdGF0dXNbMF0uc3RhdHVzTGlzdEluZGV4In0seyJ2YWx1ZSI6IjA0YWU0OTg1MTgzNDdkYzgyZDg4ZjEyYzYxYjk2NTAyNTllN2RjN2UyMmFiZjJlOWY0YzgyM2I5NzUyZWFmMWQiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1c1swXS5zdGF0dXNQdXJwb3NlIn0seyJ2YWx1ZSI6IjllMTY5N2M2NWE3MDM0MTQ0ZGE2YjJhMzA2YzRhZDUwNTA3YmU2MDA1MWFjZTcyMzc1MjJhZTEzYzQxZWI1YWQiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1c1sxXS5pZCJ9LHsidmFsdWUiOiI2ZjE4YmU5M2EwZjYwMGQ5NzJlNGU0MTgzYjMyYmIxNTA0N2E2ZmU5NjI2ODQyZTNlOTE5MjY2ZGIwMzAxZGU5IiwicGF0aCI6ImNyZWRlbnRpYWxTdGF0dXNbMV0udHlwZSJ9LHsidmFsdWUiOiI4NzhhYmUwNmQ4MjUxMzg2ZmQ4NzY0ZTJlNGM0OGFjMTFjYWQ3OTg0YTJlY2Y3MmJlZDQwYWVhMDhhM2E3NjQ5IiwicGF0aCI6ImNyZWRlbnRpYWxTdGF0dXNbMV0uc3RhdHVzTGlzdENyZWRlbnRpYWwifSx7InZhbHVlIjoiY2E1NmVkN2MxOWMwZWMxZmY0NjI3YTQwNWFjMTJkZGQxMGMxM2RiZDkxYTMxMGE2NTVjNjE0NTA0ZmYwYTIwNyIsInBhdGgiOiJjcmVkZW50aWFsU3RhdHVzWzFdLnN0YXR1c0xpc3RJbmRleCJ9LHsidmFsdWUiOiI5NzcyMWU4OWE0MzUyNTVhNDk3OTZjNDFhYzhhNjk5MjQ3ZDZjNWIyZjVhNDZhMDhjYzE5Y2YxZDE1N2VjNGRkIiwicGF0aCI6ImNyZWRlbnRpYWxTdGF0dXNbMV0uc3RhdHVzUHVycG9zZSJ9LHsidmFsdWUiOiIyZDg0ODM5YTRkMTcxNjA2ODFmZWM0NWYwYmFjOWIyOWFjMjIxMjZkYmNiNTU4MDMzY2Q1MmE3NjlmNjM4MWFhIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS5pZCJ9LHsidmFsdWUiOiJjNzE4ZGY4YTVmNzE2MWJhOGRkZWEyMGVlMGFjYjJjYjAxYTg1YmE4MGMxOGY3ZTAxODA4NTAxZDBiMDBjNjZlIiwicGF0aCI6InJlbmRlck1ldGhvZFswXS50eXBlIn0seyJ2YWx1ZSI6ImJkYTY2Y2RiNjNmZTY3ZDUxYmUzNzJhMjJjYWIzY2RjNDAyOTk1M2EzODBlYTI2ZDcyYTY5NzkyMjMyYmM2OWMiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnRlbXBsYXRlTmFtZSJ9XQ==",
    privacy: { obfuscated: [] },
    key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
    signature:
      "0xc3a7b785be8825d38eaacf7a3fd16360bee29994dcbf14410d497780301005b65eee46c7aab7d66806421dbfaf384ec872bcdb611ce2728286878df60970d3a41c",
  },
}) satisfies OASigned<W3cVerifiableCredential>;

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
