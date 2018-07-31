const Ajv = require('ajv');

const ajv = new Ajv();

const addSchema = (schema) => {
  ajv.addSchema(schema, schema.id);
}

const validate = (document, schema) => {
  return schema
    ? ajv.validate(schema, document.data)
    : ajv.validate(document.schema, document.data);
}

module.exports = {
  addSchema,
  validate,
}