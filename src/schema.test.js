const { addSchema, validate } = require("./schema");

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
    it("adds a schema", () => {
      const schemaV0 = {
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
    it("does not throw when the same schema is added again", () => {
      const schemaV0 = {
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
    it("throws when the schema cannot be found/has not been added", () => {
      const document = {
        schema: "http://example.com/schemaV1.json",
        data: {
          key1: 2
        }
      };
      const valid = () => validate(document);
      expect(valid).to.throw("no schema");
    });

    describe("after adding schema", () => {
      before(() => {
        addSchema(schemaV1);
      });
      it("returns true for passing documents", () => {
        const document = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key1: 2
          }
        };
        expect(validate(document)).to.be.true;
      });

      it("returns false for failing documents", () => {
        const document = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key: 2
          }
        };
        expect(validate(document)).to.be.false;
      });
    });

    describe("after adding multiple schemas", () => {
      before(() => {
        addSchema(schemaV2);
      });
      it("returns true for passing documents", () => {
        const document = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key1: 2
          }
        };
        const document2 = {
          schema: "http://example.com/schemaV2.json",
          data: {
            key1: 2,
            key2: 3
          }
        };
        expect(validate(document)).to.be.true;
        expect(validate(document2)).to.be.true;
      });

      it("returns false for failing documents", () => {
        const document = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key: 2
          }
        };
        const document2 = {
          schema: "http://example.com/schemaV1.json",
          data: {
            key2: 2
          }
        };
        expect(validate(document)).to.be.false;
        expect(validate(document2)).to.be.false;
      });
    });

    describe("document with schema object", () => {
      it("returns true for valid document", () => {
        const document = {
          data: {
            key1: 2
          }
        };
        expect(validate(document, schemaV1)).to.be.true;
      });

      it("returns false for invalid documents", () => {
        const document = {
          data: {}
        };
        const document2 = {
          data: {
            key1: 2,
            key2: 4
          }
        };

        expect(validate(document, schemaV1)).to.be.false;
        expect(validate(document2, schemaV1)).to.be.false;
      });
    });
  });
});
