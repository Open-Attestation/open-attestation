import fs from "fs";
import path from "path";
import { execSync } from "child_process";

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
} else {
  console.log("Not running quicktype");
}
