/** @type {import('ts-jest').JestConfigWithTsJest} */

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules", "dist"],
  watchPathIgnorePatterns: ["/node_modules/", "dist"],
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
};

export default config;
