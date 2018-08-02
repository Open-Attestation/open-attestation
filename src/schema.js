const Ajv = require('ajv');

const ajv = new Ajv();

const addSchema = (schema) => {
  try{
    ajv.addSchema(schema, schema.id);
  }catch(e){
    // Ignore error if schema already exist
    if(!e.message.includes('already exists')){throw(e)};
  }
}

const validate = (document, schema) => {
  // TODO: Retrieve the data from the document without the salt first
  // const unsaltedData = unsalted(data)
  return schema
    ? ajv.validate(schema, document.data)
    : ajv.validate(document.schema, document.data);
}

module.exports = {
  addSchema,
  validate,
}