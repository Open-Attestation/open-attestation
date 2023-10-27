import { ValidateFunction } from "ajv/dist/core.js";
import strictCompiledSchema from "../__generated__/compiled_schema_strict.js";
import nonStrictCompiledSchema from "../__generated__/compiled_schema_non_strict.js";

export const getSchema = (key: string, mode = "strict"): any => {
  const schema =
    mode === "strict"
      ? strictCompiledSchema[key as keyof typeof strictCompiledSchema]
      : nonStrictCompiledSchema[key as keyof typeof nonStrictCompiledSchema];
  if (!schema) throw new Error(`Could not find ${key} schema`);
  return schema as ValidateFunction;
};
