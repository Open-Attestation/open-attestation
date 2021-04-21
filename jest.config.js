module.exports = {
  preset: "ts-jest",
  setupFiles: ["core-js"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules", "dist"],
  watchPathIgnorePatterns: ["/node_modules/", "dist"],
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
};
