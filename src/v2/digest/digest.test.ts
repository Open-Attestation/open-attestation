import { digestDocument as digestDocumentV2, flattenHashArray } from "./digest";
import { SchematisedDocument, SchemaId } from "../../shared/@types/document";

describe("digest", () => {
  describe("flattenHashArray", () => {
    test("flattens objects and hash them individually", () => {
      const testData = {
        key1: "value1",
        key2: {
          "key2-1": "value2-1",
          "key2-2": "value2-2",
          "key2-3": ["value2-3-1", "value2-3-2", "value2-3-3"]
        },
        key3: ["value3-1", "value3-2"]
      };

      const expectedOutput = [
        "1549a7b5fac4126fa0fbdea8c156930790691317e30400feb76c0f5cec06b396",
        "bfde44f29cc03f4111c0e0dd5c9551705e9cfb03054e26e01f53c6dabff7aead",
        "877b54b204a759620fd386e531d9a017655377f3645117665409da3c7ff5a61a",
        "1cbeb0dc59c8e303b23bcfd5275211531348da401d971e120c0dded6fbc48c75",
        "433691731088b4455fb31dee9b75fed687fb3acf9886c1359e01d3df3d059990",
        "b75b6e1b511cae653f4bf5a8981e300a53b5e797f8de9ce0f4521d64d28a3e4e",
        "f290dec8eba6913285b09f712ea38e39da8ffdf1de9bf305b90d3b77ae77be96",
        "83cae3b56a3b5b874ddf7d9e237f8527791bde5459bd2d72529395782e6088d0"
      ];

      const targetHash = flattenHashArray(testData);
      expect(targetHash).toEqual(expectedOutput);
    });

    test("maintains integrity of other values after some values were replaced with undefined", () => {
      const testData = {
        key1: "value1",
        key2: {
          "key2-1": "value2-1",
          "key2-2": "value2-2",
          "key2-3": ["value2-3-1", undefined, "value2-3-3"]
        },
        key3: [undefined, "value3-2"]
      };

      const expectedOutput = [
        "1549a7b5fac4126fa0fbdea8c156930790691317e30400feb76c0f5cec06b396",
        "bfde44f29cc03f4111c0e0dd5c9551705e9cfb03054e26e01f53c6dabff7aead",
        "877b54b204a759620fd386e531d9a017655377f3645117665409da3c7ff5a61a",
        "1cbeb0dc59c8e303b23bcfd5275211531348da401d971e120c0dded6fbc48c75",
        "b75b6e1b511cae653f4bf5a8981e300a53b5e797f8de9ce0f4521d64d28a3e4e",
        "83cae3b56a3b5b874ddf7d9e237f8527791bde5459bd2d72529395782e6088d0"
      ];

      const targetHash = flattenHashArray(testData);
      expect(targetHash).toEqual(expectedOutput);
    });

    test("maintains integrity of other values after some values were removed", () => {
      const testData = {
        key1: "value1",
        key2: {
          "key2-1": "value2-1",
          "key2-2": "value2-2",
          // eslint-disable-next-line no-sparse-arrays
          "key2-3": ["value2-3-1", , "value2-3-3"]
        },
        // eslint-disable-next-line no-sparse-arrays
        key3: [, "value3-2"]
      };

      const expectedOutput = [
        "1549a7b5fac4126fa0fbdea8c156930790691317e30400feb76c0f5cec06b396",
        "bfde44f29cc03f4111c0e0dd5c9551705e9cfb03054e26e01f53c6dabff7aead",
        "877b54b204a759620fd386e531d9a017655377f3645117665409da3c7ff5a61a",
        "1cbeb0dc59c8e303b23bcfd5275211531348da401d971e120c0dded6fbc48c75",
        "b75b6e1b511cae653f4bf5a8981e300a53b5e797f8de9ce0f4521d64d28a3e4e",
        "83cae3b56a3b5b874ddf7d9e237f8527791bde5459bd2d72529395782e6088d0"
      ];

      const targetHash = flattenHashArray(testData);
      expect(targetHash).toEqual(expectedOutput);
    });
  });

  describe("digestDocument", () => {
    test("digests a document with all visible content correctly", () => {
      const document: SchematisedDocument = {
        version: SchemaId.v2,
        schema: "foo",
        data: {
          key1: "value1",
          key2: {
            "key2-1": "value2-1",
            "key2-2": "value2-2",
            "key2-3": ["value2-3-1", "value2-3-2", "value2-3-3"]
          },
          key3: ["value3-1", "value3-2"]
        }
      };
      const expectedDigest = "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c";
      const digest = digestDocumentV2(document);
      expect(digest).toBe(expectedDigest);
    });

    it("handles shadowed keys correctly", () => {
      const documentWithShadowedKey: SchematisedDocument = {
        version: SchemaId.v2,
        schema: "foo",
        data: {
          foo: {
            bar: "qux"
          },
          "foo.bar": "asd"
        }
      };

      const digestFn = () => digestDocumentV2(documentWithShadowedKey);

      expect(digestFn).toThrow("Key names must not have . in them");
    });

    test("digests a document with some visible content correctly", () => {
      const document: SchematisedDocument = {
        version: SchemaId.v2,
        schema: "foo",
        data: {
          key1: "value1",
          key2: {
            "key2-1": "value2-1",
            "key2-3": ["value2-3-1", undefined, "value2-3-3"]
          },
          key3: [undefined, "value3-2"]
        },
        privacy: {
          obfuscatedData: [
            "877b54b204a759620fd386e531d9a017655377f3645117665409da3c7ff5a61a",
            "433691731088b4455fb31dee9b75fed687fb3acf9886c1359e01d3df3d059990",
            "f290dec8eba6913285b09f712ea38e39da8ffdf1de9bf305b90d3b77ae77be96"
          ]
        }
      };

      const expectedDigest = "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c";
      const digest = digestDocumentV2(document);
      expect(digest).toBe(expectedDigest);
    });

    test("digests a document with no visible content correctly", () => {
      const document: SchematisedDocument = {
        version: SchemaId.v2,
        schema: "foo",
        data: {},
        privacy: {
          obfuscatedData: [
            "1549a7b5fac4126fa0fbdea8c156930790691317e30400feb76c0f5cec06b396",
            "bfde44f29cc03f4111c0e0dd5c9551705e9cfb03054e26e01f53c6dabff7aead",
            "877b54b204a759620fd386e531d9a017655377f3645117665409da3c7ff5a61a",
            "1cbeb0dc59c8e303b23bcfd5275211531348da401d971e120c0dded6fbc48c75",
            "433691731088b4455fb31dee9b75fed687fb3acf9886c1359e01d3df3d059990",
            "b75b6e1b511cae653f4bf5a8981e300a53b5e797f8de9ce0f4521d64d28a3e4e",
            "f290dec8eba6913285b09f712ea38e39da8ffdf1de9bf305b90d3b77ae77be96",
            "83cae3b56a3b5b874ddf7d9e237f8527791bde5459bd2d72529395782e6088d0"
          ]
        }
      };

      const expectedDigest = "3826fcc2b0122a3555051a29b09b8cf5a6a8c776abf5da4e966ab92dbdbd518c";
      const digest = digestDocumentV2(document);
      expect(digest).toBe(expectedDigest);
    });
  });
});
