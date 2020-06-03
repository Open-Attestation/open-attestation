// disable to check error properties, tried with objectContaining but didnt work
/* eslint-disable jest/no-try-expect */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { cloneDeep, merge, omit } from "lodash";
import sampleToken from "./sample-token.json";
import sampleDocument from "./sample-document.json";
import { wrapDocument } from "../../index";
import { SchemaId } from "../../shared/@types/document";
import { IdentityProofType, OpenAttestationDocument } from "../../__generated__/schemaV2";

const openAttestationDocument = sampleDocument as OpenAttestationDocument;
const openAttestationToken = sampleToken as OpenAttestationDocument;

describe("schema/v2.0", () => {
  it("should be valid with sample document", async () => {
    const wrappedDocument = await wrapDocument(openAttestationDocument);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });

  it("should be invalid if identity type is other than DNS-TXT", async () => {
    expect.assertions(2);
    const document = merge(openAttestationDocument, {
      issuers: [
        {
          ...openAttestationDocument.issuers[0],
          identityProof: {
            type: "ABC",
            location: "abc.com"
          }
        }
      ]
    });

    try {
      await wrapDocument(document);
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
  it("should be valid if identity type is DNS-TXT", async () => {
    const document = merge(openAttestationDocument, {
      issuers: [
        {
          ...openAttestationDocument.issuers[0],
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com"
          }
        }
      ]
    });
    const wrappedDocument = await wrapDocument(document);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
  it("should be valid when issuer has extra properties", async () => {
    const document = merge(openAttestationDocument, {
      issuers: [
        {
          ...openAttestationDocument.issuers[0],
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com"
          },
          url: "https://example.com"
        }
      ]
    });
    const wrappedDocument = await wrapDocument(document);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
  it("should be valid with sample token", async () => {
    const wrappedDocument = await wrapDocument(openAttestationToken);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });

  describe("issuers", () => {
    it("should not be valid without identityProof", async () => {
      expect.assertions(2);

      const document = cloneDeep(openAttestationDocument);
      delete document.issuers[0].identityProof;
      try {
        await wrapDocument(document);
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
    it("should not be valid with document with both documentStore and tokenRegistry", async () => {
      expect.assertions(2);

      const document = {
        ...openAttestationToken,
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
        await wrapDocument(document);
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
    it("should not be valid with document with both certificateStore and tokenRegistry", async () => {
      expect.assertions(2);

      const document = {
        ...openAttestationToken,
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
        await wrapDocument(document);
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
    it("should not be valid with document with both documentStore and certificateStore", async () => {
      expect.assertions(2);

      const document = {
        ...openAttestationToken,
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
        await wrapDocument(document);
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
    it("should not be valid with invalid documentStore address", async () => {
      expect.assertions(2);

      const document = {
        ...openAttestationDocument,
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
        await wrapDocument(document);
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
    it("should not be valid when issuers is not defined", async () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "issuers");
      try {
        // @ts-expect-error
        await wrapDocument(document);
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
    it("should not be valid when issuers is an empty array", async () => {
      expect.assertions(2);

      const document = { ...openAttestationDocument, issuers: [] };
      try {
        await wrapDocument(document);
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
    it("should be valid when issuer has no documentStore, certificateStore and tokenRegistry", async () => {
      const wrappedDocument = await wrapDocument({
        ...openAttestationDocument,
        issuers: [
          {
            name: "ABC",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: "abc.com"
            }
          }
        ]
      });
      expect(wrappedDocument.version).toBe(SchemaId.v2);
    });
  });
  describe("template", () => {
    it("should be valid without $template (will use default view)", async () => {
      const wrappedDocument = await wrapDocument(omit(cloneDeep(openAttestationDocument), "$template"));
      expect(wrappedDocument.version).toBe(SchemaId.v2);
    });
    it("should not be valid if $template does not have name", async () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "$template.name");
      try {
        await wrapDocument(document);
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
    it("should not be valid if $template does not have type", async () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "$template.type");
      try {
        await wrapDocument(document);
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
    it("should not be valid with invalid template type", async () => {
      expect.assertions(2);

      const document = {
        ...openAttestationDocument,
        $template: {
          name: "CUSTOM_TEMPLATE",
          type: "INVALID_RENDERER"
        }
      };

      try {
        // @ts-expect-error
        await wrapDocument(document);
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
    it("should be valid without attachments", async () => {
      const wrappedDocument = await wrapDocument(omit(cloneDeep(openAttestationDocument), "attachments"));
      expect(wrappedDocument.version).toBe(SchemaId.v2);
    });
    it("should not be valid with invalid file type", async () => {
      expect.assertions(2);

      const document = {
        ...openAttestationDocument,
        attachments: [
          {
            filename: "sample.aac",
            type: "audio/aac",
            data: "BASE64_ENCODED_FILE"
          }
        ]
      };
      try {
        // @ts-expect-error
        await wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            dataPath: ".attachments[0].type",
            keyword: "enum",
            message: "should be equal to one of the allowed values",
            params: {
              allowedValues: ["application/pdf", "image/png", "image/jpeg"]
            },
            schemaPath: "#/properties/attachments/items/properties/type/enum"
          }
        ]);
      }
    });
    it("should not be valid without attachments filename", async () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "attachments[0].filename");
      try {
        await wrapDocument(document);
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
    it("should not be valid without attachments data", async () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "attachments[0].data");
      try {
        await wrapDocument(document);
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
    it("should not be valid without attachments type", async () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "attachments[0].type");
      try {
        await wrapDocument(document);
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
  it("should be valid with additonal key:value", async () => {
    const wrappedDocument = await wrapDocument({ ...openAttestationDocument, foo: "bar" });
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
});
