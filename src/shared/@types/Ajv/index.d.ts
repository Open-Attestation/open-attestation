declare namespace AjvOverride {
  interface Ajv {
    addSchema(schema: object[] | object, key?: string): Ajv;
    validate(schemaKeyRef: object | string | boolean, data: any): boolean;
  }
}
