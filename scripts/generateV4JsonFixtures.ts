import fs from "fs";
import path from "path";
import * as V4_FIXTURES from "../src/4.0/fixtures";

const OUTPUT_DIR = path.resolve("./test/fixtures/v4/__generated__");

// make sure the output directory exists
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const [key, value] of Object.entries(V4_FIXTURES)) {
  fs.writeFileSync(
    path.join(OUTPUT_DIR, key.replace(/_/g, "-").toLowerCase() + ".json"),
    JSON.stringify(value, null, 2)
  );
}
