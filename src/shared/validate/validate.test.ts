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

  // describe("validateW3C", () => {
  //   test("should accept a valid RFC3986 URI", () => {
  //     expect.assertions(1);

  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore ignore typescript for this test
  //     const document: VerifiableCredential = {
  //       "@context": [
  //         "https://www.w3.org/2018/credentials/v1",
  //         "https://www.w3.org/2018/credentials/examples/v1"
  //       ],
  //       "id": "http://example.edu/credentials/58473",
  //       "type": ["VerifiableCredential", "AlumniCredential"],
  //       "issuer": "https://example.edu/issuers/14",
  //       "issuanceDate": "2010-01-01T19:23:24Z",
  //       "credentialSubject": {
  //         "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
  //         "alumniOf": "Example University"
  //       },
  //       "proof": {
  //         "type": "RsaSignature2018"
  //       }
  //     };

  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore ignore typescript for this test
  //     const valid = () => validateW3C(document);
  //     expect(valid).toThrow("Property `issuer` id must be a a valid RFC 3986 URI");
  //   });
  // });
});
