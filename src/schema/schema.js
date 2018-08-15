import Ajv from "ajv";

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

export const validate = (document, schema) =>
  // TODO: Retrieve the data from the document without the salt first
  // const unsaltedData = unsalted(data)
  schema
    ? ajv.validate(schema, document.data)
    : ajv.validate(document.schema, document.data);
