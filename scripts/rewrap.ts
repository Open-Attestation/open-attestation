/* eslint-disable @typescript-eslint/camelcase */
import {
  __unsafe__use__it__at__your__own__risks__wrapDocuments,
  __unsafe__use__it__at__your__own__risks__wrapDocument
} from "../src/index";
import input from "../src/3.0/schema/sample-credential.json";
import { writeFileSync } from "fs";

// This script rewraps the verifiable credentials in v3

const run = async () => {
  const individual = await __unsafe__use__it__at__your__own__risks__wrapDocument(input as any);
  writeFileSync("./src/3.0/schema/sample-verifiable-credential.json", JSON.stringify(individual, null, 2));

  const [wrapped1, wrapped2] = await __unsafe__use__it__at__your__own__risks__wrapDocuments([input, input] as any);
  writeFileSync("./src/3.0/schema/batched-verifiable-credential-1.json", JSON.stringify(wrapped1, null, 2));
  writeFileSync("./src/3.0/schema/batched-verifiable-credential-2.json", JSON.stringify(wrapped2, null, 2));
};

run();
