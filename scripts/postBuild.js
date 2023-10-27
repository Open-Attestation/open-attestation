/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const standaloneCode = require("ajv/dist/standalone").default;
const Ajv = require("ajv");
const { clone, cloneDeepWith } = require("lodash");

const openAttestationSchemav2 = require(path.join(process.cwd(), "src/2.0/schema/schema.json"));
const openAttestationSchemav3 = require(path.join(process.cwd(), "src/3.0/schema/schema.json"));

// remove enum and pattern from the schema
function transformSchema(schema) {
  const excludeKeys = ["enum", "pattern"];
  function omit(value) {
    if (value && typeof value === "object") {
      const key = excludeKeys.find((key) => value[key]);
      if (key) {
        const node = clone(value);
        excludeKeys.forEach((key) => {
          delete node[key];
        });
        return node;
      }
    }
  }

  const newSchema = cloneDeepWith(schema, omit);
  // because we remove check on enum (DNS-DID, DNS-TXT, etc.) the identity proof can match multiple sub schema in v2.
  // so here we change oneOf to anyOf, so that if more than one identityProof matches, it still passes
  if (newSchema?.definitions?.identityProof?.oneOf) {
    newSchema.definitions.identityProof.anyOf = newSchema?.definitions?.identityProof?.oneOf;
    delete newSchema?.definitions?.identityProof?.oneOf;
  }
  return newSchema;
}

console.log('"Creating strict compiled schema for v2 and v3"');
const addFormats = require("ajv-formats").default;

let strictAjv = new Ajv({
  allErrors: true,
  allowUnionTypes: true,
  schemas: [openAttestationSchemav2, openAttestationSchemav3],
  code: { source: true },
}).addKeyword("deprecationMessage");
addFormats(strictAjv);

fs.writeFileSync(path.join(__dirname, "../src/__generated__/compiled_schema_strict.js"), standaloneCode(strictAjv));

console.log('"Creating non-strict compiled schema for v2 and v3"');
// custom ajv for loose schema validation
// it will allow invalid format, invalid pattern and invalid enum
let nonStrictAjv = new Ajv({
  allErrors: true,
  allowUnionTypes: true,
  schemas: [transformSchema(openAttestationSchemav2), transformSchema(openAttestationSchemav3)],
  code: { source: true },
  validateFormats: false,
}).addKeyword("deprecationMessage");
addFormats(nonStrictAjv);

fs.writeFileSync(
  path.join(__dirname, "../src/__generated__/compiled_schema_non_strict.js"),
  standaloneCode(nonStrictAjv)
);
