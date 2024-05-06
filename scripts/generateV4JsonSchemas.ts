import fs from "fs";
import path from "path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { V4Document, V4WrappedDocument, V4SignedWrappedDocument } from "../src/4.0/types";

const OUTPUT_DIR = path.resolve("./src/4.0/jsonSchemas/__generated__");

// make sure the output directory exists
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const ZOD_SCHEMAS = [
  {
    filename: "v4-document.schema.json",
    schemaName: "v4Document",
    zodSchema: V4Document,
  },
  {
    filename: "v4-wrapped-document.schema.json",
    schemaName: "v4WrappedDocument",
    zodSchema: V4WrappedDocument,
  },
  {
    filename: "v4-signed-wrapped-document.schema.json",
    schemaName: "v4SignedWrappedDocument",
    zodSchema: V4SignedWrappedDocument,
  },
];

for (const { filename, zodSchema, schemaName } of ZOD_SCHEMAS) {
  const jsonSchema = zodToJsonSchema(zodSchema, schemaName);

  fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(jsonSchema, null, 2));
}
