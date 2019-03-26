![Travis Build Status](https://travis-ci.org/OpenCerts/open-attestation.svg?branch=master)

# Open Attestation

Attestation and notary framework for any document types on the blockchain. 

OpenAttestation allows any entity to proof the existence of a document or a batch of documents. It makes use of smart contracts on the Ethereum blockchain to store cryptographic proofs of individual documents. 

This repository allows you to batch the documents to obtain the merkle root of the batch to be committed to the blockchain. It also allows you to verify the signature and schema of the document issued using the OpenAttestation framework. 

Simply define your document schema to start using OpenAttestation!

## JSON Schema

[JSON Schema](http://json-schema.org/) is used to define the shape of the document. OpenAttestation supports schema versioning, simply add all versions of the schema using the `addSchema` method and define the default (or latest) schema for newly batched documents.

## Reference Implementation

[OpenCerts](https://github.com/GovTechSG/open-certificate)

Check out OpenCerts' implementation to understand how OpenAttestation can be used.

## Usage

Sample implementation of OpenAttestation:

```js
const {
  getData,
  issueDocument,
  issueDocuments,
  addSchema,
  verifySignature,
  validateSchema,
  obfuscateDocument
} = require("@govtechsg/open-attestation");

const schema = {
  "$id": "http://example.com/schema-v1.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "key1": {
      "type": "string",
    },
    "key2": {
      "type": "string",
    },
  },
  "required": [ "key1" ],
  "additionalProperties": false,
}

const defaultSchema = schema;

// Add all versions of the document schema below for backward compatibility
addSchema(schema);

const issueDocument = data => issueDocument(data, defaultSchema);

const issueDocuments = dataArray => issueDocuments(dataArray, defaultSchema);

const obfuscateFields = (document, fields) =>
  obfuscateDocument(document, fields);

const documentData = document => getData(document);

module.exports = {
  issueDocument,
  issueDocuments,
  verifySignature,
  validateSchema,
  obfuscateFields,
  documentData
};

```

## API References

### Signing documents

`issueDocuments` takes in an array of document as well as a schema and returns the batched documents. It computes the merkle root of the batch and appends the signature to each document. This merkle root can be published on the blockchain and queried against to prove the provenance of the document issued this way. 

```js
const schema = {
  "$id": "http://example.com/schema-v1.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "key1": {
      "type": "string",
    },
    "key2": {
      "type": "string",
    },
  },
  "required": [ "key1" ],
  "additionalProperties": false,
}

const datum = [{
  key1: 'test',
},{
  key1: 'hello',
  key2: 'item2',
},{
  key1: 'item1',
  key2: 'item4',
},{
  key1: 'item2',
}];

signedDocuments = issueDocuments(datum, schema);
console.log(signedDocuments);
```

### Validate schema of document

`validateSchema` checks that the document conforms to the data structure as specified by the schema. 

```js
const validatedSchema = validateSchema(signedDocument);
console.log(validatedSchema);
```

### Verify signature of document

`verifysignature` checks that the signature of the document corresponds to the actual content in the document. In addition, it checks that the target hash (hash of the document content), is part of the set of documents issued in the batch using the proofs.

Note that this method does not check against the blockchain or any registry if this document has been published. The merkle root of this document need to be checked against a publicly accessible document store (can be a smart contract on the blockchain).

```js
const verified = verifySignature(signedDocument);
console.log(verified);
```

### Retrieving document data

`getData` returns the original data stored in the document, in a readable format.

```js
const data = getData(signedDocument);
console.log(data);
```

### Obfuscating data

`obfuscateFields` removes a key-value pair from the document's data section, without causing the file hash to change. This can be used to generate a new document containing a subset of the original data, yet allow the recipient to proof the provenance of the document. 

```js
const newData = obfuscateFields(signedDocument, 'key1');
console.log(newData);
```


## Test

```
npm run test
```

