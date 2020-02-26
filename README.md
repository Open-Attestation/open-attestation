[![CircleCI](https://circleci.com/gh/Open-Attestation/open-attestation.svg?style=svg)](https://circleci.com/gh/Open-Attestation/open-attestation)

# Open Attestation

Attestation and notary framework for any document types on the blockchain.

OpenAttestation allows any entity to proof the existence of a document or a batch of documents. It makes use of smart contracts on the Ethereum blockchain to store cryptographic proofs of individual documents.

This repository allows you to batch the documents to obtain the merkle root of the batch to be committed to the blockchain. It also allows you to verify the signature of the document wrapped using the OpenAttestation framework.

## API References

### Wrapping documents

`wrapDocuments` takes in an array of document and returns the batched documents. Each document must be valid regarding the version of the schema used (see below) It computes the merkle root of the batch and appends the signature to each document. This merkle root can be published on the blockchain and queried against to prove the provenance of the document issued this way.

This function accept a second optional parameter to specify the version of open-attestation you want to use. By default, open-attestation will use schema v2.

The `wrapDocument` function is identical but accept only one document.

```js
const document = {
  id: "SERIAL_NUMBER_123",
  $template: {
    name: "CUSTOM_TEMPLATE",
    type: "EMBEDDED_RENDERER",
    url: "https://localhost:3000/renderer"
  },
  issuers: [
    {
      name: "DEMO STORE",
      tokenRegistry: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
      identityProof: {
        type: "DNS-TXT",
        location: "tradetrust.io"
      }
    }
  ],
  recipient: {
    name: "Recipient Name"
  },
  unknownKey: "unknownValue",
  attachments: [
    {
      filename: "sample.pdf",
      type: "application/pdf",
      data: "BASE64_ENCODED_FILE"
    }
  ]
};

wrappedDocuments = wrapDocuments([document, { ...document, id: "different id" }]); // will ensure document is valid regarding open-attestation v2 schema
console.log(wrappedDocuments);
wrappedDocuments = wrapDocuments([document, { ...document, id: "different id" }], { version: 'open-attestation/3.0' }); // will ensure document is valid regarding open-attestation v3 schema
console.log(wrappedDocuments);
```

### Validate schema of document

`validateSchema` checks that the document conforms to open attestation data structure.

```js
const validatedSchema = validateSchema(wrappedDocument);
console.log(validatedSchema);
```

### Verify signature of document

`verifysignature` checks that the signature of the document corresponds to the actual content in the document. In addition, it checks that the target hash (hash of the document content), is part of the set of documents wrapped in the batch using the proofs.

Note that this method does not check against the blockchain or any registry if this document has been published. The merkle root of this document need to be checked against a publicly accessible document store (can be a smart contract on the blockchain).

```js
const verified = verifySignature(wrappedDocument);
console.log(verified);
```

### Retrieving document data

`getData` returns the original data stored in the document, in a readable format.

```js
const data = getData(wrappedDocument);
console.log(data);
```

### Obfuscating data

`obfuscateDocument` removes a key-value pair from the document's data section, without causing the file hash to change. This can be used to generate a new document containing a subset of the original data, yet allow the recipient to proof the provenance of the document.

```js
const newData = obfuscateDocument(wrappedDocument, "key1");
console.log(newData);
```

## Test

```
npm run test
```
