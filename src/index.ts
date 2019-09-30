import { digestDocument } from "./digest";
import { Schema, validate } from "./schema";
import { sign } from "./signature";
import { setData } from "./privacy";
import { saltData } from "./privacy/salt";
import * as utils from "./utils";

const createDocument = (data: any, schema: Schema) => {
  const document = setData({ schema: schema.$id, data: null }, saltData(data));
  const valid = validate(document, schema);
  if (valid) {
    return document;
  }
  throw new Error(`Invalid document:${JSON.stringify(data, null, 2)}`);
};

export const issueDocument = (data: any, schema: Schema) => {
  const document = createDocument(data, schema);
  return sign(document, [digestDocument(document)]);
};

export const issueDocuments = (dataArray: any[], schema: Schema) => {
  const documents = dataArray.map(data => createDocument(data, schema));
  const batchHashes = documents.map(digestDocument);
  return documents.map(doc => sign(doc, batchHashes));
};

export { digestDocument } from "./digest";
export { getData, obfuscateDocument, Document, SchematisedDocument, SignedDocument } from "./privacy";
export { addSchema, validate as validateSchema } from "./schema";
export { checkProof, MerkleTree, sign, verify as verifySignature } from "./signature";
export { utils };
