// disable to check error properties, tried with objectContaining but didnt work
/* eslint-disable jest/no-try-expect */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { cloneDeep, merge, omit } from "lodash";
import sampleTokenJson from "./sample-token.json";
import sampleDocJson from "./sample-document.json";
import { v2, wrapDocument } from "../../index";
import { SchemaId } from "../../@types/document";
import { IdentityProofType } from "../../__generated__/schemaV2";

const sampleDoc = sampleDocJson as v2.OpenAttestationDocument;
const sampleToken = sampleTokenJson as v2.OpenAttestationDocument;

describe("schema/v2.0", () => {
  it("should be valid with sample document", () => {
    const wrappedDocument = wrapDocument(sampleDoc);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });

  it("should be invalid if identity type is other than DNS-TXT", () => {
    expect.assertions(2);
    const document = merge(sampleDoc, {
      issuers: [
        {
          ...sampleDoc.issuers[0],
          identityProof: {
            type: "ABC",
            location: "abc.com"
          }
        }
      ]
    });

    try {
      wrapDocument(document);
    } catch (e) {
      expect(e).toHaveProperty("message", "Invalid document");
      expect(e).toHaveProperty(
        "validationErrors",
        expect.arrayContaining([
          {
            dataPath: ".issuers[0].identityProof.type",
            keyword: "enum",
            message: "should be equal to one of the allowed values",
            params: {
              allowedValues: ["DNS-TXT"]
            },
            schemaPath: "#/definitions/identityProof/properties/type/enum"
          }
        ])
      );
    }
  });
  it("should be valid if identity type is DNS-TXT", () => {
    const document = merge(sampleDoc, {
      issuers: [
        {
          ...sampleDoc.issuers[0],
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com"
          }
        }
      ]
    });
    const wrappedDocument = wrapDocument(document);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
  it("should be valid when issuer has extra properties", () => {
    const document = merge(sampleDoc, {
      issuers: [
        {
          ...sampleDoc.issuers[0],
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com"
          },
          url: "https://example.com"
        }
      ]
    });
    const wrappedDocument = wrapDocument(document);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
  it("should be valid with sample token", () => {
    const wrappedDocument = wrapDocument(sampleToken);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });

  describe("issuers", () => {
    it("should not be valid without identityProof", () => {
      expect.assertions(2);

      const document = cloneDeep(sampleDoc);
      delete document.issuers[0].identityProof;
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".issuers[0]",
              keyword: "required",
              message: "should have required property 'identityProof'",
              params: {
                missingProperty: "identityProof"
              },
              schemaPath: "#/required"
            }
          ])
        );
      }
    });
    it("should not be valid with document with both documentStore and tokenRegistry", () => {
      expect.assertions(2);

      const document = {
        ...sampleToken,
        issuers: [
          {
            name: "DEMO STORE",
            documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
            tokenRegistry: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: "abc.com"
            }
          }
        ]
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".issuers[0]",
              keyword: "oneOf",
              message: "should match exactly one schema in oneOf",
              params: { passingSchemas: [0, 1] },
              schemaPath: "#/properties/issuers/items/oneOf"
            }
          ])
        );
      }
    });
    it("should not be valid with document with both certificateStore and tokenRegistry", () => {
      expect.assertions(2);

      const document = {
        ...sampleToken,
        issuers: [
          {
            name: "DEMO STORE",
            certificateStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
            tokenRegistry: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: "abc.com"
            }
          }
        ]
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".issuers[0]",
              keyword: "oneOf",
              message: "should match exactly one schema in oneOf",
              params: { passingSchemas: [0, 2] },
              schemaPath: "#/properties/issuers/items/oneOf"
            }
          ])
        );
      }
    });
    it("should not be valid with document with both documentStore and certificateStore", () => {
      expect.assertions(2);

      const document = {
        ...sampleToken,
        issuers: [
          {
            name: "DEMO STORE",
            documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
            certificateStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: "abc.com"
            }
          }
        ]
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".issuers[0]",
              keyword: "oneOf",
              message: "should match exactly one schema in oneOf",
              params: { passingSchemas: [1, 2] },
              schemaPath: "#/properties/issuers/items/oneOf"
            }
          ])
        );
      }
    });
    it("should not be valid with invalid documentStore address", () => {
      expect.assertions(2);

      const document = {
        ...sampleDoc,
        issuers: [
          {
            name: "DEMO STORE",
            documentStore: "Invalid Address",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: "abc.com"
            }
          }
        ]
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".issuers[0].documentStore",
              keyword: "pattern",
              message: 'should match pattern "^0x[a-fA-F0-9]{40}$"',
              params: { pattern: "^0x[a-fA-F0-9]{40}$" },
              schemaPath: "#/allOf/1/properties/documentStore/pattern"
            }
          ])
        );
      }
    });
    it("should not be valid when issuers is not defined", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(sampleDoc), "issuers");
      try {
        // @ts-expect-error issuers property is missing
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            dataPath: "",
            keyword: "required",
            message: "should have required property 'issuers'",
            params: {
              missingProperty: "issuers"
            },
            schemaPath: "#/required"
          }
        ]);
      }
    });
    it("should not be valid when issuers is an empty array", () => {
      expect.assertions(2);

      const document = { ...sampleDoc, issuers: [] };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            dataPath: ".issuers",
            keyword: "minItems",
            message: "should NOT have fewer than 1 items",
            params: {
              limit: 1
            },
            schemaPath: "#/properties/issuers/minItems"
          }
        ]);
      }
    });
    it("should be valid when issuer has no documentStore, certificateStore and tokenRegistry", () => {
      expect(
        wrapDocument({
          ...sampleDoc,
          issuers: [
            {
              name: "ABC",
              identityProof: {
                type: IdentityProofType.DNSTxt,
                location: "abc.com"
              }
            }
          ]
        }).version
      ).toBe(SchemaId.v2);
    });
  });
  describe("template", () => {
    it("should be valid without $template (will use default view)", () => {
      const wrappedDocument = wrapDocument(omit(cloneDeep(sampleDoc), "$template"));
      expect(wrappedDocument.version).toBe(SchemaId.v2);
    });
    it("should not be valid if $template does not have name", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(sampleDoc), "$template.name");
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".$template",
              keyword: "required",
              message: "should have required property 'name'",
              params: {
                missingProperty: "name"
              },
              schemaPath: "#/properties/%24template/oneOf/1/required"
            }
          ])
        );
      }
    });
    it("should not be valid if $template does not have type", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(sampleDoc), "$template.type");
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".$template",
              keyword: "required",
              message: "should have required property 'type'",
              params: {
                missingProperty: "type"
              },
              schemaPath: "#/properties/%24template/oneOf/1/required"
            }
          ])
        );
      }
    });
    it("should not be valid with invalid template type", () => {
      expect.assertions(2);

      const document = {
        ...sampleDoc,
        $template: {
          name: "CUSTOM_TEMPLATE",
          type: "INVALID_RENDERER"
        }
      };

      try {
        // @ts-expect-error $template.type is invalid
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              dataPath: ".$template.type",
              keyword: "enum",
              message: "should be equal to one of the allowed values",
              params: {
                allowedValues: ["EMBEDDED_RENDERER"]
              },
              schemaPath: "#/properties/%24template/oneOf/1/properties/type/enum"
            }
          ])
        );
      }
    });
  });
  describe("attachments", () => {
    it("should be valid without attachments", () => {
      const wrappedDocument = wrapDocument(omit(cloneDeep(sampleDoc), "attachments"));
      expect(wrappedDocument.version).toBe(SchemaId.v2);
    });

    it("should not be valid without attachments filename", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(sampleDoc), "attachments[0].filename");
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            dataPath: ".attachments[0]",
            keyword: "required",
            message: "should have required property 'filename'",
            params: {
              missingProperty: "filename"
            },
            schemaPath: "#/properties/attachments/items/required"
          }
        ]);
      }
    });
    it("should not be valid without attachments data", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(sampleDoc), "attachments[0].data");
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            dataPath: ".attachments[0]",
            keyword: "required",
            message: "should have required property 'data'",
            params: {
              missingProperty: "data"
            },
            schemaPath: "#/properties/attachments/items/required"
          }
        ]);
      }
    });
    it("should not be valid without attachments type", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(sampleDoc), "attachments[0].type");
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            dataPath: ".attachments[0]",
            keyword: "required",
            message: "should have required property 'type'",
            params: {
              missingProperty: "type"
            },
            schemaPath: "#/properties/attachments/items/required"
          }
        ]);
      }
    });
  });
  it("should be valid with additonal key:value", () => {
    const wrappedDocument = wrapDocument({ ...sampleDoc, foo: "bar" });
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
});
