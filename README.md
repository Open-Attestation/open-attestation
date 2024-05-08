# OpenAttestation

OpenAttestation is an open-sourced framework to endorse and verify documents using the blockchain.

With OpenAttestation, you can issue and verify verifiable documents individually or in a batch using:

- either smart contracts on the Ethereum blockchain

- or digital signatures without the need to pay for Ethereum transactions

## Note

This document focuses on OpenAttestation v4.0 documents, if you are looking to issue v2.0 documents, please refer to the [previous readme](previous.md)

## Requirements

### Node.js

V12 or higher

#### Frontend frameworks/toolings

##### CRA (Create React App)

Should work out of the box

##### vite

```
// vite.config.ts
export default defineConfig({
  ...
  define: {
    global: 'globalThis'
  },
})
```

##### Next

Client side usage

```
npm i undici
```

Server side only usage should work out of the box

## Installation

### Package manager via npm

```bash
npm i @govtechsg/open-attestation
```

---

## Basic Usage

### Document creation

#### 1. with `DocumentBuilder` (recommended)

`DocumentBuilder` is a class that simplifies the process of creating documents. Documents created via this class are less likely to have errors.

While `DocumentBuilder` should cover most use cases, users who require more control and flexiblity over the document creation process can use the `wrapDocument` and `signDocument` functions as described in the next section.

```typescript
import { DocumentBuilder, DocumentBuilderErrors } from "@govtechsg/open-attestation/4.0/builder";

try {
  const signedDocument = await new DocumentBuilder({
    // name of the document
    name: "Republic of Singapore Driving Licence",
    // main content of the document
    content: {
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
    .embeddedRenderer({
      templateName: "GOVTECH_DEMO",
      rendererUrl: "https://demo-renderer.opencerts.io",
    })
    .revocationStoreRevocation({
      storeAddress: "0x1234567890123456789012345678901234567890",
    })
    .dnsTxtIssuance({
      identityProofDomain: "example.openattestation.com",
      issuerName: "Government Technology Agency of Singapore (GovTech)",
      issuerId: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
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

Batch creation is also supported with the limitation that all documents in the batch will share the same issuer and renderering method:

```typescript
const signedDocuments = await new DocumentBuilder([
  {
    name: "Republic of Singapore Driving Licence",
    content: {
      ...
    },
  },
  {
    name: "Republic of Singapore Driving Licence",
    content: {
      ...
    },
  },
])
...
```

### 2. with `wrapDocument`, `wrapDocuments` and `signDocument`

These lower-level functions provide the most flexibility over the document creation process and should be used when `DocumentBuilder` does not meet your requirements.

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
    validFrom: "2021-03-08T12:00:00+08:00",
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
      id: "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
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

## Obfuscation

Obfuscation is a process that allows you to hide sensitive information in a document without invalidating the document's signature. This is useful when you need to share a document with a third party but want to protect certain information.

It is important to note that obfuscation can only be done on paths that are not required. For example, `issuer` and `proof` paths cannot be obfuscated as they are required for verification.

### OpenAttestation v4.0 documents only

```typescript
import { obfuscate } from "@govtechsg/open-attestation/4.0/obfuscate";

const obfuscatedDocument = obfuscate(signedDocument, ["credentialSubject.name", "credentialSubject.licenses[0].class"]);
```

## Verification of signature

### OpenAttestation v4 documents only

```typescript
import { verifySignature } from "@govtechsg/open-attestation/4.0/verify";

const valid = verifySignature(signedDocument); // true or false
```

### any version of OpenAttestation documents

```typescript
import { verifySignature } from "@govtechsg/open-attestation";

const valid = verifySignature(signedDocument); // true or false
```

## Types

Typescript types for OpenAttestation v4 documents are provided in the package. They can be imported as follows:

```typescript
import type { WrappedDocument, SignedWrappedDocument } from "@govtechsg/open-attestation/4.0/types";
```

## Utils

```typescript
import { isDocument, isWrappedDocument, isSignedWrappedDocument } from "@govtechsg/open-attestation/4.0/utils";
```

### Guards

1. `isDocument` - checks if the document is a valid OpenAttestation v4 document
2. `isWrappedDocument` - checks if the document is a valid OpenAttestation v4 wrapped document
3. `isSignedWrappedDocument` - checks if the document is a valid OpenAttestation v4 signed wrapped document

### Imports

The recommended method to import is via a granular fashion:

```typescript
import { wrapDocument, wrapDocumentErrors } from "@govtechsg/open-attestation/4.0/wrap";
import { signDocument, signDocumentErrors } from "@govtechsg/open-attestation/4.0/sign";
import { obfuscate } from "@govtechsg/open-attestation/4.0/obfuscate";
import { verifySignature } from "@govtechsg/open-attestation/4.0/verify";
import { isSignedWrappedDocument } from "@govtechsg/open-attestation/4.0/utils";
```

This would enable bundlers to tree shake code that otherwise is not needed.

We do however understand that not all projects would support [package exports](https://webpack.js.org/guides/package-exports/), we do provide a fallback method:

```typescript
import { v4 } from '@govtechsg/open-attestation'
await v4.wrapDocument(
  {
    ...
  }
)
```

## Development

To run tests, use the following command:

```
npm run test
```

## Additional information

- If you find a bug, have a question, or want to share an idea, reach us at our [Github repository](https://github.com/Open-Attestation/open-attestation).
