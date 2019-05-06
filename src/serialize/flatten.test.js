const { flatten } = require("./flatten");

describe("flattenWithGlobalFilters", () => {
  const document = {
    foo: {
      bar: "qux"
    }
  };
  const flattenedDocument = {
    "foo.bar": "qux"
  };
  const documentWithPeriodKey = {
    "foo.bar": "lod"
  };

  const existingOptions = {
    coercion: [
      {
        test: (_, value) => {
          if (value === "qux") throw new Error("was called");
          else return false;
        }
      }
    ]
  };

  it("should work without additional options", () => {
    expect(flatten(document)).to.deep.equal(flattenedDocument);
  });

  it("should throw when there is period in object property name", () => {
    expect(() => flatten(documentWithPeriodKey)).to.throw(
      "Key names must not have . in them"
    );
  });

  it("should not clobber passed in coercions", () => {
    expect(() => flatten(document, existingOptions)).to.throw("was called");
  });

  it("should still throw when there are passed in coercions and there is a period in object property name", () => {
    expect(() => flatten(documentWithPeriodKey, existingOptions)).to.throw(
      "Key names must not have . in them"
    );
  });

  it("should not clobber existing options", () => {
    expect(flatten(document, { delimiter: "|" })).to.deep.equal({
      "foo|bar": "qux"
    });
  });
});
