# Open Attestation

## Usage

Example of signed document:

```js
{
  "schema": "http://example.com/schema-v1.json",
  "data": {
    "key1": "item2"
  },
  "signature": {
    "type": "SHA3MerkleProof",
    "targetHash": "5edbd8ef9008666f3f7dbb88c0ab8e16ceda3dfcfd3401c8a940ef1f75dcd5ab",
    "proof": [
      "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54",
      "1939ed27bfb786079269f4215d4b34de07525a9105394cf3f1849f0949afa2c4"
    ],
    "merkleRoot": "d32eac5b9695e00917e86041f527cd394b99e6c73366762ce40814b25c3f2653"
  }
}
```

### Signing documents

Bulk signing of document:

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

signedDocument = issueDocuments(datum, schema);
```

### Validate schema of document

```
const validatedSchema = validateSchema(signedDocument);
console.log(validatedSchema);
```

### Verify signature of document

```
const verified = verifySignature(signedDocument);
console.log(verified);
```


## Test

```
npm run test
```

