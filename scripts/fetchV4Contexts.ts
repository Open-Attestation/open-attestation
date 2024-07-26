import fs from "fs";
import path from "path";
import { ContextUrl, urlToSafeFilename } from "../src/4.0/context";

const OUTPUT_DIR = path.resolve("./src/4.0/contexts/__generated__");

// make sure the output directory exists
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const CONTEXTS_TO_FETCH = Object.values(ContextUrl);

for (const url of CONTEXTS_TO_FETCH) {
  fetch(url)
    .then((res) => res.json())
    .then((context) => {
      const filename = urlToSafeFilename(url);
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(context, null, 2));
    })
    .catch((err) => {
      console.error(`Unable to fetch OA v4.0 context`, err);
    });
}
