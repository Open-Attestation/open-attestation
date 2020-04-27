import { flatten } from "./flatten";

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
        test: (_: any, value: any) => {
          if (value === "qux") throw new Error("was called");
          else return false;
        }
      }
    ]
  };

  it("should work without additional options", () => {
    expect(flatten(document)).toStrictEqual(flattenedDocument);
  });

  it("should throw when there is period in object property name", () => {
    expect(() => flatten(documentWithPeriodKey)).toThrow("Key names must not have . in them");
  });

  it("should not clobber passed in coercions", () => {
    expect(() => flatten(document, existingOptions)).toThrow("was called");
  });

  it("should still throw when there are passed in coercions and there is a period in object property name", () => {
    expect(() => flatten(documentWithPeriodKey, existingOptions)).toThrow("Key names must not have . in them");
  });

  it("should not clobber existing options", () => {
    expect(flatten(document, { delimiter: "|" })).toStrictEqual({
      "foo|bar": "qux"
    });
  });
});
