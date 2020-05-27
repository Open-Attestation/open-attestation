import { obfuscate, validateSchema, verifySignature, wrapDocument, wrapDocuments } from "../src";
import { IdentityType, Method, OpenAttestationDocument, ProofType, TemplateType } from "../src/__generated__/schemaV3";
import { SchemaId } from "../src/shared/@types/document";
import { cloneDeep, omit } from "lodash";

// TODO sth might be wrong with the verify signature => if I add data, it will still be valid

const openAttestationData: OpenAttestationDocument = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://gist.githubusercontent.com/gjj/4eb6b5324d9774ebba2e5d6229e8a44d/raw/06ab473392545fc1f6bb03a5cc9c9f4fa8b4d0a0/OpenAttestation.v3.jsonld",
    "https://gist.githubusercontent.com/gjj/1225b659da194b56dc48c0ac1c9b3043/raw/5cdf20c40aa0c0bbe02d111f973772e012b702b1/CustomContext.jsonld"
  ],
  reference: "document identifier",
  validFrom: "2010-01-01T19:23:24Z",
  issuanceDate: "2010-01-01T19:23:24Z",
  name: "document owner name",
  type: ["VerifiableCredential", "UniversityDegreeCredential"],
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
    degree: {
      type: "BachelorDegree",
      name: "Bachelor of Science in Mechanical Engineering"
    }
  },
  template: {
    name: "any",
    type: TemplateType.EmbeddedRenderer,
    url: "http://some.example.com"
  },
  issuer: {
    id: "http://some.example.com",
    name: "DEMO STORE"
  },
  proof: {
    type: ProofType.OpenAttestationSignature2018,
    value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
    method: Method.TokenRegistry,
    identity: {
      type: IdentityType.DNSTxt,
      location: "tradetrust.io"
    }
  }
};

const openAttestationDataWithW3CDID: OpenAttestationDocument = {
  ...openAttestationData,
  proof: {
    ...openAttestationData.proof,
    identity: {
      ...openAttestationData.proof.identity,
      type: IdentityType.W3CDid,
      location: "did:ethr:0x0xE6Fe788d8ca214A080b0f6aC7F48480b2AEfa9a6"
    }
  }
};

const datum = [
  {
    key1: "test",
    ...openAttestationData
  },
  {
    key1: "hello",
    key2: "item2",
    ...openAttestationData
  },
  {
    key1: "item1",
    key2: "true",
    key3: "3.14159",
    // key3: 3.14159, // TODO FIX ME
    // key4: false, // TODO FIX ME
    ...openAttestationData
  },
  {
    key1: "item2",
    ...openAttestationData
  }
];

describe("v3 E2E Test Scenarios", () => {
  describe("Issuing a single document", () => {
    const document = datum[0];

    test("fails for missing data", async () => {
      const missingData = {
        ...omit(cloneDeep(document), "issuer")
      };
      await expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        wrapDocument(missingData, {
          externalSchemaId: "http://example.com/schema.json",
          version: SchemaId.v3
        })
      ).rejects.toThrow("Invalid document");
    });
    test("creates a wrapped document", async () => {
      const wrappedDocument = await wrapDocument(
        {
          ...openAttestationData,
          key1: "test"
        },
        {
          externalSchemaId: "http://example.com/schema.json",
          version: SchemaId.v3
        }
      );
      expect(wrappedDocument.schema).toBe("http://example.com/schema.json");
      // TODO: To fix later
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(wrappedDocument.key1).toEqual(expect.stringContaining("test"));
      expect(wrappedDocument.proof.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocument.proof.signature.targetHash).toBeDefined();
      expect(wrappedDocument.proof.signature.merkleRoot).toBeDefined();
      expect(wrappedDocument.proof.signature.proof).toEqual([]);
      expect(wrappedDocument.proof.signature.merkleRoot).toBe(wrappedDocument.proof.signature.targetHash);
    });
    test("creates a wrapped document with W3C-DID IdentityProof", async () => {
      const wrappedDocumentWithW3CDID = await wrapDocument(openAttestationDataWithW3CDID, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      expect(wrappedDocumentWithW3CDID.schema).toBe("http://example.com/schema.json");
      expect(wrappedDocumentWithW3CDID.proof.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocumentWithW3CDID.proof.signature.targetHash).toBeDefined();
      expect(wrappedDocumentWithW3CDID.proof.signature.merkleRoot).toBeDefined();
      expect(wrappedDocumentWithW3CDID.proof.signature.proof).toEqual([]);
      expect(wrappedDocumentWithW3CDID.proof.signature.merkleRoot).toBe(
        wrappedDocumentWithW3CDID.proof.signature.targetHash
      );
      expect(wrappedDocumentWithW3CDID.proof.identity.type).toContain(IdentityType.W3CDid);
      expect(wrappedDocumentWithW3CDID.proof.identity.location).toContain(
        openAttestationDataWithW3CDID.proof.identity.location
      );
    });
    test("checks that document is wrapped correctly", async () => {
      const wrappedDocument = await wrapDocument(document, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const verified = verifySignature(wrappedDocument);
      expect(verified).toBe(true);
    });
    test("checks that document conforms to the schema", async () => {
      const wrappedDocument = await wrapDocument(document, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      expect(validateSchema(wrappedDocument)).toBe(true);
    });
    test("does not allow for the same merkle root to be generated", async () => {
      // This test takes some time to run, so we set the timeout to 14s
      const wrappedDocument = await wrapDocument(document, { version: SchemaId.v3 });
      const newDocument = await wrapDocument(document, { version: SchemaId.v3 });
      expect(wrappedDocument.proof.signature.merkleRoot).not.toBe(newDocument.proof.signature.merkleRoot);
    }, 14000);
    test("obfuscate data correctly", async () => {
      const newDocument = await wrapDocument(datum[2], { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscate(newDocument, ["key2"]);

      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
    });
    test("obfuscate data transistively", async () => {
      const newDocument = await wrapDocument(datum[2], { version: SchemaId.v3 });
      const intermediateDocument = obfuscate(newDocument, ["key2"]);
      const obfuscatedDocument = obfuscate(intermediateDocument, ["key3"]);

      const comparison = obfuscate(intermediateDocument, ["key2", "key3"]);

      expect(comparison).toEqual(obfuscatedDocument);
    });
  });

  describe("Issuing a batch of documents", () => {
    test("fails if there is a malformed document", () => {
      const malformedDatum = [
        ...datum,
        {
          laurent: "task force, assemble!!"
        }
      ];
      const action = () => wrapDocuments(malformedDatum);
      expect(action).toThrow("Invalid document");
    });
    test("creates a batch of documents if all are in the right format", () => {
      const signedDocuments = wrapDocuments(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      signedDocuments.forEach((doc, i: number) => {
        expect(doc.schema).toBe("http://example.com/schema.json");
        expect(doc.proof.signature.type).toBe("SHA3MerkleProof");
        expect(doc.key1).toEqual(expect.stringContaining(datum[i].key1));
        expect(doc.proof.signature.targetHash).toBeDefined();
        expect(doc.proof.signature.merkleRoot).toBeDefined();
        expect(doc.proof.signature.proof.length).toEqual(2);
      });
    });
    test("checks that documents are wrapped correctly", () => {
      const signedDocuments = wrapDocuments(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const verified = signedDocuments.reduce((prev, curr) => verifySignature(curr) && prev, true);
      expect(verified).toBe(true);
    });
    test("checks that documents conforms to the schema", () => {
      const signedDocuments = wrapDocuments(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const validatedSchema = signedDocuments.reduce((prev: boolean, curr: any) => validateSchema(curr) && prev, true);
      expect(validatedSchema).toBe(true);
    });
    test("does not allow for same merkle root to be generated", () => {
      const signedDocuments = wrapDocuments(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const newSignedDocuments = wrapDocuments(datum, {
        version: SchemaId.v3
      });
      expect(signedDocuments[0].proof.signature.merkleRoot).not.toBe(newSignedDocuments[0].proof.signature.merkleRoot);
    });
  });

  describe("validate", () => {
    test("should throw an error if document id is not a valid open attestation schema version", () => {
      const action = () =>
        validateSchema({
          version: "abababa" as SchemaId,
          schema: "http://example.com/schemaV3.json",
          data: {
            key: 2
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
        });
      expect(action).toThrow("No schema validator provided");
    });
    test("should return false if document is not valid", () => {
      expect(
        validateSchema({
          version: SchemaId.v3,
          schema: "http://example.com/schemaV3.json",
          data: {
            key: 2
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
        })
      ).toStrictEqual(false);
    });
    test("should return true when document is valid and version is 3.0", () => {
      expect(
        validateSchema({
          version: SchemaId.v3,
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://gist.githubusercontent.com/gjj/4eb6b5324d9774ebba2e5d6229e8a44d/raw/06ab473392545fc1f6bb03a5cc9c9f4fa8b4d0a0/OpenAttestation.v3.jsonld",
            "https://gist.githubusercontent.com/gjj/1225b659da194b56dc48c0ac1c9b3043/raw/5cdf20c40aa0c0bbe02d111f973772e012b702b1/CustomContext.jsonld",
            "https://gist.githubusercontent.com/gjj/e667c86cef10b230b64de9a3dcf23a15/raw/1b3dbf7eff1dd50263c18c0dc44df138bc503c14/DrivingLicenceCredential.jsonld"
          ],
          reference: "SERIAL_NUMBER_123",
          name: "Republic of Singapore Driving Licence",
          issuanceDate: "2010-01-01T19:23:24Z",
          validFrom: "2010-01-01T19:23:24Z",
          issuer: {
            id: "https://example.com",
            name: "DEMO STORE"
          },
          type: ["VerifiableCredential", "DrivingLicenceCredential"],
          credentialSubject: {
            id: "did:example:SERIAL_NUMBER_123",
            class: [
              {
                type: "3",
                effectiveDate: "2010-01-01T19:23:24Z"
              },
              {
                type: "3A",
                effectiveDate: "2010-01-01T19:23:24Z"
              }
            ]
          },
          template: {
            name: "CUSTOM_TEMPLATE",
            type: "EMBEDDED_RENDERER",
            url: "https://localhost:3000/renderer"
          },
          proof: {
            type: "OpenAttestationSignature2018",
            method: "DOCUMENT_STORE",
            value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
            identity: {
              type: "DNS-TXT",
              location: "tradetrust.io"
            }
          },
          recipient: {
            name: "Recipient Name"
          },
          evidence: [
            {
              type: "DocumentVerification2018",
              fileName: "sample.pdf",
              mimeType: "application/pdf",
              data: "BASE64_ENCODED_FILE"
            }
          ]
        })
      ).toStrictEqual(true);
    });
    test("should return true when document is valid and version is 3.0 and identityProof is W3C-DID", () => {
      expect(
        validateSchema({
          version: SchemaId.v3,
          schema: "http://example.com/schemaV3.json",
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
            "https://gist.githubusercontent.com/gjj/4eb6b5324d9774ebba2e5d6229e8a44d/raw/06ab473392545fc1f6bb03a5cc9c9f4fa8b4d0a0/OpenAttestation.v3.jsonld"
          ],
          reference: "reference",
          name: "name",
          issuanceDate: "2010-01-01T19:23:24Z",
          validFrom: "2010-01-01T19:23:24Z",
          type: ["VerifiableCredential", "UniversityDegreeCredential"],
          issuer: {
            id: "https://example.com",
            name: "issuer.name"
          },
          credentialSubject: {
            id: "did:example:1234",
            name: "Example Name"
          },
          template: {
            name: "template.name",
            type: "EMBEDDED_RENDERER",
            url: "https://example.com"
          },
          proof: {
            type: "OpenAttestationSignature2018",
            method: "TOKEN_REGISTRY",
            value: "proof.value",
            identity: {
              type: IdentityType.W3CDid,
              location: openAttestationDataWithW3CDID.proof.identity.location
            },
            signature: {
              merkleRoot: "0xabc",
              proof: [],
              targetHash: "0xabc",
              type: "SHA3MerkleProof"
            }
          }
        })
      ).toStrictEqual(true);
    });
    test("should return false when document is invalid due to no W3C-DID location", () => {
      expect(
        validateSchema({
          version: SchemaId.v3,
          schema: "http://example.com/schemaV3.json",
          data: {
            reference: "reference",
            name: "name",
            validFrom: "2010-01-01T19:23:24Z",
            issuer: {
              id: "https://example.com",
              name: "issuer.name",
              identityProof: {
                type: IdentityType.W3CDid
              }
            },
            template: {
              name: "template.name",
              type: "EMBEDDED_RENDERER",
              url: "https://example.com"
            },
            proof: {
              type: "OpenAttestationSignature2018",
              method: "TOKEN_REGISTRY",
              value: "proof.value"
            }
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
        })
      ).toStrictEqual(false);
    });
    test("should default to v2 when document is valid and version is undefined", () => {
      expect(
        validateSchema({
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore run test with version being undefined to only ignore that part
          version: undefined,
          data: {
            issuers: [
              {
                name: "issuer.name",
                certificateStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
              }
            ]
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
        })
      ).toStrictEqual(true);
    });
  });
});
