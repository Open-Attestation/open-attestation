const {
  getData,
  issueDocument,
  issueDocuments,
  digestDocument,
  obfuscateDocument,
  addSchema,
  sign,
  validateSchema,
  verifySignature,
} = require('../src/index');

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

const expectedDocuments = [
  {
    "schema": "http://example.com/schema-v1.json",
    "data": {
      "key1": "test"
    },
    "privacy": {},
    "signature": {
      "type": "SHA3MerkleProof",
      "targetHash": "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54",
      "proof": [
        "5edbd8ef9008666f3f7dbb88c0ab8e16ceda3dfcfd3401c8a940ef1f75dcd5ab",
        "1939ed27bfb786079269f4215d4b34de07525a9105394cf3f1849f0949afa2c4"
      ],
      "merkleRoot": "d32eac5b9695e00917e86041f527cd394b99e6c73366762ce40814b25c3f2653"
    }
  },
  {
    "schema": "http://example.com/schema-v1.json",
    "data": {
      "key1": "hello",
      "key2": "item2"
    },
    "privacy": {},
    "signature": {
      "type": "SHA3MerkleProof",
      "targetHash": "f83ab45ee162d8745ceb260a05149abc33a52a8efae81ed4c66b766945aa80d9",
      "proof": [
        "e20e8b2ae5874860486e06a8b7506a16e2ac3bef77457622731718715fe14f02",
        "2dd7ff47612ae3a8416030c5824ef11062ac6bcaecac813f2e30674907771f8a"
      ],
      "merkleRoot": "d32eac5b9695e00917e86041f527cd394b99e6c73366762ce40814b25c3f2653"
    }
  },
  {
    "schema": "http://example.com/schema-v1.json",
    "data": {
      "key1": "item1",
      "key2": "item4"
    },
    "privacy": {},
    "signature": {
      "type": "SHA3MerkleProof",
      "targetHash": "e20e8b2ae5874860486e06a8b7506a16e2ac3bef77457622731718715fe14f02",
      "proof": [
        "f83ab45ee162d8745ceb260a05149abc33a52a8efae81ed4c66b766945aa80d9",
        "2dd7ff47612ae3a8416030c5824ef11062ac6bcaecac813f2e30674907771f8a"
      ],
      "merkleRoot": "d32eac5b9695e00917e86041f527cd394b99e6c73366762ce40814b25c3f2653"
    }
  },
  {
    "schema": "http://example.com/schema-v1.json",
    "data": {
      "key1": "item2"
    },
    "privacy": {},
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
];

describe('E2E Test Scenarios', () => {
  describe('Issuing a single documents', () => {
    const document = datum[0];
    let signedDocument;

    it('fails for malformed data', () => {
      const malformedData = {
        ...document,
        key3: 'moooo',
      };
      const action = () =>issueDocument(malformedData, schema);
      expect(action).to.throw('Invalid document');
    });

    it('creates a signed document', () => {
      const expectedDocument = {
        "schema": "http://example.com/schema-v1.json",
        "data": {
          "key1": "test"
        },
        "privacy": {},
        "signature": {
          "type": "SHA3MerkleProof",
          "targetHash": "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54",
          "proof": [],
          "merkleRoot": "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54"
        }
      };
      signedDocument = issueDocument(document, schema);
      expect(signedDocument).to.deep.equal(expectedDocument);
    });
    
    it('checks that document is signed correctly', () => {
      const verified = verifySignature(signedDocument);
      expect(verified).to.be.true;
    });

    it('checks that document conforms to the schema', () => {
      addSchema(schema);
      const validatedSchema = validateSchema(signedDocument);
      expect(validatedSchema).to.be.true;
    });

    it('checks that data extracted are the same as input', () => {
      const data = getData(signedDocument);
      expect(data).to.deep.equal(datum[0]);
    });
  });

  describe('Issuing a batch of documents', () => {
    let signedDocuments;

    it('fails if there is a malformed document', () => {
      const malformedDatum = [
        ...datum,
        {
          cow: 'moo',
        }
      ]
      const action = () =>issueDocument(malformedDatum, schema);
      expect(action).to.throw('Invalid document');
    });

    it('creates a batch of documents if all are in the right format', () => {
      signedDocuments = issueDocuments(datum, schema);
      expect(signedDocuments).to.deep.equal(expectedDocuments);
    });

    it('checks that documents are signed correctly', () => {
      const verified = signedDocuments.reduce(
        (prev, curr) => verifySignature(curr) && prev,
        true
      );
      expect(verified).to.be.true;
    });

    it('checks that documents conforms to the schema', () => {
      addSchema(schema);
      const validatedSchema = signedDocuments.reduce(
        (prev, curr) => validateSchema(curr) && prev,
        true
      );
      expect(validatedSchema).to.be.true;
    });

    it('checks that data extracted are the same as input', () => {
      signedDocuments.forEach((doc, i) => {
        const data = getData(doc);
        expect(data).to.deep.equal(datum[i]);
      });
    });
  });
})