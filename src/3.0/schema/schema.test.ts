/* eslint-disable jest/no-try-expect */
import { cloneDeep, omit, set } from "lodash";
import { __unsafe__use__it__at__your__own__risks__wrapDocument as wrapDocument } from "../../index";
import { $id } from "./schema.json";
import sample from "./sample-credential.json";
import { SchemaId } from "../../shared/@types/document";
import { IdentityProofType, Method, OpenAttestationDocument, TemplateType } from "../../__generated__/schema.3.0";

const sampleDoc = sample as OpenAttestationDocument;

// eslint-disable-next-line jest/no-disabled-tests
describe("schema/3.0", () => {
  it("should be valid with sample document", async () => {
    const document = cloneDeep(sampleDoc);
    const wrappedDocument = await wrapDocument(document, {
      externalSchemaId: $id,
      version: SchemaId.v3
    });
    expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  });
  it("should be valid when adding any additional data", async () => {
    const document = { ...cloneDeep(sampleDoc), key1: "some" };
    const wrappedDocument = await wrapDocument(document, {
      externalSchemaId: $id,
      version: SchemaId.v3
    });
    expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  });

  describe("@context", () => {
    it("should be invalid when @context contains valid URI but is not https://www.w3.org/2018/credentials/v1", async () => {
      // This should not have AJV validation errors as it's only caught after
      const document = { ...cloneDeep(sampleDoc), "@context": ["https://example.com"] };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toThrow(
        "https://www.w3.org/2018/credentials/v1 needs to be first in the list of contexts"
      );
    });

    it("should be invalid when @context is a string", async () => {
      // @context MUST be an ordered set in W3C VC data model, see https://www.w3.org/TR/vc-data-model/#contexts
      const document = { ...cloneDeep(sampleDoc), "@context": "https://www.w3.org/2018/credentials/v1" };
      // @ts-expect-error
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "type",
            dataPath: "['@context']",
            schemaPath: "#/properties/%40context/type",
            params: { type: "array" },
            message: "should be array"
          }
        ]
      );
    });
    it("should be invalid when @context has https://www.w3.org/2018/credentials/v1 but is not the first", async () => {
      // This should not have AJV validation errors as it's only caught during validateW3C
      const document = {
        ...cloneDeep(sampleDoc),
        "@context": ["https://www.w3.org/2018/credentials/examples/v1", "https://www.w3.org/2018/credentials/v1"]
      };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toThrow(
        "https://www.w3.org/2018/credentials/v1 needs to be first in the list of contexts"
      );
    });
    it("should be invalid if @context contains one invalid URI", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), "@context": ["https://www.w3.org/2018/credentials/v1", "any"] };

      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "format",
            dataPath: "['@context'][1]",
            schemaPath: "#/properties/%40context/items/format",
            params: { format: "uri" },
            message: 'should match format "uri"'
          }
        ]
      );
    });
  });

  describe("id", () => {
    it("should be valid when id is missing", async () => {
      // id can be optional, see https://www.w3.org/TR/vc-data-model/#identifiers
      const document = { ...omit(cloneDeep(sampleDoc), "id") };
      const wrappedDocument = await wrapDocument(document, {
        externalSchemaId: $id,
        version: SchemaId.v3
      });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when id contains a valid URI", async () => {
      // id can be optional, but if present, it has to be a URI, see https://www.w3.org/TR/vc-data-model/#identifiers
      const wrappedDocument = await wrapDocument(
        { ...cloneDeep(sampleDoc), id: "https://example.com" },
        { externalSchemaId: $id, version: SchemaId.v3 }
      );
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be invalid when id exists but is not a valid URI", async () => {
      // id can be optional, but if present, it has to be a URI, see https://www.w3.org/TR/vc-data-model/#identifiers
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), id: "any123" };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "format",
            dataPath: ".id",
            schemaPath: "#/properties/id/format",
            params: { format: "uri" },
            message: 'should match format "uri"'
          }
        ]
      );
    });
  });

  describe("reference", () => {
    it("should be valid if reference is missing", async () => {
      // For now, reference is not compulsory
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "reference") };
      const wrappedDocument = await wrapDocument(document, {
        externalSchemaId: $id,
        version: SchemaId.v3
      });
      expect(wrappedDocument.schema).toBe(SchemaId.v3);
    });
    it("should be invalid if reference is undefined", async () => {
      // But if reference is given, it should not be undefined as we cannot salt undefined values
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), reference: undefined };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Unexpected data 'undefined' in 'reference'"
      );
    });
    it("should be invalid if reference is null", async () => {
      // But if reference is given, it should not be null as we cannot salt null values
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), reference: null };

      // @ts-expect-error reference cannot be undefined or null
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            dataPath: ".reference",
            keyword: "type",
            message: "should be string",
            params: { type: "string" },
            schemaPath: "#/properties/reference/type"
          }
        ]
      );
    });
  });

  describe("name", () => {
    it("should be valid if name is missing", async () => {
      // For now, it's not compulsory
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "name") };
      const wrappedDocument = await wrapDocument(document, {
        externalSchemaId: $id,
        version: SchemaId.v3
      });
      expect(wrappedDocument.schema).toBe(SchemaId.v3);
    });
    it("should be invalid if name is undefined", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), name: undefined };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Unexpected data 'undefined' in 'name'"
      );
    });
    it("should be invalid if name is null", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), name: null };

      // @ts-expect-error name cannot be undefined or null
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            dataPath: ".name",
            keyword: "type",
            message: "should be string",
            params: { type: "string" },
            schemaPath: "#/properties/name/type"
          }
        ]
      );
    });
  });

  describe("type", () => {
    it("should be invalid if type is null", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), type: null };

      // @ts-expect-error type cannot be undefined or null
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            dataPath: ".type",
            keyword: "type",
            message: "should be array",
            params: { type: "array" },
            schemaPath: "#/definitions/type/oneOf/0/type"
          },
          {
            dataPath: ".type",
            keyword: "type",
            message: "should be string",
            params: {
              type: "string"
            },
            schemaPath: "#/definitions/type/oneOf/1/type"
          },
          {
            dataPath: ".type",
            keyword: "oneOf",
            message: "should match exactly one schema in oneOf",
            params: {
              passingSchemas: null
            },
            schemaPath: "#/definitions/type/oneOf"
          }
        ]
      );
    });
    it("should be invalid if type is a string", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), type: "VerifiableCredential" };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Property 'type' must exist and be an array"
      );
    });
    it("should be invalid if type is an array, but does not have VerifiableCredential", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), type: ["DrivingLicenceCredential"] };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Property 'type' must have VerifiableCredential as one of the items"
      );
    });
  });

  describe("validFrom", () => {
    it("should be valid if validFrom is missing", async () => {
      // For now, it's not compulsory and is reserved for a later version of W3C VC Data Model, see https://www.w3.org/TR/vc-data-model/#issuance-date
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "validFrom") };
      const wrappedDocument = await wrapDocument(document, {
        externalSchemaId: $id,
        version: SchemaId.v3
      });
      expect(wrappedDocument.schema).toBe(SchemaId.v3);
    });
    it("should be invalid if validFrom is undefined", async () => {
      // If validFrom is present, it should be an RFC3339 date and time string
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), validFrom: undefined };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Unexpected data 'undefined' in 'validFrom'"
      );
    });
    it("should be invalid if validFrom is null", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), validFrom: null };

      // @ts-expect-error validFrom cannot be undefined or null
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            dataPath: ".validFrom",
            keyword: "type",
            message: "should be string",
            params: { type: "string" },
            schemaPath: "#/properties/validFrom/type"
          }
        ]
      );
    });

    it("should be invalid if validFrom is not in the RFC3339 date and time format", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), validFrom: "some" };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "format",
            dataPath: ".validFrom",
            schemaPath: "#/properties/validFrom/format",
            params: { format: "date-time" },
            message: 'should match format "date-time"'
          }
        ]
      );
    });
  });

  describe("validUntil", () => {
    it("should be valid when validUntil is missing", async () => {
      // validUntil does not exist in our sample document anyways
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "validUntil") };
      const wrappedDocument = await wrapDocument(document, {
        externalSchemaId: $id,
        version: SchemaId.v3
      });
      expect(wrappedDocument.schema).toBe(SchemaId.v3);
    });
    it("should be invalid when validUntil is undefined", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), validUntil: undefined };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Unexpected data 'undefined' in 'validUntil'"
      );
    });
    it("should be invalid when validUntil is null", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), validUntil: null };

      // @ts-expect-error validUntil cannot be undefined or null
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            dataPath: ".validUntil",
            keyword: "type",
            message: "should be string",
            params: { type: "string" },
            schemaPath: "#/properties/validUntil/type"
          }
        ]
      );
    });
    it("should be invalid if validUntil exists and is not in the RFC3339 date and time format", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), validUntil: "some" };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "format",
            dataPath: ".validUntil",
            schemaPath: "#/properties/validUntil/format",
            params: { format: "date-time" },
            message: 'should match format "date-time"'
          }
        ]
      );
    });
  });

  describe("template", () => {
    it("should be valid when type is EMBEDDED_RENDERER", async () => {
      expect.assertions(1);
      const document = set(
        cloneDeep(sampleDoc),
        "openAttestationMetadata.template.type",
        TemplateType.EmbeddedRenderer
      );
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when url starts with http", async () => {
      expect.assertions(1);
      const document = set(cloneDeep(sampleDoc), "openAttestationMetadata.template.url", "http://some.example.com");
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when url starts with https", async () => {
      expect.assertions(1);
      const document = set(cloneDeep(sampleDoc), "openAttestationMetadata.template.url", "https://some.example.com");
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be invalid when adding additional data", async () => {
      expect.assertions(1);
      const document = set(cloneDeep(sampleDoc), "openAttestationMetadata.template.key", "any");
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "additionalProperties",
            dataPath: ".openAttestationMetadata.template",
            schemaPath: "#/properties/openAttestationMetadata/properties/template/additionalProperties",
            params: { additionalProperty: "key" },
            message: "should NOT have additional properties"
          }
        ]
      );
    });
    it("should be invalid if template.name is missing", async () => {
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "openAttestationMetadata.template.name") };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "required",
            dataPath: ".openAttestationMetadata.template",
            schemaPath: "#/properties/openAttestationMetadata/properties/template/required",
            params: { missingProperty: "name" },
            message: "should have required property 'name'"
          }
        ]
      );
    });
    it("should be invalid if template.type is missing", async () => {
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "openAttestationMetadata.template.type") };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "required",
            dataPath: ".openAttestationMetadata.template",
            schemaPath: "#/properties/openAttestationMetadata/properties/template/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]
      );
    });
    it("should be invalid if template.type is not equal to EMBEDDED_RENDERER", async () => {
      expect.assertions(2);
      const document = set(cloneDeep(sampleDoc), "openAttestationMetadata.template.type", "SOMETHING");
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".openAttestationMetadata.template.type",
            schemaPath: "#/properties/openAttestationMetadata/properties/template/properties/type/enum",
            params: { allowedValues: ["EMBEDDED_RENDERER"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if template.url is missing", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      if (document.openAttestationMetadata.template) delete document.openAttestationMetadata.template.url;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".openAttestationMetadata.template",
            schemaPath: "#/properties/openAttestationMetadata/properties/template/required",
            params: { missingProperty: "url" },
            message: "should have required property 'url'"
          }
        ]);
      }
    });
    it("should be invalid if template.url is not an http url", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      if (document.openAttestationMetadata.template) document.openAttestationMetadata.template.url = "ftp://some";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "pattern",
            dataPath: ".openAttestationMetadata.template.url",
            schemaPath: "#/properties/openAttestationMetadata/properties/template/properties/url/pattern",
            params: { pattern: "^(https?)://" },
            message: 'should match pattern "^(https?)://"'
          }
        ]);
      }
    });
  });

  describe("issuer", () => {
    it("should be valid when id is an URI", async () => {
      const document = {
        ...cloneDeep(sampleDoc),

        issuer: { ...sample.issuer, id: "http://example.com" }
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be invalid when adding additional data", async () => {
      expect.assertions(2);

      const document = { ...cloneDeep(sampleDoc), issuer: { ...sample.issuer, key: "any" } };
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "additionalProperties",
            dataPath: ".issuer",
            schemaPath: "#/definitions/issuer/additionalProperties",
            params: { additionalProperty: "key" },
            message: "should NOT have additional properties"
          },
          {
            keyword: "type",
            dataPath: ".issuer",
            schemaPath: "#/properties/issuer/oneOf/1/type",
            params: { type: "string" },
            message: "should be string"
          },
          {
            keyword: "oneOf",
            dataPath: ".issuer",
            schemaPath: "#/properties/issuer/oneOf",
            params: { passingSchemas: null },
            message: "should match exactly one schema in oneOf"
          }
        ]);
      }
    });
    it("should be invalid when id is not a URI", async () => {
      expect.assertions(2);

      const document = { ...cloneDeep(sampleDoc), issuer: { ...sample.issuer, id: "" } };
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "format",
            dataPath: ".issuer.id",
            schemaPath: "#/definitions/issuer/properties/id/format",
            params: { format: "uri" },
            message: 'should match format "uri"'
          },
          {
            keyword: "type",
            dataPath: ".issuer",
            schemaPath: "#/properties/issuer/oneOf/1/type",
            params: { type: "string" },
            message: "should be string"
          },
          {
            keyword: "oneOf",
            dataPath: ".issuer",
            schemaPath: "#/properties/issuer/oneOf",
            params: { passingSchemas: null },
            message: "should match exactly one schema in oneOf"
          }
        ]);
      }
    });
    it("should be invalid if issuer is missing", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      delete document.issuer;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "issuer" },
            message: "should have required property 'issuer'"
          }
        ]);
      }
    });
    it("should be invalid if issuer has no name", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);

      if (typeof document.issuer !== "string") delete document.issuer.name;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".issuer",
            schemaPath: "#/definitions/issuer/required",
            params: { missingProperty: "name" },
            message: "should have required property 'name'"
          },
          {
            keyword: "type",
            dataPath: ".issuer",
            schemaPath: "#/properties/issuer/oneOf/1/type",
            params: { type: "string" },
            message: "should be string"
          },
          {
            keyword: "oneOf",
            dataPath: ".issuer",
            schemaPath: "#/properties/issuer/oneOf",
            params: { passingSchemas: null },
            message: "should match exactly one schema in oneOf"
          }
        ]);
      }
    });
    it("should be invalid if issuer has no id", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);

      // TODO seemed like there will be lots of hassle dealing with string|Issuer
      if (typeof document.issuer !== "string") delete document.issuer.id;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".issuer",
            schemaPath: "#/definitions/issuer/required",
            params: { missingProperty: "id" },
            message: "should have required property 'id'"
          },
          {
            keyword: "type",
            dataPath: ".issuer",
            schemaPath: "#/properties/issuer/oneOf/1/type",
            params: { type: "string" },
            message: "should be string"
          },
          {
            keyword: "oneOf",
            dataPath: ".issuer",
            schemaPath: "#/properties/issuer/oneOf",
            params: { passingSchemas: null },
            message: "should match exactly one schema in oneOf"
          }
        ]);
      }
    });
    it("should be invalid if identity proof has no type", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      delete document.openAttestationMetadata.identityProof?.type;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "required",
              dataPath: ".openAttestationMetadata.identityProof",
              schemaPath: "#/properties/openAttestationMetadata/properties/identityProof/required",
              params: { missingProperty: "type" },
              message: "should have required property 'type'"
            }
          ])
        );
      }
    });
    it("should be invalid if identity proof type is not valid", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      // @ts-expect-error OTHER cannot be assigned to issuer.identityProof.type
      document.openAttestationMetadata.identityProof.type = "OTHER";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "enum",
              dataPath: ".openAttestationMetadata.identityProof.type",
              schemaPath: "#/properties/openAttestationMetadata/properties/identityProof/properties/type/enum",
              params: { allowedValues: ["DNS-TXT", "W3C-DID"] },
              message: "should be equal to one of the allowed values"
            }
          ])
        );
      }
    });
    it("should be invalid if identity proof has no location", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      delete document.openAttestationMetadata.identityProof?.location;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "required",
              dataPath: ".openAttestationMetadata.identityProof",
              schemaPath: "#/properties/openAttestationMetadata/properties/identityProof/required",
              params: { missingProperty: "location" },
              message: "should have required property 'location'"
            }
          ])
        );
      }
    });
  });

  describe("proof", () => {
    it("should be valid when type is DNS-TXT", async () => {
      const document = cloneDeep(sampleDoc);
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when identity proof type is W3C-DID", async () => {
      const document = set(
        cloneDeep(sampleDoc),
        "openAttestationMetadata.identityProof.type",
        IdentityProofType.W3CDid
      );
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when type is W3C-DID and location is a valid DID", async () => {
      const document = cloneDeep(sampleDoc);
      document.openAttestationMetadata.identityProof = {
        type: IdentityProofType.W3CDid,
        location: "did:ethr:0xb9c5714089478a327f09197987f16f9e5d936e8a"
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when type is OpenAttestationProofMethod", async () => {
      const document = cloneDeep(sampleDoc);
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when method is TOKEN_REGISTRY", async () => {
      const document = set(cloneDeep(sampleDoc), "openAttestationMetadata.proof.method", Method.TokenRegistry);
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when method is DOCUMENT_STORE", async () => {
      const document = set(cloneDeep(sampleDoc), "openAttestationMetadata.proof.method", Method.DocumentStore);

      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });

    it("should be invalid when adding additional data in identity proof", async () => {
      expect.assertions(2);
      const document = set(cloneDeep(sampleDoc), "openAttestationMetadata.identityProof.key", "any");
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".openAttestationMetadata.identityProof",
              keyword: "additionalProperties",
              message: "should NOT have additional properties",
              params: { additionalProperty: "key" },
              schemaPath: "#/properties/openAttestationMetadata/properties/identityProof/additionalProperties"
            }
          ])
        );
      }
    });
    it("should be invalid if issuer has no identity proof", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      delete document.openAttestationMetadata.identityProof;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".openAttestationMetadata",
              keyword: "required",
              message: "should have required property 'identityProof'",
              params: { missingProperty: "identityProof" },
              schemaPath: "#/properties/openAttestationMetadata/required"
            }
          ])
        );
      }
    });
    it("should be invalid if proof type is missing", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      delete document.openAttestationMetadata.proof.type;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".openAttestationMetadata.proof",
            schemaPath: "#/properties/openAttestationMetadata/properties/proof/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]);
      }
    });
    it("should be invalid if proof type is not OpenAttestationProofMethod", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);

      // @ts-expect-error Something cannot be assigned to openAttestationMetadata.proof.type
      document.openAttestationMetadata.proof.type = "Something";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".openAttestationMetadata.proof.type",
            schemaPath: "#/properties/openAttestationMetadata/properties/proof/properties/type/enum",
            params: { allowedValues: ["OpenAttestationProofMethod"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if proof method is missing", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      delete document.openAttestationMetadata.proof.method;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".openAttestationMetadata.proof",
            schemaPath: "#/properties/openAttestationMetadata/properties/proof/required",
            params: { missingProperty: "method" },
            message: "should have required property 'method'"
          }
        ]);
      }
    });
    it("should be invalid if proof type is not TOKEN_REGISTRY or DOCUMENT_STORE", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);

      // @ts-expect-error Something cannot be assigned to proof.method
      document.openAttestationMetadata.proof.method = "Something";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".openAttestationMetadata.proof.method",
            schemaPath: "#/properties/openAttestationMetadata/properties/proof/properties/method/enum",
            params: { allowedValues: ["TOKEN_REGISTRY", "DOCUMENT_STORE"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if proof value is missing", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);
      delete document.openAttestationMetadata.proof.value;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".openAttestationMetadata.proof",
            schemaPath: "#/properties/openAttestationMetadata/properties/proof/required",
            params: { missingProperty: "value" },
            message: "should have required property 'value'"
          }
        ]);
      }
    });
  });

  describe("credentialStatus", () => {
    it("should be valid with credentialStatus", async () => {
      const document = {
        ...cloneDeep(sampleDoc),
        credentialStatus: {
          id: "https://example.edu/status/24",
          type: "CredentialStatusList2017"
        }
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be invalid if id is missing", async () => {
      expect.assertions(2);
      const document = {
        ...cloneDeep(sampleDoc),
        credentialStatus: {
          type: "CredentialStatusList2017"
        }
      };

      try {
        // @ts-expect-error credentialStatus.id is missing
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".credentialStatus",
            schemaPath: "#/properties/credentialStatus/required",
            params: { missingProperty: "id" },
            message: "should have required property 'id'"
          }
        ]);
      }
    });
    it("should be invalid if type is missing", async () => {
      expect.assertions(2);
      const document = {
        ...cloneDeep(sampleDoc),
        credentialStatus: {
          id: "https://example.edu/status/24"
        }
      };

      try {
        // @ts-expect-error credentialStatus.type is missing
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".credentialStatus",
            schemaPath: "#/properties/credentialStatus/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]);
      }
    });
  });

  describe("evidence", () => {
    it("should be valid when mimeType is application/pdf", async () => {
      const document = {
        ...cloneDeep(sampleDoc),
        // @ts-expect-error attachments is possibly undefined
        attachments: [{ ...sampleDoc.attachments[0], mimeType: "application/pdf" }]
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when mimeType is image/png", async () => {
      const document = {
        ...cloneDeep(sampleDoc),
        // @ts-expect-error attachments is possibly undefined
        attachments: [{ ...sampleDoc.attachments[0], mimeType: "image/png" }]
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when mimeType is image/jpeg", async () => {
      const document = {
        ...cloneDeep(sampleDoc),
        // @ts-expect-error attachments is possibly undefined
        attachments: [{ ...sampleDoc.attachments[0], mimeType: "image/jpeg" }]
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });

    it("should be invalid when adding additional data", async () => {
      expect.assertions(2);

      // @ts-expect-error attachments is possibly undefined
      const document = { ...cloneDeep(sampleDoc), attachments: [{ ...sampleDoc.attachments[0], key: "any" }] };
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "additionalProperties",
            dataPath: ".attachments[0]",
            schemaPath: "#/properties/attachments/items/additionalProperties",
            params: { additionalProperty: "key" },
            message: "should NOT have additional properties"
          }
        ]);
      }
    });
    it("should be invalid if filename is missing", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);

      // @ts-expect-error attachments is possibly undefined
      delete document.attachments[0].fileName;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".attachments[0]",
            schemaPath: "#/properties/attachments/items/required",
            params: { missingProperty: "fileName" },
            message: "should have required property 'fileName'"
          }
        ]);
      }
    });
    it("should be invalid if mimeType is missing", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);

      // @ts-expect-error attachments is possibly undefined
      delete document.attachments[0].mimeType;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".attachments[0]",
            schemaPath: "#/properties/attachments/items/required",
            params: { missingProperty: "mimeType" },
            message: "should have required property 'mimeType'"
          }
        ]);
      }
    });
    it("should be invalid if data is missing", async () => {
      expect.assertions(2);
      const document = cloneDeep(sampleDoc);

      // @ts-expect-error attachments is possibly undefined
      delete document.attachments[0].data;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".attachments[0]",
            schemaPath: "#/properties/attachments/items/required",
            params: { missingProperty: "data" },
            message: "should have required property 'data'"
          }
        ]);
      }
    });
  });
});
