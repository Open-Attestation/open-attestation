import Ajv from "ajv";
import { getData } from "../privacy";

const ajv = new Ajv();

export const addSchema = schema => {
  try {
    ajv.addSchema(schema, schema.id);
  } catch (e) {
    // Ignore error if schema already exist
    if (!e.message.includes("already exists")) {
      throw e;
    }
  }
};

export const validate = (document, schema) => {
  const result = schema
    ? ajv.validate(schema, getData(document))
    : ajv.validate(document.schema, getData(document));
  // eslint-disable-next-line no-console
  console.log(ajv.errors); // TODO: properly feedback error
  return result;
};
