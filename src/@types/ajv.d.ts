declare module Ajv {
    interface Ajv {
        validate(schemaKeyRef: object | string | boolean, data: any): boolean
    }
}