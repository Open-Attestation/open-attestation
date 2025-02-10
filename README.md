# OpenAttestation

OpenAttestation (OA) is an open source document endorsement and verification framework for verifiable documents. Documents issued this way are cryptographically trustworthy and can be verified independently.

> [!NOTE]
> This guide concentrates on OpenAttestation v4.0 which conforms to the [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/).
>
> For issuing v2.0 documents, please refer to the [previous version of the README](previous.md).
>
> For the migration guide from v2.0 to v4.0, please refer to the following [migration guide section](#migration-guide-from-v20-to-v40).

## Requirements

### Node.js

Version 12 or higher is required.

#### Frontend Frameworks/Toolings

##### CRA (Create React App)

Compatible out of the box.

##### Vite

```
// vite.config.ts
export default defineConfig({
  ...
  define: {
    global: 'globalThis'
  },
})
```

##### Next.js

- Client-side usage:

```
npm i undici
```

- Server-side usage should function out of the box.

## Installation

### Via npm

```bash
npm i @govtechsg/open-attestation
```

---

## Major Changes in OpenAttestation v4.0

1. **W3C Verifiable Credentials Support**

   - Credentials now conform to the [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/)
   - `@context` and `type` fields are required for W3C compliance
   - Renamed securing mechanism: `OpenAttestationHashProof2018`

2. **Improved Type Safety**

   - Zod schema validation replacing JSON Schema
   - Stricter type checking for credential fields

3. **Simplified API**

   - New methods: `digestVc()`, `digestVcs()`, `validateDigest()`, `signVc()`
   - Removed legacy document wrapping terminology

4. **Deprecation of OpenAttestation v3.0**

   - Removed all functions related to OA v3.0

## Basic Usage

### Creating an unsigned OA Verifiable Credential

<details>
<summary>See example:</summary>

```typescript
const credential = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
  ],
  type: ["VerifiableCredential", "OpenAttestationCredential"],
  validFrom: "2021-03-08T12:00:00+08:00",
  name: "Republic of Singapore Driving Licence",
  issuer: {
    id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
    type: "OpenAttestationIssuer",
    name: "Government Technology Agency of Singapore (GovTech)",
    identityProof: {
      identityProofType: "DNS-DID",
      identifier: "example.openattestation.com",
    },
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
} satisfies v4.OAVerifiableCredential;
```

</details>

### Signing

The `signVc()` function takes an unsigned OA Verifiable Credential, as well as a public/private key pair (or an [Ethers.js Signer](https://docs.ethers.io/v5/api/signer/)) and returns a signed Verifiable Credential. Signing will digest the input credential and generate a cryptographic signature, ensuring the credential's integrity and issuance status.

```typescript
import { v4 } from "@govtechsg/open-attestation";

// Using a key pair
const signedVC = await v4.signVc(credential, "Secp256k1VerificationKey2018", {
  public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
  private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
});
```

### Validation

Validate the digest of a signed credential by recomputing its `targetHash` and `merkleRoot`.

```typescript
const isValid = validateDigest(signedVC);
```

## Migration Guide from v2.0 to v4.0

### 1. Document Data Model Changes

<details>
<summary>Signed OA v2.0 document example:</summary>

```typescript
const signedDocument = {
  version: "https://schema.openattestation.com/2.0/schema.json",
  data: {
    recipient: {
      name: "18134e8a-9e44-4269-b02b-53b0d82897d6:string:John Doe",
    },
    $template: {
      name: "835c455c-c862-404f-9dff-e45f0e84b4c6:string:main",
      type: "9a60d273-f6c6-48a3-83ab-a88feecb9ab1:string:EMBEDDED_RENDERER",
      url: "4898fb9d-f1ee-4897-8d8f-c31cde38f597:string:https://tutorial-renderer.openattestation.com",
    },
    issuers: [
      {
        id: "610773d0-840e-46bd-8b47-8e8cf2b9012f:string:did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733",
        name: "62fe5e04-2eed-4481-8a27-13622efe1abd:string:Demo Issuer",
        revocation: {
          type: "afd351c5-bf83-4956-a3a8-faa89354718c:string:OCSP_RESPONDER",
          location: "c578a822-03ab-4a79-b10a-a37fd7b0d9d7:string:https://api.example.com/ocsp-responder",
        },
        identityProof: {
          type: "26a7fea3-46ef-4613-a61f-914a0f06312d:string:DNS-DID",
          location: "15f58a9b-04ba-49f2-925d-f5b065f5f847:string:demo-tradetrust.openattestation.com",
          key: "720aa75e-720d-4f12-a6e9-6bee1f758f1a:string:did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
        },
      },
    ],
  },
  signature: {
    type: "SHA3MerkleProof",
    targetHash: "c1c9dcdcf4d1027449f7db66e25cf12f3f83c8a89582a3c09bbc701491989ed8",
    proof: [],
    merkleRoot: "c1c9dcdcf4d1027449f7db66e25cf12f3f83c8a89582a3c09bbc701491989ed8",
  },
};
```

</details>

<details>
<summary>Signed OA v4.0 VC example:</summary>

```typescript
const credential = {
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
    type: "OpenAttestationHashProof2018",
    proofPurpose: "assertionMethod",
    targetHash: "0f60b3ef4b9b826de4753c4e68bb5ac9fdd2496549f901331a9d07464469366c",
    proofs: [],
    merkleRoot: "0f60b3ef4b9b826de4753c4e68bb5ac9fdd2496549f901331a9d07464469366c",
    salts:
      "W3sidmFsdWUiOiI3N2RhNDUzOWYwY2M3ZmVmODg0ZmU0MTVkNzE2ZTRjODc5N2NiMDMyZGJlZDQzOWM2ZWViOTU2NmJlZDk1MmI0IiwicGF0aCI6IkBjb250ZXh0WzBdIn0seyJ2YWx1ZSI6ImY2NWZhZWI4MzVmZTI4MzYyMDBhZGUyYTUzZjM4MzJkMGE2YTVjZjZiZjc2OGRlNmMxYjE3OTQ1OGIwMGI2MDIiLCJwYXRoIjoiQGNvbnRleHRbMV0ifSx7InZhbHVlIjoiMjVkOGNmNDY3MTAzMmMzMTUzZDdlY2I2OTQ1OGU2MzNkZWE0YmYwYTc0MGI4YzZiMDFlYjE5M2I4NzE2ZDYzYSIsInBhdGgiOiJuYW1lIn0seyJ2YWx1ZSI6ImQxNjEyODkzZGI2YjM3MDY0MjgzM2FkNjYwYjQ5N2ZiMTY0ZWZlZTZkNWY0ZDhhMjg0YjkxNWNkNGNhNzJkM2YiLCJwYXRoIjoidHlwZVswXSJ9LHsidmFsdWUiOiJjZjkzMTg5ZTBjNTE0ZGUwMWJlOTI5ZWRhNjk4ZTdlOWQ5ZmRiMzJlOTVjZTdlOTM1NGM4OWJlYjc3Mzg1NjNkIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiYzgzNzJlYmU2NWJiMzdhOTI0YTljMmZiNGE3Yzc4MmQxMzI1ZjE0NTY3OTFjODJmZmI4NGUwY2FmYWFlMDg2OCIsInBhdGgiOiJpc3N1ZXIuaWQifSx7InZhbHVlIjoiMzg1MzJhNzJiMDA1Njc4Yjc2M2Y0NTdlY2IxZTI1NzhhMDVkYzQ5ZjdlZDhhYzk5N2EyNDJjZWNjNGY3MDcyMiIsInBhdGgiOiJpc3N1ZXIudHlwZSJ9LHsidmFsdWUiOiIzMTQ1OWY5ZmUyNTdkMDVlZTkwNjg4NmYxYmU3ZjBmOTU4YTUxZGM3YTJlNTY5N2EyOGNjZjI3YWVhOGRmNDg4IiwicGF0aCI6Imlzc3Vlci5uYW1lIn0seyJ2YWx1ZSI6ImVkOTQ0Mzk0ZmQ5YzY3OWI5MDg0MjNmNjJlZWU5M2YxODJmNjdmZmIxM2MxNGM2ODJjZDMyZmNkMTk3MmVlN2IiLCJwYXRoIjoiaXNzdWVyLmlkZW50aXR5UHJvb2YuaWRlbnRpdHlQcm9vZlR5cGUifSx7InZhbHVlIjoiYTBjODBhOTI4ZGI3MDExYTI0ODIzYzUzZGJlNjNmNGU5ZTc3M2IyMjkyZWNjOThkMWFiNjZiMjVjYTBmYzY3YiIsInBhdGgiOiJpc3N1ZXIuaWRlbnRpdHlQcm9vZi5pZGVudGlmaWVyIn0seyJ2YWx1ZSI6Ijk4Y2JlZjE3NDZkZjM1MmQ5Njg4NmYyYWQ1N2NmOWI5ODg2ZWJhZTJlYzA1ZTM4YWE1YTc5ZTM2YTE2OWY1NGMiLCJwYXRoIjoidmFsaWRGcm9tIn0seyJ2YWx1ZSI6IjlhYzhkMzA5ZGEyZGYzNWNhN2RkNDFkYTc3NzRkYzFhNWY4NTE3NmFiNGU3ZGY1MDgzNzBiNDNlNmU2Y2FhNGEiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuaWQifSx7InZhbHVlIjoiZjkwYWU2YWVjNzlhODg0OTJkYzFlN2IwYThmNDExYWEwN2Y2YjY5NGMwZjQzNjhhZTMzZWVlNTllYzVhZDM2NyIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC50eXBlWzBdIn0seyJ2YWx1ZSI6IjBhMWNhMTQwMmI4MDEwNWQzNGY4NmVjZjNjMDgxYTE3ZTVlODhiY2UwN2ZjNzgyMGRkYzdmZDY1OTA5ZDcwM2MiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubmFtZSJ9LHsidmFsdWUiOiI2NTk1NGE0ZTNiZGRlNmQ5NGEyYjA4OTQ3YTU3YTdkOWEzYzAwNWEyN2ZmNzA0ZmNjMDI2MDI0MmNkNjczNGI1IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzBdLmNsYXNzIn0seyJ2YWx1ZSI6Ijg3ZDc4NzBjYmVkOGZkYzIyNjA4MWMyZmY5ZmZmNmU3ZmJiZWYyMDUyMDg5YjU1MDg4MDg4MzliNWZlMWNlMGUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMF0uZGVzY3JpcHRpb24ifSx7InZhbHVlIjoiMTgwMzBkZjQ5MzRhMDhlYmM3YTEwNjZlOWRlODZhMDAxYmZhNjcyNWI2Y2FiYjA5NGNmZWI5NzE4YTU3ZDViNiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1swXS5lZmZlY3RpdmVEYXRlIn0seyJ2YWx1ZSI6ImUyNWQ1MzFmMTIwNzM0ZWY2ZmY1MTU3MjViYjM5MGJkMjU4MTE2NWM4YTMxZTViMTRmNWUzZTMzM2I2OGZmNWUiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QubGljZW5zZXNbMV0uY2xhc3MifSx7InZhbHVlIjoiMTNiMjYyN2E4Yzk0YzkwYWI0M2JjZGExNDNkNTI2MDM0YWM0ZDVkNThhMTc2OTIzMDcwZTAzMGM2MTkwOWVlYiIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5saWNlbnNlc1sxXS5kZXNjcmlwdGlvbiJ9LHsidmFsdWUiOiI2YjIzZWZkODVhZjZjZWZkMTBjM2EwNzczNjdlMjE4Mzc1MTlkN2ExYTBhMzVmODFkZDBhNWYzNTA0MTg4NjE4IiwicGF0aCI6ImNyZWRlbnRpYWxTdWJqZWN0LmxpY2Vuc2VzWzFdLmVmZmVjdGl2ZURhdGUifSx7InZhbHVlIjoiMTI4MzY5ZDk5NTU2ZGYwOWMwOGE4NmZkODU4NmJlMWJlNWVjODcxYjY3NGQwNzJmN2U4ODdmNWZiYjViNjE5NiIsInBhdGgiOiJjcmVkZW50aWFsU3RhdHVzLmlkIn0seyJ2YWx1ZSI6ImYzNTBjOGYwNjlkNmIyM2M3NmE0MjQ3ZTIyOWRjOGM1MDVjMTFhZTNkNjFmYjE3ZDJlNDIxZWU1NzY4OGQ4YTMiLCJwYXRoIjoiY3JlZGVudGlhbFN0YXR1cy50eXBlIn0seyJ2YWx1ZSI6IjJkMTUzYzc1OGNiMTY1YjM1MTFhNjA4MjBkMzNiY2ZmYTViNmE3OWFiNWI5ZDNlMTA0NGZiNTk0NjNhNzM3MDUiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLmlkIn0seyJ2YWx1ZSI6ImJmOGJlY2M2Yjg1MDJkODBiNTg4ZmRmZmJhY2JmMmU1NTIzNjE1MzBjYmUxMGI4NzM5OTQ0NWYwZmZkYTkwOTAiLCJwYXRoIjoicmVuZGVyTWV0aG9kWzBdLnR5cGUifSx7InZhbHVlIjoiOTRmYmI5NWE1ZmNhZjU0YTcwYTAxODZiNjg1OWM5YmY5MzYzNWU0OTQ0N2U3ZmMxYWIyY2RmNTM5ZDllZjNiNyIsInBhdGgiOiJyZW5kZXJNZXRob2RbMF0udGVtcGxhdGVOYW1lIn1d",
    privacy: {
      obfuscated: [],
    },
    key: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
    signature:
      "0xa9f89c00bac009044f02ca0e0c605389a927e4b011fa7c0f9a3bfd987598d8a442cd51218a31e387737ad42adeb9b9405c545a4d70ad75d06f7a7701e87440631c",
  },
};
```

</details>

### 2. Method Changes

| OA v2.0                                   | OA v4.0                    | Description                                |
| ----------------------------------------- | -------------------------- | ------------------------------------------ |
| `signDocument(wrapDocument(rawDocument))` | `signVc(unsignedVc)`       | Credential signing                         |
| `verifySignature(wrappedDocument)`        | `validateDigest(signedVc)` | Validate the digest of a signed credential |

### 3. Signing Changes

**Previously in OA v2.0:**

```typescript
// Requires wrapping before signing
const wrappedDocument = wrapDocument(document);
const signedDocument = await signDocument(wrappedDocument, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
  public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
  private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
});
```

**New in OA v4.0:**

```typescript
// Signs the unsigned credential directly
const signedVC = await signVc(credential, "Secp256k1VerificationKey2018", {
  public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
  private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
});
```

### 4. Summary of Breaking Changes

1. Removed support for document store and token registry
2. All credentials must conform to the [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/)
3. Removed the prerequisite of wrapping before signing - credential digestion is now part of the signing process
4. Stricter type checking and validation at runtime
