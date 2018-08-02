const _ = require('lodash');
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
      signedDocument = issueDocument(document, schema);
      expect(signedDocument.schema).to.be.equal('http://example.com/schema-v1.json');
      expect(signedDocument.data.key1).to.contain('test');
      expect(signedDocument.signature.type).to.equal('SHA3MerkleProof');
      expect(signedDocument.signature.targetHash).to.exist;
      expect(signedDocument.signature.merkleRoot).to.exist;
      expect(signedDocument.signature.proof).to.deep.equal([]);
      expect(signedDocument.signature.merkleRoot).to.equal(signedDocument.signature.targetHash);
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

    it('does not allow for the same merkle root to be generated', () => {
      const newDocument = issueDocument(document, schema);
      expect(signedDocument.signature.merkleRoot)
        .to.not.equal(newDocument.signature.merkleRoot);
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
      signedDocuments.forEach((doc, i) => {
        expect(doc.schema).to.be.equal('http://example.com/schema-v1.json');
        expect(doc.signature.type).to.equal('SHA3MerkleProof');
        expect(doc.data.key1).to.contain(datum[i].key1);
        expect(doc.signature.targetHash).to.exist;
        expect(doc.signature.merkleRoot).to.exist;
        expect(doc.signature.proof.length).to.deep.equal(2);
      });
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

    it('does not allow for same merkle root to be generated', () => {
      const newSignedDocuments = issueDocuments(datum, schema);
      expect(signedDocuments[0].signature.merkleRoot)
      .to.not.equal(newSignedDocuments[0].signature.merkleRoot);
    });
  });
})