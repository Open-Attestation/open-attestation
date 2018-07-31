const {digestDocument} = require('./digest');
const {addSchema, validate} = require('./schema');
const {sign,verify} = require('./signature');

const createDocument = (data, schema) => {
  // TODO: Add privacy filter here
  const document = {
    schema: schema.$id,
    data,
  };
  const valid = validate(document, schema);
  if(valid){
    return document;
  }else{
    throw new Error(`Invalid document:${JSON.stringify(data,null,2)}`);
  }
}

const issueDocument = (data, schema) => {
  const document = createDocument(data, schema);
  const signedDocument = sign(document, [digestDocument(document)]);
  return signedDocument;
}

const issueDocuments = (dataArray, schema) => {
  const documents = dataArray.map((data) => createDocument(data, schema));
  const batchHashes = documents.map(digestDocument);
  const signedDocuments = documents.map((doc) => sign(doc, batchHashes));
  return signedDocuments;
}

module.exports = {
  issueDocument,
  issueDocuments,
  digestDocument,
  addSchema,
  sign,
  validateSchema: validate,
  verifySignature: verify,
}