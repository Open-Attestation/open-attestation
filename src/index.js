import { digestDocument } from "./digest";
import { addSchema, validate } from "./schema";
import { sign, verify } from "./signature";
import { getData, setData, obfuscateDocument } from "./privacy";

const createDocument = (data, schema) => {
  const document = setData({ schema: schema.$id }, data);
  const valid = validate(document, schema);
  if (valid) {
    return document;
  }
  throw new Error(`Invalid document:${JSON.stringify(data, null, 2)}`);
};

const issueDocument = (data, schema) => {
  const document = createDocument(data, schema);
  const signedDocument = sign(document, [digestDocument(document)]);
  return signedDocument;
};

const issueDocuments = (dataArray, schema) => {
  const documents = dataArray.map(data => createDocument(data, schema));
  const batchHashes = documents.map(digestDocument);
  const signedDocuments = documents.map(doc => sign(doc, batchHashes));
  return signedDocuments;
};

module.exports = {
  getData,
  issueDocument,
  issueDocuments,
  digestDocument,
  obfuscateDocument,
  addSchema,
  sign,
  validateSchema: validate,
  verifySignature: verify
};
