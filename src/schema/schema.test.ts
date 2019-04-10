import { addSchema, Schema, validate } from "./schema";
import { Document } from "../privacy";

const schemaV1 = {
  $id: "http://example.com/schemaV1.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    key1: {
      type: "number"
    }
  },
  required: ["key1"],
  additionalProperties: false
};

const schemaV2 = {
  $id: "http://example.com/schemaV2.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    key1: {
      type: "number"
    },
    key2: {
      type: "number"
    }
  },
  required: ["key1"],
  additionalProperties: false
};

describe("schema", () => {
  describe("addSchema", () => {
    test("adds a schema", () => {
      const schemaV0: Schema = {
        $id: "http://example.com/schemaV0.json",
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          key1: {
            type: "number"
          }
        },
        required: ["key1"],
        additionalProperties: false
      };
      addSchema(schemaV0);
    });
    test("does not throw when the same schema is added again", () => {
      const schemaV0: Schema = {
        $id: "http://example.com/schemaV0.json",
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          key1: {
            type: "number"
          }
        },
        required: ["key1"],
        additionalProperties: false
      };
      addSchema(schemaV0);
      addSchema(schemaV0);
      addSchema(schemaV0);
    });
  });
  describe("validate", () => {
    test("throws when the schema cannot be found/has not been added", () => {
      const document: Document = {
        schema: "http://example.com/schemaV1.json",
        data: {
          key1: 2
        }
      };
      const valid = () => validate(document);
      expect(valid).toThrow("no schema");
    });

    describe("after adding schema", () => {
      beforeAll(() => {
        addSchema(schemaV1);
      });
      test("returns true for passing documents", () => {
        const document: Document = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key1: 2
          }
        };
        expect(validate(document)).toBe(true);
      });

      test("returns false for failing documents", () => {
        const document: Document = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key: 2
          }
        };
        expect(validate(document)).toBe(false);
      });
    });

    describe("after adding multiple schemas", () => {
      beforeAll(() => {
        addSchema(schemaV2);
      });
      test("returns true for passing documents", () => {
        const document: Document = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key1: 2
          }
        };
        const document2: Document = {
          schema: "http://example.com/schemaV2.json",
          data: {
            key1: 2,
            key2: 3
          }
        };
        expect(validate(document)).toBe(true);
        expect(validate(document2)).toBe(true);
      });

      test("returns false for failing documents", () => {
        const document: Document = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key: 2
          }
        };
        const document2: Document = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key2: 2
          }
        };
        expect(validate(document)).toBe(false);
        expect(validate(document2)).toBe(false);
      });
    });

    describe("document with schema object", () => {
      test("returns true for valid document", () => {
        const document: Document = {
          data: {
            key1: 2
          }
        };
        expect(validate(document, schemaV1)).toBe(true);
      });

      test("returns false for invalid documents", () => {
        const document: Document = {
          data: {}
        };
        const document2: Document = {
          data: {
            key1: 2,
            key2: 4
          }
        };

        expect(validate(document, schemaV1)).toBe(false);
        expect(validate(document2, schemaV1)).toBe(false);
      });
    });
  });
});
