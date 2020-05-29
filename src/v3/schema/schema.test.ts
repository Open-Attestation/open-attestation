// disable to check error properties, tried with objectContaining but didnt work
/* eslint-disable jest/no-try-expect */
import { cloneDeep, omit } from "lodash";
import { OpenAttestationCredentialWithInnerIssuer, wrapDocument } from "../../index";
import { $id } from "./schema.json";
import sample from "./sample-document.json";
import { SchemaId } from "../../shared/@types/document";
import { IdentityProofType, Method, TemplateType } from "../../__generated__/schemaV3";

const sampleDoc = sample as OpenAttestationCredentialWithInnerIssuer;

// eslint-disable-next-line jest/no-disabled-tests
describe("schema/v3.0", () => {
  it("should be valid with sample document", async () => {
    const document = { ...cloneDeep(sampleDoc) };
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
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
        "Unexpected value 'undefined' in 'reference'"
      );
    });
    it("should be invalid if reference is null", async () => {
      // But if reference is given, it should not be null as we cannot salt null values
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), reference: null };
      // @ts-expect-error reference must be undefined or null
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Cannot convert undefined or null to object"
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
        "Unexpected value 'undefined' in 'name'"
      );
    });
    it("should be invalid if name is null", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), name: null };
      // TODO FIXME <- ASK LAURENT: what's this
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Cannot convert undefined or null to object"
      );
    });
  });

  describe("type", () => {
    it("should be invalid if type is null", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), type: null };
      // TODO FIXME <- ASK LAURENT: what's this
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Cannot convert undefined or null to object"
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
        "Unexpected value 'undefined' in 'validFrom'"
      );
    });
    it("should be invalid if validFrom is null", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), validFrom: null };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Cannot convert undefined or null to object"
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
        "Unexpected value 'undefined' in 'validUntil'"
      );
    });
    it("should be invalid when validUntil is null", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), validUntil: null };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "Cannot convert undefined or null to object"
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
      const document = {
        ...cloneDeep(sampleDoc),
        template: { ...sampleDoc.template, type: TemplateType.EmbeddedRenderer }
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when url starts with http", async () => {
      expect.assertions(1);
      const document = {
        ...cloneDeep(sampleDoc),
        template: { ...sampleDoc.template, url: "http://some.example.com" }
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when url starts with https", async () => {
      expect.assertions(1);
      const document = {
        ...cloneDeep(sampleDoc),
        template: { ...sampleDoc.template, url: "https://some.example.com" }
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be invalid when adding additional data", async () => {
      expect.assertions(1);
      const document = {
        ...cloneDeep(sampleDoc),
        template: { ...sampleDoc.template, key: "any" }
      };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "additionalProperties",
            dataPath: ".template",
            schemaPath: "#/properties/template/additionalProperties",
            params: { additionalProperty: "key" },
            message: "should NOT have additional properties"
          }
        ]
      );
    });
    it("should be invalid if template is missing", async () => {
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "template") };
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "template" },
            message: "should have required property 'template'"
          }
        ]
      );
    });
    it("should be invalid if template.name is missing", async () => {
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "template.name") };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "required",
            dataPath: ".template",
            schemaPath: "#/properties/template/required",
            params: { missingProperty: "name" },
            message: "should have required property 'name'"
          }
        ]
      );
    });
    it("should be invalid if template.type is missing", async () => {
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "template.type") };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "validationErrors",
        [
          {
            keyword: "required",
            dataPath: ".template",
            schemaPath: "#/properties/template/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]
      );
    });
    it("should be invalid if template.type is not equal to EMBEDDED_RENDERER", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc), template: { ...sampleDoc.template } };
      // TODO FIXME <- ASK LAURENT: why though
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      document.template.type = "SOMETHING";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".template.type",
            schemaPath: "#/properties/template/properties/type/enum",
            params: { allowedValues: ["EMBEDDED_RENDERER"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if template.url is missing", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc), template: { ...sampleDoc.template } };
      delete document.template.url;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".template",
            schemaPath: "#/properties/template/required",
            params: { missingProperty: "url" },
            message: "should have required property 'url'"
          }
        ]);
      }
    });
    it("should be invalid if template.url is not an http url", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc), template: { ...sampleDoc.template } };
      document.template.url = "ftp://some";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "pattern",
            dataPath: ".template.url",
            schemaPath: "#/properties/template/properties/url/pattern",
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
        // TODO FIXME
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        issuer: { ...sampleDoc.issuer, id: "http://example.com" }
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be invalid when adding additional data", async () => {
      expect.assertions(2);
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document = { ...cloneDeep(sampleDoc), issuer: { ...sampleDoc.issuer, key: "any" } };
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
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document = { ...cloneDeep(sampleDoc), issuer: { ...sampleDoc.issuer, id: "" } };
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
      const document = { ...cloneDeep(sampleDoc) };
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
      const document = { ...cloneDeep(sampleDoc) };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      delete document.issuer.name;
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
      const document = { ...cloneDeep(sampleDoc) };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      delete document.issuer.id;
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
      const document = {
        ...cloneDeep(sampleDoc)
      };
      delete document.issuer.identityProof.type;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "required",
              dataPath: ".issuer.identityProof",
              schemaPath: "#/definitions/issuer/properties/identityProof/required",
              params: { missingProperty: "type" },
              message: "should have required property 'type'"
            }
          ])
        );
      }
    });
    it("should be invalid if identity proof type is not valid", async () => {
      expect.assertions(2);
      const document = {
        ...cloneDeep(sampleDoc)
      };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      document.issuer.identityProof.type = "OTHER";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "enum",
              dataPath: ".issuer.identityProof.type",
              schemaPath: "#/definitions/issuer/properties/identityProof/properties/type/enum",
              params: { allowedValues: ["DNS-TXT", "W3C-DID"] },
              message: "should be equal to one of the allowed values"
            }
          ])
        );
      }
    });
    it("should be invalid if identity proof has no location", async () => {
      expect.assertions(2);
      const document = {
        ...cloneDeep(sampleDoc)
      };
      delete document.issuer.identityProof.location;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "required",
              dataPath: ".issuer.identityProof",
              schemaPath: "#/definitions/issuer/properties/identityProof/required",
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
      const document = {
        ...cloneDeep(sampleDoc)
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when identity proof type is W3C-DID", async () => {
      const document = {
        ...cloneDeep(sampleDoc)
      };
      document.issuer.identityProof.type = IdentityProofType.W3CDid;
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when type is W3C-DID and location is a valid DID", async () => {
      const document = {
        ...cloneDeep(sampleDoc)
      };
      document.issuer.identityProof = {
        type: IdentityProofType.W3CDid,
        location: "did:ethr:0xb9c5714089478a327f09197987f16f9e5d936e8a"
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when type is OpenAttestationProofMethod", async () => {
      const document = { ...cloneDeep(sampleDoc) };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when method is TOKEN_REGISTRY", async () => {
      const document = {
        ...cloneDeep(sampleDoc),
        oaProof: { ...sampleDoc.oaProof, method: Method.TokenRegistry }
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when method is DOCUMENT_STORE", async () => {
      const document = {
        ...cloneDeep(sampleDoc),
        oaProof: { ...sampleDoc.oaProof, method: Method.DocumentStore }
      };
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });

    it("should be invalid when adding additional data in identity proof", async () => {
      expect.assertions(2);
      const document = {
        ...cloneDeep(sampleDoc),
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof, key: "any" } }
      };
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "additionalProperties",
              dataPath: ".issuer.identityProof",
              schemaPath: "#/definitions/issuer/properties/identityProof/additionalProperties",
              params: { additionalProperty: "key" },
              message: "should NOT have additional properties"
            }
          ])
        );
      }
    });
    it("should be invalid if issuer has no identity proof", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc) };
      delete document.issuer.identityProof;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "required",
              dataPath: ".issuer",
              schemaPath: "#/definitions/issuer/required",
              params: { missingProperty: "identityProof" },
              message: "should have required property 'identityProof'"
            }
          ])
        );
      }
    });
    it("should be invalid if proof type is missing", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc) };
      delete document.oaProof.type;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".oaProof",
            schemaPath: "#/properties/oaProof/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]);
      }
    });
    it("should be invalid if proof type is not OpenAttestationProofMethod", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc) };
      // @ts-expect-error
      document.oaProof.type = "Something";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".oaProof.type",
            schemaPath: "#/properties/oaProof/properties/type/enum",
            params: { allowedValues: ["OpenAttestationProofMethod"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if proof method is missing", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc), oaProof: { ...sampleDoc.oaProof } };
      delete document.oaProof.method;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".oaProof",
            schemaPath: "#/properties/oaProof/required",
            params: { missingProperty: "method" },
            message: "should have required property 'method'"
          }
        ]);
      }
    });
    it("should be invalid if proof type is not TOKEN_REGISTRY or DOCUMENT_STORE", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc), oaProof: { ...sampleDoc.oaProof } };
      // @ts-expect-error
      document.oaProof.method = "Something";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".oaProof.method",
            schemaPath: "#/properties/oaProof/properties/method/enum",
            params: { allowedValues: ["TOKEN_REGISTRY", "DOCUMENT_STORE"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if proof value is missing", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc), oaProof: { ...sampleDoc.oaProof } };
      delete document.oaProof.value;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".oaProof",
            schemaPath: "#/properties/oaProof/required",
            params: { missingProperty: "value" },
            message: "should have required property 'value'"
          }
        ]);
      }
    });
  });

  describe("evidence", () => {
    it("should be valid when mimeType is application/pdf", async () => {
      const document = {
        ...cloneDeep(sampleDoc),
        // TODO FIXME
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        evidence: [{ ...sampleDoc.evidence[0], mimeType: "application/pdf" }]
      };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when mimeType is image/png", async () => {
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document = { ...cloneDeep(sampleDoc), evidence: [{ ...sampleDoc.evidence[0], mimeType: "image/png" }] };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when mimeType is image/jpeg", async () => {
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document = { ...cloneDeep(sampleDoc), evidence: [{ ...sampleDoc.evidence[0], mimeType: "image/jpeg" }] };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });

    it("should be invalid when adding additional data", async () => {
      expect.assertions(2);
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document = { ...cloneDeep(sampleDoc), evidence: [{ ...sampleDoc.evidence[0], key: "any" }] };
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "additionalProperties",
            dataPath: ".evidence[0]",
            schemaPath: "#/properties/evidence/items/additionalProperties",
            params: { additionalProperty: "key" },
            message: "should NOT have additional properties"
          }
        ]);
      }
    });
    it("should be invalid if filename is missing", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc) };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      delete document.evidence[0].fileName;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".evidence[0]",
            schemaPath: "#/properties/evidence/items/required",
            params: { missingProperty: "fileName" },
            message: "should have required property 'fileName'"
          }
        ]);
      }
    });
    it("should be invalid if mimeType is missing", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc) };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      delete document.evidence[0].mimeType;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".evidence[0]",
            schemaPath: "#/properties/evidence/items/required",
            params: { missingProperty: "mimeType" },
            message: "should have required property 'mimeType'"
          }
        ]);
      }
    });
    it("should be invalid if mimeType is not one of the specified enum value", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc) };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      document.evidence[0].mimeType = "Something";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".evidence[0].mimeType",
            schemaPath: "#/properties/evidence/items/properties/mimeType/enum",
            params: { allowedValues: ["application/pdf", "image/png", "image/jpeg"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if data is missing", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc) };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      delete document.evidence[0].data;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".evidence[0]",
            schemaPath: "#/properties/evidence/items/required",
            params: { missingProperty: "data" },
            message: "should have required property 'data'"
          }
        ]);
      }
    });
    it("should be invalid if type is missing", async () => {
      expect.assertions(2);
      const document = { ...cloneDeep(sampleDoc) };
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      delete document.evidence[0].type;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".evidence[0]",
            schemaPath: "#/properties/evidence/items/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]);
      }
    });
  });
});
