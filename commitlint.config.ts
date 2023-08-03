import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],

  // Add your own rules. See http://marionebl.github.io/commitlint
  rules: {},
};

module.exports = Configuration;
