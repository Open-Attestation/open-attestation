import resolve from "rollup-plugin-node-resolve"; // for resolving nodejs modules
import commonjs from "rollup-plugin-commonjs"; // for resolving require()
import autoExternal from "rollup-plugin-auto-external"; // automatically including node_modules stuff as external
import json from "rollup-plugin-json"; // for loading json files
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    output: [
      {
        name: "open-attestation",
        file: pkg.browser,
        format: "umd"
      },
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [resolve(), commonjs(), autoExternal(), json()]
  }
];
