[![CircleCI](https://circleci.com/gh/Open-Attestation/open-attestation.svg?style=svg)](https://circleci.com/gh/Open-Attestation/open-attestation)

# OpenAttestation

OpenAttestation is a framework of attestation and notary for any document types on the blockchain.

With OpenAttestation, you can issue and verify verifiable documents individually or in a batch using:

* either smart contracts on the Ethereum blockchain

* or digital signatures without the need to pay for Ethereum transactions

## Installation

To install OpenAttestation framework on your machine, run the command below:

```bash
npm i @govtechsg/open-attestation
```

---

## Usage

### Wrapping documents

The `wrapDocuments` function takes in an array of documents and returns the wrapped batch. Each document must be valid according to the [version of the schema used](#version-of-the-schema). It computes the merkle root of the batch and appends it to each document. This merkle root can be published on the blockchain and be queried against to prove the provenance of the document issued this way. Alternatively, the merkle root may be signed by the document issuer's private key, which may be cryptographically verified using the issuer's public key or Ethereum account.

#### Version of the schema
In future, this function may accept a second optional parameter to specify the version of open-attestation you want to use. Currently, open-attestation will use schema 2.0. See [Additional Information](#additional-information) for how to use experimental v3.0 documents, which aim to be compatible with the W3C's data model for [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/).

#### Code example

The `wrapDocument` function is almost identical with `wrapDocuments`, but the first function accepts only one document.

The following code example shows how `wrapDocuments` works. You can also do some tweaking to apply it on `wrapDocument`.

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

#### Differences between the two similar functions

Although `wrapDocument` and `wrapDocuments` are almost identical, there are minor differences.

- The `wrapDocuments` function returns an array and not an object.
- Each element in the array is a wrapped document corresponding to the one provided as input.
- Each element will share the same unique `merkleRoot` value in every batch wrap instance.
- Each element has a unique `targetHash` value.
- Similar to `wrapDocument`, every time you run `wrapDocuments`, it will create unique hashes (in front of every field in the data object).

### Signing a document

The `signDocument` function takes a wrapped document, as well as a public/private key pair or an [Ethers.js Signer](https://docs.ethers.io/v5/api/signer/). The method will sign the merkle root from the wrapped document, append the signature to the document, and return it. Currently, it supports the signing algorithm below:

- `Secp256k1VerificationKey2018`

#### Example with a public/private key pair

The following code example of `signDocument` contains a public/private key pair.

```js
import { signDocument, SUPPORTED_SIGNING_ALGORITHM } from "@govtechsg/open-attestation";
await signDocument(wrappedV2Document, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
  public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
  private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
});
```

#### Example with the signer
The following code example of `signDocument` contains the signer information. 

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

### Validating the document schema

The `validateSchema` function checks that the document conforms to OpenAttestation data structure.

```js
import { validateSchema } from "@govtechsg/open-attestation";
const validatedSchema = validateSchema(wrappedDocument);
console.log(validatedSchema);
```

### Verifying the document signature

The `verifySignature` function checks that the signature of the document corresponds to the actual content in the document. In addition, it checks that the target hash (hash of the document content) is part of the set of documents wrapped in the batch using the proofs.

```js
import { verifySignature } from "@govtechsg/open-attestation";
const verified = verifySignature(wrappedDocument);
console.log(verified);
```

>**Note:** This method does not check against the blockchain or any registry if this document has been published. The merkle root of this document needs to be checked against a publicly accessible document store, which in the case of OpenAttestation is a smart contract on the blockchain.

### Retrieving the document data

The `getData` function returns the original data stored in the document in a readable format.

```js
import { getData } from "@govtechsg/open-attestation";
const data = getData(wrappedDocument);
console.log(data);
```

### Utils

A number of utility functions can be found under `utils`, which check whether a document is a valid OA file that has been wrapped or signed. The `diagnose` function can also be used for troubleshooting. 

```js
import { utils } from "@govtechsg/open-attestation";
utils.isWrappedV3Document(document);
```
You can replace `isWrappedV3Document` in the above example with the following values:

- `isWrappedV2Document`: This is the type guard for the wrapped V2 document.
- `isSignedWrappedV2Document`: This is the type guard for the signed V2 document.
- `isSignedWrappedV3Document`: This is the type guard for the signed V3 document.
- `isWrappedV3Document`: This is the type guard for the wrapped V3 document.

In addition, the `diagnose` tool can find out why a document is not a valid OpenAttestation file (wrapped or signed document).

### Obfuscating data

The `obfuscateDocument` function removes a key-value pair from the document's data section, without causing the file hash to change. You can use this to generate a new document containing a subset of the original data, without letting the recipient prove the provenance of the document.

```js
const newData = obfuscateDocument(wrappedDocument, "key1");
console.log(newData);
```

## Development

To run tests on your project in development, use the following command:

```
npm run test
```

### vc-test-suite

You can run `vc-test-suite` against `open-attestation` by using the `npm run test:vc` command. It will:

- clone https://github.com/w3c/vc-test-suite.git
- copy the local configuration (`vc-test-suite-config.json`) into the cloned repository
- install the latest version of `@govtechsg/open-attestation-cli`
- monkey patch `open-attestation` in `@govtechsg/open-attestation-cli`
  
  "Monkey patch" means it will build the current version of the project, which will replace the one installed with `@govtechsg/open-attestation-cli`.

#### Local debugging

If you face a problem with one test and want to debug locally:

1. Ensure the `vc-test-suite` folder is available from the root of the project. 

    If not, run `npm run test:vc` first and perform the test again.

1. Open `runVcTest.sh` and update `install_vc_test_suite=true` to `install_vc_test_suite=false`. 

    This line will preserve the `vc-test-suite` folder untouched.

You can now debug from the `vc-test-suite` folder the way you need.

## Additional information

- If you find a bug, have a question, or want to share an idea, reach us at our [Github repository](https://github.com/Open-Attestation/open-attestation).
- We are currently building a new version of the schema compatible with W3C VC. This is very experimental and whatever is available for V2 documents are also available for V3 documents:
  - [OA schema v3](https://schema.openattestation.com/3.0/schema.json)
  - Typings: `import {v3} from "@govtechsg/open-attestation"`.
  - Type guard: `utils.isWrappedV3Document`.
  - Wrapping: `__unsafe__use__it__at__your__own__risks__wrapDocument` 
    - future usage: `wrapDocument(document, {version: "open-attestation/3.0"})`
  - Example docs in `tests/fixtures/v3`
- There are extra utilities available: 
  - Refer to the [utils](https://github.com/Open-Attestation/open-attestation/blob/master/src/shared/utils/utils.ts) component for the full list of utilities. 
