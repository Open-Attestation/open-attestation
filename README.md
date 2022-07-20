[![CircleCI](https://circleci.com/gh/Open-Attestation/open-attestation.svg?style=svg)](https://circleci.com/gh/Open-Attestation/open-attestation)

# Open Attestation

Attestation and notary framework for any document types on the blockchain.

OpenAttestation allows any entity to prove the existence of a document or a batch of documents. It makes use of smart contracts on the Ethereum blockchain to store cryptographic proofs of individual documents.

Alternatively, OpenAttestation can be used to make digitally verifiable documents using digital signatures, forgoing the need to pay for Ethereum transactions.

The [Open Attestation](https://github.com/Open-Attestation/open-attestation) repository allows you to batch the documents to obtain the merkle root of the batch to be committed to the blockchain. It also allows you to verify the signature of the document wrapped using the OpenAttestation framework.

## Installation

```bash
npm i @govtechsg/open-attestation
```

---

## Usage

### Wrapping documents

`wrapDocuments` takes in an array of documents and returns the wrapped batch. Each document must be valid regarding the version of the schema used (see below) It computes the Merkle root of the batch and appends it to each document. This Merkle root can be published on the blockchain and queried against to prove the provenance of the document issued this way. Alternatively, the Merkle root may be signed by the document issuer's private key, which may be cryptographically verified using the issuer's public key or Ethereum account.

In the future, this function may accept a second optional parameter to specify the version of open-attestation you want to use. Currently, open-attestation will use schema 2.0. See [Additional Information](#additional-information) for information on using experimental v3.0 documents, which aim to be compatible with the W3C's data model for [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/).

The `wrapDocument` function is identical but accepts only one document.

```js
import { wrapDocuments } from "@govtechsg/open-attestation";
const document = {
  id: "SERIAL_NUMBER_123",
  $template: {
    name: "CUSTOM_TEMPLATE",
    type: "EMBEDDED_RENDERER",
    url: "https://localhost:3000/renderer",
  },
  issuers: [
    {
      name: "DEMO STORE",
      tokenRegistry: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
      identityProof: {
        type: "DNS-TXT",
        location: "tradetrust.io",
      },
    },
  ],
  recipient: {
    name: "Recipient Name",
  },
  unknownKey: "unknownValue",
  attachments: [
    {
      filename: "sample.pdf",
      type: "application/pdf",
      data: "BASE64_ENCODED_FILE",
    },
  ],
};

wrappedDocuments = wrapDocuments([document, { ...document, id: "different id" }]); // will ensure document is valid regarding open-attestation 2.0 schema
console.log(wrappedDocuments);
```

> Note:
> Though `wrapDocument` and `wrapDocuments` are both identical but there is a slight difference.
>
> wrapDocuments:
>
> - returns an array and not an object.
> - Each element in the array is a wrapped document corresponding to the one provided as input.
> - Each element will share the same unique `merkleRoot` value in every batch wrap instance.
> - Each element has an unique `targetHash` value.
> - Similar to wrapDocument, every time you run wrapDocuments, it will create unique hashes (in front of every fields in the data object).

### Sign a document

`signDocument` takes a wrapped document, as well as a public/private key pair or an [Ethers.js Signer](https://docs.ethers.io/v5/api/signer/). The method will sign the merkle root from the wrapped document, append the signature to the document and return it. Currently, it supports the following sign algorithm:

- `Secp256k1VerificationKey2018`

#### Example with public/private key pair

```js
import { signDocument, SUPPORTED_SIGNING_ALGORITHM } from "@govtechsg/open-attestation";
await signDocument(wrappedV2Document, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
  public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
  private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
});
```

#### Example with signer

```js
import { signDocument, SUPPORTED_SIGNING_ALGORITHM } from "@govtechsg/open-attestation";
import { Wallet } from "ethers";

const wallet = Wallet.fromMnemonic("tourist quality multiply denial diary height funny calm disease buddy speed gold");
const { proof } = await signDocument(
  wrappedDocumentV2,
  SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
  wallet
);
```

### Validate schema of document

`validateSchema` checks that the document conforms to open attestation data structure.

```js
import { validateSchema } from "@govtechsg/open-attestation";
const validatedSchema = validateSchema(wrappedDocument);
console.log(validatedSchema);
```

### Verify signature of document

`verifysignature` checks that the signature of the document corresponds to the actual content in the document. In addition, it checks that the target hash (hash of the document content), is part of the set of documents wrapped in the batch using the proofs.

Note that this method does not check against the blockchain or any registry if this document has been published. The merkle root of this document need to be checked against a publicly accessible document store (can be a smart contract on the blockchain).

```js
import { verifySignature } from "@govtechsg/open-attestation";
const verified = verifySignature(wrappedDocument);
console.log(verified);
```

### Retrieving document data

`getData` returns the original data stored in the document, in a readable format.

```js
import { getData } from "@govtechsg/open-attestation";
const data = getData(wrappedDocument);
console.log(data);
```

### Utils

```js
import { utils } from "@govtechsg/open-attestation";
utils.isWrappedV3Document(document);
```

- `isWrappedV2Document` type guard for wrapped v2 document
- `isSignedWrappedV2Document` type guard for signed v2 document
- `isSignedWrappedV3Document` type guard for signed v3 document
- `isWrappedV3Document` type guard for wrapped v3 document
- `diagnose` tool to find out why a document is not a valid open attestation file (wrapped or signed document)

### Obfuscating data

`obfuscateDocument` removes a key-value pair from the document's data section, without causing the file hash to change. This can be used to generate a new document containing a subset of the original data, yet allow the recipient to proof the provenance of the document.

```js
const newData = obfuscateDocument(wrappedDocument, "key1");
console.log(newData);
```

## Development

To run tests

```
npm run test
```

### vc-test-suite

You can run the vc-test-suite against `open-attestation` by running `npm run test:vc`. This command will:

- clone https://github.com/w3c/vc-test-suite.git
- copy the local configuration (`vc-test-suite-config.json`) into the cloned repository
- install the latest version of `@govtechsg/open-attestation-cli`
- monkey patch `open-attestation` in `@govtechsg/open-attestation-cli`. That means that the current version of the project will be built and replace the one installed with `@govtechsg/open-attestation-cli`.

#### Local debug

In the event you face a problem with one test and want to debug locally:

1. Ensure the folder `vc-test-suite` is available from the root of the project. If that's not the case, run `npm run test:vc` first.
1. Open `runVcTest.sh` and update `install_vc_test_suite=true` to `install_vc_test_suite=false`. This line will help to preserve the `vc-test-suite` folder untouched.

You can now debug from the `vc-test-suite` folder the way you need it.

## Additional information

- Found a bug? Have a question? Want to share an idea? Reach us at our [Github repository](https://github.com/Open-Attestation/open-attestation).
- We are currently building a new version of the schema, compatible with W3C VC. This is very experimental and whatever is available for v2 documents are also available for v3 documents:
  - [OA schema v3](https://schema.openattestation.com/3.0/schema.json)
  - Typings: `import {v3} from "@govtechsg/open-attestation"`.
  - Type guard: `utils.isWrappedV3Document`.
  - Wrapping: `__unsafe__use__it__at__your__own__risks__wrapDocument` (future usage: `wrapDocument(document, {version: "open-attestation/3.0"})`
  - Example docs in `tests/fixtures/v3`
- There are extra utilities available: 
  - Refer to the [utils](https://github.com/Open-Attestation/open-attestation/blob/master/src/shared/utils/utils.ts) component for the full list of utilities.
