module.exports = {
  preset: "ts-jest",
  setupFiles: ["core-js"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules", "dist"]
};
