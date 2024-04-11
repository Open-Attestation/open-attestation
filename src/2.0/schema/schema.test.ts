// disable to check error properties, tried with objectContaining but didnt work
/* eslint-disable jest/no-conditional-expect */
import { cloneDeep, merge, omit } from "lodash";
import sampleTokenJson from "./sample-token.json";
import sampleDocumentJson from "./sample-document.json";
import sampleDnsDidDocJson from "./sample-dns-did-document.json";
import sampleDidDocJson from "./sample-did-document.json";
import { wrapDocument } from "../../index";
import { SchemaId } from "../../shared/@types/document";
import { IdentityProofType, OpenAttestationDocument } from "../../__generated__/schema.2.0";

const openAttestationDocument = sampleDocumentJson as OpenAttestationDocument;
const openAttestationToken = sampleTokenJson as OpenAttestationDocument;
const sampleDnsDidDoc = sampleDnsDidDocJson as OpenAttestationDocument;
const sampleDidDoc = sampleDidDocJson as OpenAttestationDocument;

describe("schema/2.0", () => {
  it("should be valid with sample document", () => {
    const wrappedDocument = wrapDocument(openAttestationDocument);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });

  it("should be invalid if identity type is other than DNS-TXT, DNS-DID or DID", () => {
    expect.assertions(2);
    const document = merge(openAttestationDocument, {
      issuers: [
        {
          ...openAttestationDocument.issuers[0],
          identityProof: {
            type: "ABC",
            location: "abc.com",
          },
        },
      ],
    });

    try {
      wrapDocument(document);
    } catch (e) {
      expect(e).toHaveProperty("message", "Invalid document");
      expect(e).toHaveProperty(
        "validationErrors",
        expect.arrayContaining([
          {
            instancePath: "/issuers/0/identityProof/type",
            keyword: "enum",
            message: "must be equal to one of the allowed values",
            params: { allowedValues: ["DNS-TXT"] },
            schemaPath: "#/definitions/identityProofDns/properties/type/enum",
          },
          {
            instancePath: "/issuers/0/identityProof/type",
            keyword: "enum",
            message: "must be equal to one of the allowed values",
            params: { allowedValues: ["DNS-DID"] },
            schemaPath: "#/definitions/identityProofDnsDid/properties/type/enum",
          },
          {
            instancePath: "/issuers/0/identityProof/type",
            keyword: "enum",
            message: "must be equal to one of the allowed values",
            params: { allowedValues: ["DID"] },
            schemaPath: "#/definitions/identityProofDid/properties/type/enum",
          },
        ]),
      );
    }
  });
  it("should be valid if identity type is DNS-TXT", () => {
    const document = merge(openAttestationDocument, {
      issuers: [
        {
          ...openAttestationDocument.issuers[0],
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com",
          },
        },
      ],
    });
    const wrappedDocument = wrapDocument(document);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
  it("should be valid when issuer has extra properties", () => {
    const document = merge(openAttestationDocument, {
      issuers: [
        {
          ...openAttestationDocument.issuers[0],
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com",
          },
          url: "https://example.com",
        },
      ],
    });
    const wrappedDocument = wrapDocument(document);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
  it("should be valid with sample token", () => {
    const wrappedDocument = wrapDocument(openAttestationToken);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
  it("should be valid with document issued using did signing", () => {
    const wrappedDocument = wrapDocument(sampleDidDoc);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
  it("should be valid with document issued using dns-did signing", () => {
    const wrappedDocument = wrapDocument(sampleDnsDidDoc);
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });

  describe("issuers", () => {
    it("should not be valid without identityProof", () => {
      expect.assertions(2);

      const document = cloneDeep(openAttestationDocument);
      delete document.issuers[0].identityProof;
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              instancePath: "/issuers/0",
              keyword: "required",
              message: "must have required property 'identityProof'",
              params: {
                missingProperty: "identityProof",
              },
              schemaPath: "#/required",
            },
          ]),
        );
      }
    });
    it("should not be valid with document with both documentStore and tokenRegistry", () => {
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
              location: "abc.com",
            },
          },
        ],
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              instancePath: "/issuers/0",
              keyword: "oneOf",
              message: "must match exactly one schema in oneOf",
              params: { passingSchemas: [0, 1] },
              schemaPath: "#/properties/issuers/items/oneOf",
            },
          ]),
        );
      }
    });
    it("should not be valid with document with both certificateStore and tokenRegistry", () => {
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
              location: "abc.com",
            },
          },
        ],
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              instancePath: "/issuers/0",
              keyword: "oneOf",
              message: "must match exactly one schema in oneOf",
              params: { passingSchemas: [0, 2] },
              schemaPath: "#/properties/issuers/items/oneOf",
            },
          ]),
        );
      }
    });
    it("should not be valid with document with both documentStore and certificateStore", () => {
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
              location: "abc.com",
            },
          },
        ],
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              instancePath: "/issuers/0",
              keyword: "oneOf",
              message: "must match exactly one schema in oneOf",
              params: { passingSchemas: [1, 2] },
              schemaPath: "#/properties/issuers/items/oneOf",
            },
          ]),
        );
      }
    });
    it("should not be valid with invalid documentStore address", () => {
      expect.assertions(2);

      const document = {
        ...openAttestationDocument,
        issuers: [
          {
            name: "DEMO STORE",
            documentStore: "Invalid Address",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: "abc.com",
            },
          },
        ],
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              instancePath: "/issuers/0/documentStore",
              keyword: "pattern",
              message: 'must match pattern "^0x[a-fA-F0-9]{40}$"',
              params: { pattern: "^0x[a-fA-F0-9]{40}$" },
              schemaPath: "#/allOf/1/properties/documentStore/pattern",
            },
          ]),
        );
      }
    });
    it("should not be valid when issuers is not defined", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "issuers");
      try {
        // @ts-expect-error issuers property is missing
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            instancePath: "",
            keyword: "required",
            message: "must have required property 'issuers'",
            params: {
              missingProperty: "issuers",
            },
            schemaPath: "#/required",
          },
        ]);
      }
    });
    it("should not be valid when issuers is an empty array", () => {
      expect.assertions(2);

      const document = { ...openAttestationDocument, issuers: [] };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            instancePath: "/issuers",
            keyword: "minItems",
            message: "must NOT have fewer than 1 items",
            params: {
              limit: 1,
            },
            schemaPath: "#/properties/issuers/minItems",
          },
        ]);
      }
    });
    it("should be valid when issuer has no documentStore, certificateStore and tokenRegistry", () => {
      const wrappedDocument = wrapDocument({
        ...openAttestationDocument,
        issuers: [
          {
            name: "ABC",
            identityProof: {
              type: IdentityProofType.DNSTxt,
              location: "abc.com",
            },
          },
        ],
      });
      expect(wrappedDocument.version).toBe(SchemaId.v2);
    });
    it("should be invalid with dns-did signing without location", () => {
      expect.assertions(2);
      const document: any = {
        ...sampleDnsDidDoc,
        issuers: [
          {
            id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            name: "DEMO STORE",
            revocation: { type: "NONE" },
            identityProof: {
              type: "DNS-DID",
              key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
            },
          },
        ],
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "required",
              instancePath: "/issuers/0/identityProof",
              schemaPath: "#/definitions/identityProofDnsDid/required",
              params: {
                missingProperty: "location",
              },
              message: "must have required property 'location'",
            },
          ]),
        );
      }
    });
    it("should be invalid with dns-did signing without key", () => {
      const document: any = {
        ...sampleDnsDidDoc,
        issuers: [
          {
            id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            name: "DEMO STORE",
            revocation: { type: "NONE" },
            identityProof: {
              type: "DNS-DID",
              location: "example.tradetrust.io",
            },
          },
        ],
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "required",
              instancePath: "/issuers/0/identityProof",
              schemaPath: "#/definitions/identityProofDnsDid/required",
              params: {
                missingProperty: "key",
              },
              message: "must have required property 'key'",
            },
          ]),
        );
      }
    });
    it("should be invalid with did signing without key", () => {
      const document: any = {
        ...sampleDidDoc,
        issuers: [
          {
            id: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
            name: "DEMO STORE",
            revocation: { type: "NONE" },
            identityProof: {
              type: "DID",
            },
          },
        ],
      };
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              keyword: "required",
              instancePath: "/issuers/0/identityProof",
              schemaPath: "#/definitions/identityProofDnsDid/required",
              params: {
                missingProperty: "key",
              },
              message: "must have required property 'key'",
            },
          ]),
        );
      }
    });
  });
  describe("template", () => {
    it("should be valid without $template (will use default view)", () => {
      const documentWithoutTemplate = omit(cloneDeep(openAttestationDocument), "$template") as OpenAttestationDocument;
      const wrappedDocument = wrapDocument(documentWithoutTemplate);
      expect(wrappedDocument.version).toBe(SchemaId.v2);
    });
    it("should not be valid if $template does not have name", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "$template.name") as OpenAttestationDocument;
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              instancePath: "/$template",
              keyword: "required",
              message: "must have required property 'name'",
              params: {
                missingProperty: "name",
              },
              schemaPath: "#/properties/%24template/oneOf/1/required",
            },
          ]),
        );
      }
    });
    it("should not be valid if $template does not have type", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "$template.type") as OpenAttestationDocument;
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty(
          "validationErrors",
          expect.arrayContaining([
            {
              instancePath: "/$template",
              keyword: "required",
              message: "must have required property 'type'",
              params: {
                missingProperty: "type",
              },
              schemaPath: "#/properties/%24template/oneOf/1/required",
            },
          ]),
        );
      }
    });
    it("should not be valid with invalid template type", () => {
      expect.assertions(2);

      const document = {
        ...openAttestationDocument,
        $template: {
          name: "CUSTOM_TEMPLATE",
          type: "INVALID_RENDERER",
        },
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
              instancePath: "/$template/type",
              keyword: "enum",
              message: "must be equal to one of the allowed values",
              params: {
                allowedValues: ["EMBEDDED_RENDERER"],
              },
              schemaPath: "#/properties/%24template/oneOf/1/properties/type/enum",
            },
          ]),
        );
      }
    });
  });
  describe("attachments", () => {
    it("should be valid without attachments", () => {
      const document = omit(cloneDeep(openAttestationDocument), "attachments") as OpenAttestationDocument;
      const wrappedDocument = wrapDocument(document);
      expect(wrappedDocument.version).toBe(SchemaId.v2);
    });
    it("should not be valid without attachments filename", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "attachments[0].filename") as OpenAttestationDocument;
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            instancePath: "/attachments/0",
            keyword: "required",
            message: "must have required property 'filename'",
            params: {
              missingProperty: "filename",
            },
            schemaPath: "#/properties/attachments/items/required",
          },
        ]);
      }
    });
    it("should not be valid without attachments data", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "attachments[0].data") as OpenAttestationDocument;
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            instancePath: "/attachments/0",
            keyword: "required",
            message: "must have required property 'data'",
            params: {
              missingProperty: "data",
            },
            schemaPath: "#/properties/attachments/items/required",
          },
        ]);
      }
    });
    it("should not be valid without attachments type", () => {
      expect.assertions(2);

      const document = omit(cloneDeep(openAttestationDocument), "attachments[0].type") as OpenAttestationDocument;
      try {
        wrapDocument(document);
      } catch (e) {
        expect(e).toHaveProperty("message", "Invalid document");
        expect(e).toHaveProperty("validationErrors", [
          {
            instancePath: "/attachments/0",
            keyword: "required",
            message: "must have required property 'type'",
            params: {
              missingProperty: "type",
            },
            schemaPath: "#/properties/attachments/items/required",
          },
        ]);
      }
    });
  });
  it("should be valid with additonal key:value", () => {
    const wrappedDocument = wrapDocument({ ...openAttestationDocument, foo: "bar" });
    expect(wrappedDocument.version).toBe(SchemaId.v2);
  });
});
