// disable to check error properties, tried with objectContaining but didnt work
/* eslint-disable jest/no-try-expect */
import { cloneDeep, omit } from "lodash";
import { wrapDocument } from "../../index";
import { $id } from "./schema.json";
import sample from "./sample-document.json";
import { SchemaId } from "../../shared/@types/document";
import { OpenAttestationDocument, TemplateType } from "../../__generated__/schemaV3";

const sampleDoc = sample as OpenAttestationDocument;

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
      version: SchemaId.v3,
      validateTypeWithContext: false
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
    it("should be invalid when @context has https://www.w3.org/2018/credentials/v1 but is not the first", async () => {
      // This should not have AJV validation errors as it's only caught after
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
        version: SchemaId.v3,
        validateTypeWithContext: false
      });
      expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
    });
    it("should be valid when id contains a valid URI", async () => {
      // id can be optional, but if present, it has to be a URI, see https://www.w3.org/TR/vc-data-model/#identifiers
      const wrappedDocument = await wrapDocument(
        { ...cloneDeep(sampleDoc), id: "https://example.com" },
        { externalSchemaId: $id, version: SchemaId.v3, validateTypeWithContext: false }
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
        version: SchemaId.v3,
        validateTypeWithContext: false
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
      // TODO FIXME <- ASK LAURENT: what's this
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
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
        version: SchemaId.v3,
        validateTypeWithContext: false
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
    it("should be invalid if any item in type does not map to any context", async () => {
      // https://github.com/w3c/vc-test-suite/issues/97#issuecomment-537982033
      expect.assertions(1);
      const document = { ...cloneDeep(sampleDoc), type: ["VerifiableCredential", "SomeNonExistentCredential"] };
      await expect(wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 })).rejects.toHaveProperty(
        "message",
        "The property 'SomeNonExistentCredential' in the input was not defined in the context"
      );
    });
  });

  describe("validFrom", () => {
    it.only("should be valid if validFrom is missing", async () => {
      // For now, it's not compulsory and is reserved for a later version of W3C VC Data Model, see https://www.w3.org/TR/vc-data-model/#issuance-date
      expect.assertions(1);
      const document = { ...omit(cloneDeep(sampleDoc), "validFrom") };
      const wrappedDocument = await wrapDocument(document, {
        externalSchemaId: $id,
        version: SchemaId.v3,
        validateTypeWithContext: false
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
      const document = { ...sampleDoc, validFrom: "some" };
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
        version: SchemaId.v3,
        validateTypeWithContext: false
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
      const document = { ...sampleDoc, validUntil: "some" };
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
      const document = { ...sampleDoc, template: { ...sampleDoc.template } };
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
      const document = { ...sampleDoc, template: { ...sampleDoc.template } };
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
      const document = { ...sampleDoc, template: { ...sampleDoc.template } };
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
        ...sampleDoc,
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
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer, key: "any" } };
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
          }
        ]);
      }
    });
    it("should be invalid when adding additional data in identity proof", async () => {
      expect.assertions(2);
      const document = {
        ...sampleDoc,
        // TODO FIXME
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof, key1: "any" } }
      };
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "additionalProperties",
            dataPath: ".issuer.identityProof",
            schemaPath: "#/definitions/issuer/properties/identityProof/additionalProperties",
            params: { additionalProperty: "key1" },
            message: "should NOT have additional properties"
          }
        ]);
      }
    });
    it("should be invalid when id is not a URI", async () => {
      expect.assertions(2);
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer, id: "" } };
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
          }
        ]);
      }
    });
    it("should be invalid if issuer is missing", async () => {
      expect.assertions(2);
      const document = { ...sampleDoc };
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
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer } };
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
          }
        ]);
      }
    });
    it("should be invalid if issuer has no id", async () => {
      expect.assertions(2);
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer } };
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
          }
        ]);
      }
    });
    it("should be invalid if issuer has no identityProof", async () => {
      expect.assertions(2);
      // TODO FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer } };
      delete document.issuer.identityProof;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".issuer",
            schemaPath: "#/definitions/issuer/required",
            params: { missingProperty: "identityProof" },
            message: "should have required property 'identityProof'"
          }
        ]);
      }
    });
    it("should be invalid if identityProof has no type", async () => {
      expect.assertions(2);
      const document = {
        ...sampleDoc,
        // TODO FIXME
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof } }
      };
      delete document.issuer.identityProof.type;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".issuer.identityProof",
            schemaPath: "#/definitions/issuer/properties/identityProof/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]);
      }
    });
    it("should be invalid if identityProof type is not valid", async () => {
      expect.assertions(2);
      const document = {
        ...sampleDoc,
        // TODO FIXME
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof } }
      };
      document.issuer.identityProof.type = "OTHER";
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".issuer.identityProof.type",
            schemaPath: "#/definitions/issuer/properties/identityProof/properties/type/enum",
            params: { allowedValues: ["DNS-TXT", "W3C-DID"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if identityProof has no location", async () => {
      expect.assertions(2);
      const document = {
        ...sampleDoc,
        // TODO FIXME
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof } }
      };
      delete document.issuer.identityProof.location;
      try {
        await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".issuer.identityProof",
            schemaPath: "#/definitions/issuer/properties/identityProof/required",
            params: { missingProperty: "location" },
            message: "should have required property 'location'"
          }
        ]);
      }
    });
  });

  // describe("proof", () => {
  // it("should be valid when type is DNS-TXT", async () => {
  //   const document = {
  //     ...cloneDeep(sampleDoc)
  //   };
  //   const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //   expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  // });
  // it("should be valid when identityProof type is W3C-DID", async () => {
  //   const document = {
  //     ...sampleDoc,
  //     // TODO FIXME ASK LAURENT
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof, type: "W3C-DID" } }
  //   };
  //   console.log(document);
  //   const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //   expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  // });
  // it("should be valid when type is W3C-DID and location is a valid DID", async () => {
  //   const document = {
  //     ...sampleDoc,
  //     issuer: {
  //       // TODO FIXME
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //       // @ts-ignore
  //       ...sampleDoc.issuer,
  //       identityProof: {
  //         ...sampleDoc.issuer.identityProof,
  //         type: "W3C-DID",
  //         location: "did:ethr:0xb9c5714089478a327f09197987f16f9e5d936e8a"
  //       }
  //     }
  //   };
  //   const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //   expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  // });
  //   it("should be valid when type is OpenAttestationSignature2018", async () => {
  //     const document = { ...sampleDoc, proof: { ...sampleDoc.proof, type: "OpenAttestationSignature2018" } };
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  //   });
  //   it("should be valid when method is TOKEN_REGISTRY", async () => {
  //     const document = { ...sampleDoc, proof: { ...sampleDoc.proof, method: "TOKEN_REGISTRY" } };
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  //   });
  //   it("should be valid when method is DOCUMENT_STORE", async () => {
  //     const document = { ...sampleDoc, proof: { ...sampleDoc.proof, method: "DOCUMENT_STORE" } };
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  //   });

  //   it("should be invalid when adding additional data", async () => {
  //     expect.assertions(2);
  //     const document = { ...sampleDoc, proof: { ...sampleDoc.proof, key: "any" } };
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "additionalProperties",
  //           dataPath: ".proof",
  //           schemaPath: "#/properties/proof/additionalProperties",
  //           params: { additionalProperty: "key" },
  //           message: "should NOT have additional properties"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if proof is missing", async () => {
  //     expect.assertions(2);
  //     const document = { ...sampleDoc };
  //     delete document.proof;
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "required",
  //           dataPath: "",
  //           schemaPath: "#/required",
  //           params: { missingProperty: "proof" },
  //           message: "should have required property 'proof'"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if proof type is missing", async () => {
  //     expect.assertions(2);
  //     const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
  //     delete document.proof.type;
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "required",
  //           dataPath: ".proof",
  //           schemaPath: "#/properties/proof/required",
  //           params: { missingProperty: "type" },
  //           message: "should have required property 'type'"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if proof type is not OpenAttestationSignature2018", async () => {
  //     expect.assertions(2);
  //     const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     document.proof.type = "Something";
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "enum",
  //           dataPath: ".proof.type",
  //           schemaPath: "#/properties/proof/properties/type/enum",
  //           params: { allowedValues: ["OpenAttestationSignature2018"] },
  //           message: "should be equal to one of the allowed values"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if proof method is missing", async () => {
  //     expect.assertions(2);
  //     const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
  //     delete document.proof.method;
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "required",
  //           dataPath: ".proof",
  //           schemaPath: "#/properties/proof/required",
  //           params: { missingProperty: "method" },
  //           message: "should have required property 'method'"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if proof type is not TOKEN_REGISTRY or DOCUMENT_STORE", async () => {
  //     expect.assertions(2);
  //     const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     document.proof.method = "Something";
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "enum",
  //           dataPath: ".proof.method",
  //           schemaPath: "#/properties/proof/properties/method/enum",
  //           params: { allowedValues: ["TOKEN_REGISTRY", "DOCUMENT_STORE"] },
  //           message: "should be equal to one of the allowed values"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if proof value is missing", async () => {
  //     expect.assertions(2);
  //     const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
  //     delete document.proof.value;
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "required",
  //           dataPath: ".proof",
  //           schemaPath: "#/properties/proof/required",
  //           params: { missingProperty: "value" },
  //           message: "should have required property 'value'"
  //         }
  //       ]);
  //     }
  //   });
  // });

  // describe("attachments", () => {
  //   it("should be valid when mimeType is application/pdf", async () => {
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0], mimeType: "application/pdf" }] };
  //     const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  //   });
  //   it("should be valid when mimeType is image/png", async () => {
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0], mimeType: "image/png" }] };
  //     const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  //   });
  //   it("should be valid when mimeType is image/jpeg", async () => {
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0], mimeType: "image/jpeg" }] };
  //     const wrappedDocument = await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     expect(wrappedDocument.version).toStrictEqual(SchemaId.v3);
  //   });

  //   it("should be invalid when adding additional data", async () => {
  //     expect.assertions(2);
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0], key: "any" }] };
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "additionalProperties",
  //           dataPath: ".attachments[0]",
  //           schemaPath: "#/properties/attachments/items/additionalProperties",
  //           params: { additionalProperty: "key" },
  //           message: "should NOT have additional properties"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if filename is missing", async () => {
  //     expect.assertions(2);
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
  //     delete document.attachments[0].filename;
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "required",
  //           dataPath: ".attachments[0]",
  //           schemaPath: "#/properties/attachments/items/required",
  //           params: { missingProperty: "filename" },
  //           message: "should have required property 'filename'"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if mimeType is missing", async () => {
  //     expect.assertions(2);
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
  //     delete document.attachments[0].mimeType;
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "required",
  //           dataPath: ".attachments[0]",
  //           schemaPath: "#/properties/attachments/items/required",
  //           params: { missingProperty: "mimeType" },
  //           message: "should have required property 'mimeType'"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if mimeType is not one of the specified enum value", async () => {
  //     expect.assertions(2);
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
  //     document.attachments[0].mimeType = "Something";
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "enum",
  //           dataPath: ".attachments[0].mimeType",
  //           schemaPath: "#/properties/attachments/items/properties/mimeType/enum",
  //           params: { allowedValues: ["application/pdf", "image/png", "image/jpeg"] },
  //           message: "should be equal to one of the allowed values"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if data is missing", async () => {
  //     expect.assertions(2);
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
  //     delete document.attachments[0].data;
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "required",
  //           dataPath: ".attachments[0]",
  //           schemaPath: "#/properties/attachments/items/required",
  //           params: { missingProperty: "data" },
  //           message: "should have required property 'data'"
  //         }
  //       ]);
  //     }
  //   });
  //   it("should be invalid if type is missing", async () => {
  //     expect.assertions(2);
  //     // TODO FIXME
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //     // @ts-ignore
  //     const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
  //     delete document.attachments[0].type;
  //     try {
  //       await wrapDocument(document, { externalSchemaId: $id, version: SchemaId.v3 });
  //     } catch (e) {
  //       expect(e).toHaveProperty("message", "Invalid document");
  //       expect(e).toHaveProperty("validationErrors", [
  //         {
  //           keyword: "required",
  //           dataPath: ".attachments[0]",
  //           schemaPath: "#/properties/attachments/items/required",
  //           params: { missingProperty: "type" },
  //           message: "should have required property 'type'"
  //         }
  //       ]);
  //     }
  //   });
  // });
});
