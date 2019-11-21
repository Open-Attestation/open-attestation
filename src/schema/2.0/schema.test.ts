/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { cloneDeep, merge, omit } from "lodash";
import sampleToken from "./sample-token.json";
import sampleDoc from "./sample-document.json";
import { digestDocument, wrap, validateSchema } from "../../index";
import { setData } from "../../privacy";
import { saltData } from "../../privacy/salt";

const createDocument = (data: any) => {
  // @ts-ignore
  const document = setData({ version: "open-attestation/2.0", data: null }, saltData(data));
  return wrap(document, [digestDocument(document)]);
};

describe("schema/v2.0", () => {
  it("should be valid with sample document", () => {
    const issuedDocument = createDocument(sampleDoc);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be invalid if identity type is other than DNS-TXT", () => {
    const document = merge(sampleDoc, {
      issuers: [
        {
          identityProof: {
            type: "ABC",
            location: "abc.com"
          }
        }
      ]
    });
    expect(validateSchema(createDocument(document))).toStrictEqual(false);
  });

  it("should be valid if identity type is DNS-TXT", () => {
    const document = merge(sampleDoc, {
      issuers: [
        {
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com"
          }
        }
      ]
    });
    const issuedDocument = createDocument(document);
    expect(validateSchema(issuedDocument)).toBe(true);
  });

  it("should not be valid without identityProof", () => {
    const document = cloneDeep(sampleDoc);
    delete document.issuers[0].identityProof;
    expect(validateSchema(createDocument(document))).toStrictEqual(false);
  });

  it("should be valid with sample token", () => {
    const issuedToken = createDocument(sampleToken);
    const valid = validateSchema(issuedToken);

    expect(valid).toBe(true);
  });

  it("should not be valid with document with both documentStore and tokenRegistry", () => {
    expect(
      validateSchema(
        createDocument({
          ...sampleToken,
          issuers: [
            {
              name: "DEMO STORE",
              documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
              tokenRegistry: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
              identityProof: {
                type: "DNS-TXT",
                location: "abc.com"
              }
            }
          ]
        })
      )
    ).toStrictEqual(false);
  });

  it("should not be valid with document with both certificateStore and tokenRegistry", () => {
    expect(
      validateSchema(
        createDocument({
          ...sampleToken,
          issuers: [
            {
              name: "DEMO STORE",
              certificateStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
              tokenRegistry: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
            }
          ],
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com"
          }
        })
      )
    ).toStrictEqual(false);
  });

  it("should not be valid with document with both documentStore and certificateStore", () => {
    expect(
      validateSchema(
        createDocument({
          ...sampleToken,
          issuers: [
            {
              name: "DEMO STORE",
              documentStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
              certificateStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
            }
          ],
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com"
          }
        })
      )
    ).toStrictEqual(false);
  });

  it("should be valid with additonal key:value", () => {
    const issuedDocument = createDocument({ ...sampleDoc, foo: "bar" });
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be valid without $template (will use default view)", () => {
    const document = omit(sampleDoc, "$template");
    const issuedDocument = createDocument(document);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be valid without attachments", () => {
    const document = omit(sampleDoc, "attachments");
    const issuedDocument = createDocument(document);
    const valid = validateSchema(issuedDocument);

    expect(valid).toBe(true);
  });

  it("should be invalid if $template does not have name or type", () => {
    const documentWithoutName = omit(sampleDoc, "$template.name");
    expect(validateSchema(createDocument(documentWithoutName))).toStrictEqual(false);

    const documentWithoutType = omit(sampleDoc, "$template.type");
    expect(validateSchema(createDocument(documentWithoutType))).toStrictEqual(false);
  });

  it("should be invalid with invalid template type", () => {
    const document = {
      ...sampleDoc,
      $template: {
        name: "CUSTOM_TEMPLATE",
        type: "INVALID_RENDERER"
      }
    };
    expect(validateSchema(createDocument(document))).toStrictEqual(false);
  });

  it("should be invalid with invalid file type", () => {
    const document = {
      ...sampleDoc,
      attachments: [
        {
          filename: "sample.aac",
          type: "audio/aac",
          data: "BASE64_ENCODED_FILE"
        }
      ]
    };
    expect(validateSchema(createDocument(document))).toStrictEqual(false);
  });

  it("should be invalid with invalid documentStore address", () => {
    const document = {
      ...sampleDoc,
      issuers: [
        {
          name: "DEMO STORE",
          documentStore: "Invalid Address",
          identityProof: {
            type: "DNS-TXT",
            location: "abc.com"
          }
        }
      ]
    };
    expect(validateSchema(createDocument(document))).toStrictEqual(false);
  });

  it("should be invalid without issuer", () => {
    const documentWithoutKey = omit(sampleDoc, "issuers");
    expect(validateSchema(createDocument(documentWithoutKey))).toStrictEqual(false);

    const documentWithZeroIssuer = { ...sampleDoc, issuers: [] };
    expect(validateSchema(createDocument(documentWithZeroIssuer))).toStrictEqual(false);
  });

  it("should be invalid without documentStore in issuer", () => {
    const document = omit(sampleDoc, "issuers[0].documentStore");
    expect(validateSchema(createDocument(document))).toStrictEqual(false);
  });

  it("should be invalid without attachments filename, type or data", () => {
    const documentWithoutName = omit(sampleDoc, "attachments[0].filename");
    expect(validateSchema(createDocument(documentWithoutName))).toStrictEqual(false);

    const documentWithoutData = omit(sampleDoc, "attachments[0].data");
    expect(validateSchema(createDocument(documentWithoutData))).toStrictEqual(false);

    const documentWithoutType = omit(sampleDoc, "attachments[0].type");
    expect(validateSchema(createDocument(documentWithoutType))).toStrictEqual(false);
  });
});
