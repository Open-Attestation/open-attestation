# OpenAttestation

OpenAttestation is an open source document endorsement and verification framework for verifiable documents and transferable records. Documents issued this way are cryptographically trustworthy and can be verified independently.

With OpenAttestation, you can issue and verify verifiable documents individually or in a batch using:

- either smart contracts on the Ethereum blockchain
- or digital signatures without the need to pay for Ethereum transactions

## Note

This guide concentrates on OpenAttestation v4.0 documents. For issuing v2.0 documents, please refer to the [previous version of the documentation](previous.md)

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

## Basic Usage

### Document creation

### Option 1. with `wrapDocument`, `wrapDocuments` and `signDocument`

```typescript
import { wrapDocument, wrapDocumentErrors } from "@govtechsg/open-attestation/4.0/wrap";
import { signDocument, signDocumentErrors } from "@govtechsg/open-attestation/4.0/sign";

try {
  const wrappedDocument = await wrapDocument({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
    ],
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    name: "Republic of Singapore Driving Licence",
    issuer: {
      id: "urn:uuid:344a5b29-30ce-4b8f-a7dc-c1f056c86f5a",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: {
        identityProofType: "DNS-DID",
        identifier: "example.openattestation.com",
      },
    },
    credentialSubject: {
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
      type: "OpenAttestationRevocationStore",
      id: "0x1234567890123456789012345678901234567890",
    },
  });

  const signedDocument = await signDocument(wrappedDocument, "Secp256k1VerificationKey2018", {
    private: "0x1234567890123456789012345678901234567890123456789012345678901234",
    public: "0x12345678901234567890123456789012345678901234567890123456789012345678901234",
  });
} catch (error) {
  if (error instanceof wrapDocumentErrors.UnableToInterpretContextError) {
    // network errors can occur when fetching the context
  } else if (error instanceof signDocumentErrors.CouldNotSignDocumentError) {
    // network errors can occur when signing using a remote Signer
  }

  throw error;
}
```

#### Option 2. Using `DocumentBuilder`

`DocumentBuilder` is a class designed to streamline the document creation process, reducing the likelihood of errors. While it should suffice for most use cases, those needing finer control should use Option 1.

The following example creates a document with the same content as the previous example:

```typescript
import { DocumentBuilder, DocumentBuilderErrors } from "@govtechsg/open-attestation/4.0/builder";

try {
  const signedDocument = await new DocumentBuilder({
    // name of the document
    name: "Republic of Singapore Driving Licence",
    // main content of the document
    credentialSubject: {
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
    // attachments if any
    attachments: [
      {
        fileName: "sample.pdf",
        mimeType: "application/pdf",
        data: "base64 encoded data",
      },
    ],
  })
    // Equivalent to setting "renderMethod" to:
    // [
    //   {
    //     id: "https://demo-renderer.opencerts.io",
    //     type: "OpenAttestationEmbeddedRenderer",
    //     templateName: "GOVTECH_DEMO",
    //   },
    // ],
    .embeddedRenderer({
      templateName: "GOVTECH_DEMO",
      rendererUrl: "https://demo-renderer.opencerts.io",
    })
    // Equivalent to setting "credentialStatus" to:
    // {
    //   type: "OpenAttestationRevocationStore",
    //   id: "0x1234567890123456789012345678901234567890"
    // },
    .revocationStoreRevocation({
      storeAddress: "0x1234567890123456789012345678901234567890",
    })
    // Equivalent to setting "issuer" to:
    // {
    //   id: "urn:uuid:344a5b29-30ce-4b8f-a7dc-c1f056c86f5a",
    //   type: "OpenAttestationIssuer",
    //   name: "Government Technology Agency of Singapore (GovTech)",
    //   identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
    // },
    .dnsTxtIssuance({
      identityProofDomain: "example.openattestation.com",
      issuerName: "Government Technology Agency of Singapore (GovTech)",
      issuerId: "urn:uuid:344a5b29-30ce-4b8f-a7dc-c1f056c86f5a",
    })
    .wrapAndSign({
      signer: {
        public: "0x12345678901234567890123456789012345678901234567890123456789012345678901234",
        private: "0x1234567890123456789012345678901234567890123456789012345678901234",
      },
    });
} catch (error) {
  if (error instanceof DocumentBuilderErrors.CouldNotSignDocumentError) {
    // handle error
  }
}
```

Batch creation is supported, though all documents in the batch must share the same issuer, revocation and rendering method:

```typescript
const signedDocuments = await new DocumentBuilder([
  {
    name: "Republic of Singapore Driving Licence",
    credentialSubject: {
      ...
    },
  },
  {
    name: "Republic of Singapore Driving Licence",
    credentialSubject: {
      ...
    },
  },
])
...
```

## Obfuscation

This process enables the concealment of sensitive information within a document without compromising the validity of its signature, useful when sharing with third parties.

It's crucial to understand that obfuscation can only be applied to non-essential data paths. Critical paths, such as issuer and proof, must remain unobscured as they are integral for the verification process.

### Applicable only to OpenAttestation v4.0 documents

```typescript
import { obfuscate } from "@govtechsg/open-attestation/4.0/obfuscate";

const obfuscatedDocument = obfuscate(signedDocument, ["credentialSubject.name", "credentialSubject.licenses[0].class"]);
```

## Verification of Signature

### Exclusive to OpenAttestation v4.0 documents

```typescript
import { verifySignature } from "@govtechsg/open-attestation/4.0/verify";

const valid = verifySignature(signedDocument); // true or false
```

### Compatible with any version of OpenAttestation documents

```typescript
import { verifySignature } from "@govtechsg/open-attestation";

const valid = verifySignature(signedDocument); // true or false
```

## Types

TypeScript types for OpenAttestation v4 documents are included in the package and can be accessed as follows:

```typescript
import type { WrappedDocument, SignedWrappedDocument } from "@govtechsg/open-attestation/4.0/types";
```

## Utils

```typescript
import {
  isDocument,
  isWrappedDocument,
  isSignedWrappedDocument,
  computeDigestMultibase,
} from "@govtechsg/open-attestation/4.0/utils";
```

### `computeDigestMultibase`

Function to compute a SHA-256 digest of the provided data and encodes it in Base58 with a 'z' prefix. This is particular useful when computing for the `digestMultibase` of a remote svg template. See [Verifiable Credential Rendering Methods](https://w3c-ccg.github.io/vc-render-method/#svgrenderingtemplate2023).

```typescript
const svgTemplateResponse = await fetch("https://example.com/svg-template.svg");
const digestMultibase = await computeDigestMultibase(await svgTemplateResponse.arrayBuffer());
const wrappedDocument = await wrapDocument(
  {
    ...
    {
      id: "https://example.com/svg-template.svg",
      type: "SvgRenderingTemplate2023",
      digestMultibase: digestMultibase,
    }
    ...
  })

```

### Guards

1. `isDocument` - Checks if the document is a valid OpenAttestation v4 document
2. `isWrappedDocument` - Checks if the document is a valid OpenAttestation v4 wrapped document
3. `isSignedWrappedDocument` - Checks if the document is a valid OpenAttestation v4 signed wrapped document

### Importing Methods

For efficient code management, it's recommended to import methods in a granular manner, enabling better code optimization through tree shaking:

```typescript
import { wrapDocument, wrapDocumentErrors } from "@govtechsg/open-attestation/4.0/wrap";
import { signDocument, signDocumentErrors } from "@govtechsg/open-attestation/4.0/sign";
import { obfuscate } from "@govtechsg/open-attestation/4.0/obfuscate";
import { verifySignature } from "@govtechsg/open-attestation/4.0/verify";
import { isSignedWrappedDocument } from "@govtechsg/open-attestation/4.0/utils";
```

Fallback methods for projects not supporting package exports:

```typescript
import { v4 } from '@govtechsg/open-attestation'
await v4.wrapDocument(
  {
    ...
  }
)
```

## Development

To execute tests:

```
npm run test
```

## Additional information

- If you find a bug, have a question, or want to share an idea, reach us at our [Github repository](https://github.com/Open-Attestation/open-attestation).
