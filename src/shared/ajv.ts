import Ajv from "ajv";
import addFormats from "ajv-formats";
import openAttestationSchemav2 from "../2.0/schema/schema.json";
import openAttestationSchemav3 from "../3.0/schema/schema.json";
import { CurrentOptions } from "ajv/dist/core";

const defaultTransform = (schema: Record<string, any>) => schema;
export const buildAjv = (
  options: CurrentOptions & { transform: (schema: Record<string, any>) => Record<string, any> } = {
    transform: defaultTransform,
  }
): Ajv => {
  const { transform, ...ajvOptions } = options;
  const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, ...ajvOptions });
  addFormats(ajv);
  ajv.addKeyword("deprecationMessage");
  ajv.compile(transform(openAttestationSchemav2));
  ajv.compile(transform(openAttestationSchemav3));
  return ajv;
};

const localAjv = buildAjv();
export const getSchema = (key: string, ajv = localAjv) => {
  const schema = ajv.getSchema(key);
  if (!schema) throw new Error(`Could not find ${key} schema`);
  return schema;
};
