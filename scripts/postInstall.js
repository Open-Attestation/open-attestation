/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const quicktype = path.join(process.cwd(), "node_modules", ".bin", "quicktype");

if (fs.existsSync(quicktype) && process.env.npm_config_production !== "true") {
  console.log('"Creating types from src/v2/schema/schema.json"');
  execSync(
    quicktype +
      " -s schema -o src/__generated__/schemaV2.ts -t OpenAttestationDocument --just-types src/v2/schema/schema.json --no-date-times"
  );
  console.log('"Creating types from src/v3/schema/schema.json"');
  execSync(
    quicktype +
      " -s schema -o src/__generated__/schemaV3.ts -t OpenAttestationCredential --just-types src/v3/schema/schema.json --no-date-times"
  );
} else {
  console.log("Not running quicktype");
}
