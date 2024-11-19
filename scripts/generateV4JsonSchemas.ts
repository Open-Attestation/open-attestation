import fs from "fs";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { OAVerifiableCredential, DigestedOAVerifiableCredential, SignedOAVerifiableCredential } from "../src/4.0/types";

const OUTPUT_DIR = path.resolve("./src/4.0/jsonSchemas/__generated__");

// make sure the output directory exists
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const ZOD_SCHEMAS = [
  {
    filename: "v4-oa-vc.schema.json",
    schemaName: "OAVerifiableCredential",
    zodSchema: OAVerifiableCredential,
  },
  {
    filename: "v4-digested-oa-vc.schema.json",
    schemaName: "DigestedOAVerifiableCredential",
    zodSchema: DigestedOAVerifiableCredential,
  },
  {
    filename: "v4-signed-oa-vc.schema.json",
    schemaName: "SignedOAVerifiableCredential",
    zodSchema: SignedOAVerifiableCredential,
  },
];

for (const { filename, zodSchema, schemaName } of ZOD_SCHEMAS) {
  const jsonSchema = zodToJsonSchema(zodSchema, schemaName);

  fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(jsonSchema, null, 2));
}
