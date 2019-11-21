import commonjs from "rollup-plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "./dist/cjs/index.js", // umd will run from cjs build to produce a single bundled file, any better idea ?
  output: {
    file: "./dist/index.umd.js",
    format: "umd",
    name: "openAttestation"
  },
  plugins: [commonjs(), json()]
};
