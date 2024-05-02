import fs from "fs";
import path from "path";
import * as FIXTURES from "../fixtures";

const PATH_TO_GENERATED_FIXTURES = path.resolve(__dirname, "../../../test/fixtures/v4/__generated__");

describe("assert fixtures matches generated JSON fixtures", () => {
  for (const fixtureName of Object.keys(FIXTURES)) {
    const jsonFixtureFilename = fixtureName.replace(/_/g, "-").toLowerCase() + ".json";

    test(`${jsonFixtureFilename} should match the one defined in fixtures.ts`, () => {
      const fixture = FIXTURES[fixtureName as keyof typeof FIXTURES];
      const jsonFixture = fs.readFileSync(path.resolve(PATH_TO_GENERATED_FIXTURES, jsonFixtureFilename), "utf-8");
      expect(fixture).toEqual(JSON.parse(jsonFixture));
    });
  }
});
