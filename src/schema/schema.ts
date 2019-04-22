import * as Ajv from "ajv";
import { getData, SignedDocument } from "../privacy";

const ajv = new Ajv();

export interface Schema {
  id?: string;
  $id?: string;
  $schema?: string;
  type?: string;
  properties?: any;
  required?: string[];
  additionalProperties?: boolean;
}

export const addSchema = (schema: Schema) => {
  try {
    ajv.addSchema(schema, schema.id);
  } catch (e) {
    // Ignore error if schema already exist
    if (!e.message.includes("already exists")) {
      throw e;
    }
  }
};

export const validate = (document: SignedDocument, schema?: Schema) => {
  // TODO document.schema is set as mandatory here because for the moment it can't be made required in the interface
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = schema ? ajv.validate(schema, getData(document)) : ajv.validate(document.schema!, getData(document));
  // eslint-disable-next-line no-console
  // console.log(ajv.errors); // TODO: properly feedback error
  return result;
};
