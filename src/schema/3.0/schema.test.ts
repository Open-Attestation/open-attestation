// disable to check error properties, tried with objectContaining but didnt work
/* eslint-disable jest/no-try-expect */
import { issueDocument } from "../../index";
import { $id } from "./schema.json";
import sampleDoc from "./sample-document.json";

describe("open-attestation/3.0", () => {
  it("should be valid with sample document", () => {
    const issuedDocument = issueDocument(sampleDoc, { externalSchemaId: $id, version: "open-attestation/3.0" });
    expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
  });
  it("should be valid when adding any additional data", () => {
    const issuedDocument = issueDocument(
      { ...sampleDoc, key1: "some" },
      { externalSchemaId: $id, version: "open-attestation/3.0" }
    );
    expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
  });

  describe("@context", () => {
    it("should be valid when @context is missing", () => {
      const issuedDocument = issueDocument(
        { ...sampleDoc, "@context": undefined },
        { externalSchemaId: $id, version: "open-attestation/3.0" }
      );
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be valid when @context contains valid uri", () => {
      const issuedDocument = issueDocument(
        { ...sampleDoc, "@context": ["https://example.com"] },
        { externalSchemaId: $id, version: "open-attestation/3.0" }
      );
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });

    it("should be invalid if @context contains one invalid uri", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, "@context": ["any"] };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "format",
            dataPath: "['@context'][0]",
            schemaPath: "#/properties/%40context/items/format",
            params: { format: "uri" },
            message: 'should match format "uri"'
          }
        ]);
      }
    });
  });

  describe("id", () => {
    it("should be valid when id is missing", () => {
      const issuedDocument = issueDocument(
        { ...sampleDoc, id: undefined },
        { externalSchemaId: $id, version: "open-attestation/3.0" }
      );
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be valid when @id contains valid uri", () => {
      const issuedDocument = issueDocument(
        { ...sampleDoc, id: "https://example.com" },
        { externalSchemaId: $id, version: "open-attestation/3.0" }
      );
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
  });

  describe("reference", () => {
    it("should be invalid if reference is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc };
      delete document.reference;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "reference" },
            message: "should have required property 'reference'"
          }
        ]);
      }
    });
    it("should be invalid if reference is undefined", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, reference: undefined };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "reference" },
            message: "should have required property 'reference'"
          }
        ]);
      }
    });
    it("should be invalid if reference is null", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, reference: null };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "type",
            dataPath: ".reference",
            schemaPath: "#/properties/reference/type",
            params: { type: "string" },
            message: "should be string"
          }
        ]);
      }
    });
  });

  describe("name", () => {
    it("should be invalid if name is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc };
      delete document.name;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "name" },
            message: "should have required property 'name'"
          }
        ]);
      }
    });
    it("should be invalid if name is undefined", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, name: undefined };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "name" },
            message: "should have required property 'name'"
          }
        ]);
      }
    });
    it("should be invalid if name is null", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, name: null };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "type",
            dataPath: ".name",
            schemaPath: "#/properties/name/type",
            params: { type: "string" },
            message: "should be string"
          }
        ]);
      }
    });
  });

  describe("type", () => {
    it("should be valid when type is missing", () => {
      const issuedDocument = issueDocument(
        { ...sampleDoc, type: undefined },
        { externalSchemaId: $id, version: "open-attestation/3.0" }
      );
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
  });

  describe("validFrom", () => {
    it("should be invalid if validFrom is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc };
      delete document.validFrom;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "validFrom" },
            message: "should have required property 'validFrom'"
          }
        ]);
      }
    });
    it("should be invalid if validFrom is undefined", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, validFrom: undefined };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "validFrom" },
            message: "should have required property 'validFrom'"
          }
        ]);
      }
    });
    it("should be invalid if validFrom is null", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, validFrom: null };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "type",
            dataPath: ".validFrom",
            schemaPath: "#/properties/validFrom/type",
            params: { type: "string" },
            message: "should be string"
          }
        ]);
      }
    });

    it("should be invalid if validFrom is not a correct date", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, validFrom: "some" };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "format",
            dataPath: ".validFrom",
            schemaPath: "#/properties/validFrom/format",
            params: { format: "date-time" },
            message: 'should match format "date-time"'
          }
        ]);
      }
    });
  });

  describe("validUntil", () => {
    it("should be valid when validUntil is missing", () => {
      const issuedDocument = issueDocument(
        { ...sampleDoc, validUntil: undefined },
        { externalSchemaId: $id, version: "open-attestation/3.0" }
      );
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be invalid if validUntil is not a correct date", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, validUntil: "some" };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "format",
            dataPath: ".validUntil",
            schemaPath: "#/properties/validUntil/format",
            params: { format: "date-time" },
            message: 'should match format "date-time"'
          }
        ]);
      }
    });
  });

  describe("template", () => {
    it("should be valid when type is EMBEDDED_RENDERER", () => {
      const document = { ...sampleDoc, template: { ...sampleDoc.template, type: "EMBEDDED_RENDERER" } };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be valid when url starts with http", () => {
      const document = { ...sampleDoc, template: { ...sampleDoc.template, url: "http://some.example.com" } };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be valid when url starts with https", () => {
      const document = { ...sampleDoc, template: { ...sampleDoc.template, url: "https://some.example.com" } };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });

    it("should be invalid when adding additional data", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, template: { ...sampleDoc.template, key: "any" } };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "additionalProperties",
            dataPath: ".template",
            schemaPath: "#/properties/template/additionalProperties",
            params: { additionalProperty: "key" },
            message: "should NOT have additional properties"
          }
        ]);
      }
    });

    it("should be invalid if template is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc };
      delete document.template;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "template" },
            message: "should have required property 'template'"
          }
        ]);
      }
    });
    it("should be invalid if template.name is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, template: { ...sampleDoc.template } };
      delete document.template.name;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".template",
            schemaPath: "#/properties/template/required",
            params: { missingProperty: "name" },
            message: "should have required property 'name'"
          }
        ]);
      }
    });
    it("should be invalid if template.type is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, template: { ...sampleDoc.template } };
      delete document.template.type;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".template",
            schemaPath: "#/properties/template/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]);
      }
    });
    it("should be invalid if template.type is not equal to EMBEDDED_RENDERER", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, template: { ...sampleDoc.template } };
      document.template.type = "SOMETHING";
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if template.url is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, template: { ...sampleDoc.template } };
      delete document.template.url;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if template.url is not an http url", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, template: { ...sampleDoc.template } };
      document.template.url = "ftp://some";
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be valid when type is DNS-TXT", () => {
      const document = {
        ...sampleDoc,
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof, type: "DNS-TXT" } }
      };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be valid when id is an URI", () => {
      const document = {
        ...sampleDoc,
        issuer: { ...sampleDoc.issuer, id: "http://example.com" }
      };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be invalid when adding additional data", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer, key: "any" } };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid when adding additional data in identity proof", () => {
      expect.assertions(2);
      const document = {
        ...sampleDoc,
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof, key1: "any" } }
      };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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

    it("should be invalid when id is not a URI", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer, id: "" } };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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

    it("should be invalid if issuer is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc };
      delete document.issuer;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if issuer has no name", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer } };
      delete document.issuer.name;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if issuer has no id", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer } };
      delete document.issuer.id;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if issuer has no identityProof", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, issuer: { ...sampleDoc.issuer } };
      delete document.issuer.identityProof;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if identityProof has no type", () => {
      expect.assertions(2);
      const document = {
        ...sampleDoc,
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof } }
      };
      delete document.issuer.identityProof.type;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if identityProof type is not DNS-TXT", () => {
      expect.assertions(2);
      const document = {
        ...sampleDoc,
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof } }
      };
      document.issuer.identityProof.type = "OTHER";
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".issuer.identityProof.type",
            schemaPath: "#/definitions/issuer/properties/identityProof/properties/type/enum",
            params: { allowedValues: ["DNS-TXT"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if identityProof has no location", () => {
      expect.assertions(2);
      const document = {
        ...sampleDoc,
        issuer: { ...sampleDoc.issuer, identityProof: { ...sampleDoc.issuer.identityProof } }
      };
      delete document.issuer.identityProof.location;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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

  describe("proof", () => {
    it("should be valid when type is OpenAttestationSignature2018", () => {
      const document = { ...sampleDoc, proof: { ...sampleDoc.proof, type: "OpenAttestationSignature2018" } };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be valid when method is TOKEN_REGISTRY", () => {
      const document = { ...sampleDoc, proof: { ...sampleDoc.proof, method: "TOKEN_REGISTRY" } };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be valid when method is DOCUMENT_STORE", () => {
      const document = { ...sampleDoc, proof: { ...sampleDoc.proof, method: "DOCUMENT_STORE" } };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });

    it("should be invalid when adding additional data", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, proof: { ...sampleDoc.proof, key: "any" } };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "additionalProperties",
            dataPath: ".proof",
            schemaPath: "#/properties/proof/additionalProperties",
            params: { additionalProperty: "key" },
            message: "should NOT have additional properties"
          }
        ]);
      }
    });
    it("should be invalid if proof is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc };
      delete document.proof;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: "",
            schemaPath: "#/required",
            params: { missingProperty: "proof" },
            message: "should have required property 'proof'"
          }
        ]);
      }
    });
    it("should be invalid if proof type is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
      delete document.proof.type;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".proof",
            schemaPath: "#/properties/proof/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]);
      }
    });
    it("should be invalid if proof type is not OpenAttestationSignature2018", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
      document.proof.type = "Something";
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".proof.type",
            schemaPath: "#/properties/proof/properties/type/enum",
            params: { allowedValues: ["OpenAttestationSignature2018"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if proof method is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
      delete document.proof.method;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".proof",
            schemaPath: "#/properties/proof/required",
            params: { missingProperty: "method" },
            message: "should have required property 'method'"
          }
        ]);
      }
    });
    it("should be invalid if proof type is not TOKEN_REGISTRY or DOCUMENT_STORE", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
      document.proof.method = "Something";
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".proof.method",
            schemaPath: "#/properties/proof/properties/method/enum",
            params: { allowedValues: ["TOKEN_REGISTRY", "DOCUMENT_STORE"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if proof value is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, proof: { ...sampleDoc.proof } };
      delete document.proof.value;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".proof",
            schemaPath: "#/properties/proof/required",
            params: { missingProperty: "value" },
            message: "should have required property 'value'"
          }
        ]);
      }
    });
  });

  describe("attachments", () => {
    it("should be valid when mimeType is application/pdf", () => {
      const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0], mimeType: "application/pdf" }] };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be valid when mimeType is image/png", () => {
      const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0], mimeType: "image/png" }] };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });
    it("should be valid when mimeType is image/jpeg", () => {
      const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0], mimeType: "image/jpeg" }] };
      const issuedDocument = issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      expect(issuedDocument.version).toStrictEqual("open-attestation/3.0");
    });

    it("should be invalid when adding additional data", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0], key: "any" }] };
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if filename is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
      delete document.attachments[0].filename;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".attachments[0]",
            schemaPath: "#/properties/attachments/items/required",
            params: { missingProperty: "filename" },
            message: "should have required property 'filename'"
          }
        ]);
      }
    });
    it("should be invalid if mimeType is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
      delete document.attachments[0].mimeType;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if mimeType is not one of the specified enum value", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
      document.attachments[0].mimeType = "Something";
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "enum",
            dataPath: ".attachments[0].mimeType",
            schemaPath: "#/properties/attachments/items/properties/mimeType/enum",
            params: { allowedValues: ["application/pdf", "image/png", "image/jpeg"] },
            message: "should be equal to one of the allowed values"
          }
        ]);
      }
    });
    it("should be invalid if data is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
      delete document.attachments[0].data;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
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
    it("should be invalid if type is missing", () => {
      expect.assertions(2);
      const document = { ...sampleDoc, attachments: [{ ...sampleDoc.attachments[0] }] };
      delete document.attachments[0].type;
      try {
        issueDocument(document, { externalSchemaId: $id, version: "open-attestation/3.0" });
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            keyword: "required",
            dataPath: ".attachments[0]",
            schemaPath: "#/properties/attachments/items/required",
            params: { missingProperty: "type" },
            message: "should have required property 'type'"
          }
        ]);
      }
    });
  });
});
