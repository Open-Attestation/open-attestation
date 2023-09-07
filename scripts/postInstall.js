/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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
  console.log('"Creating types from src/4.0/schema/schema.json"');
  execSync(
    quicktype +
      " -s schema -o src/__generated__/schema.4.0.ts -t OpenAttestationDocument --just-types src/4.0/schema/schema.json --no-date-times"
  );
} else {
  console.log("Not running quicktype");
}
