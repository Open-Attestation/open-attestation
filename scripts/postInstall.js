/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const standaloneCode = require("ajv/dist/standalone").default;
const Ajv = require("ajv").default;

const openAttestationSchemav2 = require("../src/2.0/schema/schema.json");
const openAttestationSchemav3 = require("../src/3.0/schema/schema.json");
const quicktype = path.join(process.cwd(), "node_modules", ".bin", "quicktype");

if (fs.existsSync(quicktype) && process.env.npm_config_production !== "true") {
  console.log('"Creating types from src/2.0/schema/schema.json"');
  execSync(
    quicktype +
      " -s schema -o src/__generated__/schema.2.0.ts -t OpenAttestationDocument --just-types src/2.0/schema/schema.json --no-date-times"
  );
  console.log('"Creating types from src/3.0/schema/schema.json"');
  execSync(
    quicktype +
      " -s schema -o src/__generated__/schema.3.0.ts -t OpenAttestationDocument --just-types src/3.0/schema/schema.json --no-date-times"
  );

  console.log('"Creating compiled schema from src/2.0/schema/schema.json and src/3.0/schema/schema.json"');
  const addFormats = require("ajv-formats").default;

  let ajv = new Ajv({
    allErrors: true,
    allowUnionTypes: true,
    schemas: [openAttestationSchemav2, openAttestationSchemav3],
    code: { source: true },
  }).addKeyword("deprecationMessage");
  addFormats(ajv);

  fs.writeFileSync(path.join(__dirname, "../src/__generated__/compiled_schema.js"), standaloneCode(ajv));
} else {
  console.log("Not running quicktype");
}
