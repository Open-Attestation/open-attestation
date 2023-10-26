import { AnyValidateFunction } from "ajv/dist/core.js";
import compiledSchema from "../__generated__/compiled_schema.js";

export const getSchema = (key: string): any => {
  const schema = compiledSchema[key as keyof typeof compiledSchema];
  if (!schema) throw new Error(`Could not find ${key} schema`);
  return schema as AnyValidateFunction;
};
