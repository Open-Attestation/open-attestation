import fs from "fs";
import path from "path";
import { ContextUrl } from "../src/4.0/context";

const OUTPUT_DIR = path.resolve("./src/4.0/contexts/__generated__");

// make sure the output directory exists
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const CONTEXTS_TO_FETCH = Object.values(ContextUrl);

const sb: string[] = [`const contextsMap = new Map<string, string>();`];
Promise.all(
  CONTEXTS_TO_FETCH.map(async (url) => {
    const context = await (await fetch(url)).json();
    sb.push(`contextsMap.set("${url}", \`${JSON.stringify(context)}\`);`);
  })
).then(() => {
  sb.push(`export { contextsMap };`);
  fs.writeFileSync(path.join(OUTPUT_DIR, "index.ts"), sb.join("\n"));
});
