import Ajv from "ajv";
export declare const validateSchema: (document: any, validator: Ajv.ValidateFunction) => Ajv.ErrorObject[];
export declare const getSchema: (key: string) => Ajv.ValidateFunction;
