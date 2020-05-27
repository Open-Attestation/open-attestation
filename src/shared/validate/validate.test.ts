import Ajv from "ajv";
import { validateSchema } from "./validate";
import { SchematisedDocument, SchemaId } from "../@types/document";

const schema = {
  $id: "http://example.com/schema.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    key1: {
      type: "number"
    }
  },
  required: ["key1"],
  additionalProperties: true
};

describe("validate", () => {
  describe("validateSchema", () => {
    test("throws when the schema cannot be found/has not been added", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore ignore typescript for this test
      const document: SchematisedDocument = {
        schema: "http://example.com/schema.json",
        data: {
          key1: 2
        }
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore ignore typescript for this test
      const valid = () => validateSchema(document);
      expect(valid).toThrow("No schema validator provided");
    });

    describe("with one schema", () => {
      test("returns empty array for passing documents", () => {
        const ajv = new Ajv({ allErrors: true });
        const document = {
          version: SchemaId.v3,
          schema: "http://example.com/schema.json",
          key1: 2
        };
        expect(validateSchema(document, ajv.compile(schema))).toStrictEqual([]);
      });

      test("returns array with errors for failing documents", () => {
        const ajv = new Ajv({ allErrors: true });
        const document = {
          version: SchemaId.v3,
          schema: "http://example.com/schema.json",
          key1: "2"
        };
        expect(validateSchema(document, ajv.compile(schema))).toStrictEqual([
          {
            dataPath: ".key1",
            keyword: "type",
            message: "should be number",
            params: {
              type: "number"
            },
            schemaPath: "#/properties/key1/type"
          }
        ]);
      });
    });
  });
});
