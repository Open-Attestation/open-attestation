import fs from "fs";
import { wrapDocument } from "../wrap";

const OMITTED_FIXTURES = new Set([
  "credential-proof-ok.json",
  "credential-refresh-no-id-fail.json",
  "credential-refresh-no-type-fail.json",
  "credential-refresh-non-url-id-fail.json",
  "credential-issuer-object-no-id-fail.json",
  "credential-validUntil-validFrom-ok.json",
  "presentation-derived-vc-ok.json",
  "presentation-multiple-vc-ok.json",
  "presentation-ok.json",
  "presentation-optional-type-ok.json",
  "presentation-vc-ok.json",
]);
const FIXTURES: Record<string, any> = {};
fs.readdirSync("test/fixtures/w3c-inputs")
  .filter((filename) => {
    return !OMITTED_FIXTURES.has(filename);
  })
  .forEach((filename) => {
    const fileContent = fs.readFileSync(`test/fixtures/w3c-inputs/${filename}`, "utf-8");
    const testName = filename.split(".")[0];
    FIXTURES[testName] = JSON.parse(fileContent);
  });

describe("WC3 vc-data-model-2.0 test suite (CAA 18th April 2024)", () => {
  for (const [testName, vc] of Object.entries(FIXTURES)) {
    // remove file extension

    const assertSuccess = testName.endsWith("ok");
    test(`${testName}`, async () => {
      await expect(wrapDocument(vc, {}))[assertSuccess ? "resolves" : "rejects"].toBeTruthy();
    });
  }
});
