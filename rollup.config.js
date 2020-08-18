import commonjs from "rollup-plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "./dist/esm/index.js", // umd will run from esm build to produce a single bundled file, any better idea ?
  output: {
    file: "./dist/index.umd.js",
    format: "umd",
    name: "openAttestation"
  },
  plugins: [commonjs(), json()]
};
