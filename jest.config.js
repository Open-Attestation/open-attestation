module.exports = {
  preset: "ts-jest",
  setupFiles: ["core-js"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules", "dist"],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"]
};
