import {
  obfuscate,
  OpenAttestationCredentialWithInnerIssuer,
  OpenAttestationVerifiableCredential,
  validateSchema,
  verifySignature,
  wrapDocument,
  wrapDocuments
} from "../src";
import { IdentityProofType, Method, OaProofType, TemplateType } from "../src/__generated__/schemaV3";
import { SchemaId } from "../src/shared/@types/document";
import { cloneDeep, omit } from "lodash";

// TODO sth might be wrong with the verify signature => if I add data, it will still be valid

const openAttestationData: OpenAttestationCredentialWithInnerIssuer = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld",
    "https://nebulis.github.io/tmp-jsonld/CustomContext.jsonld"
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
    name: "DEMO STORE",
    identityProof: {
      type: IdentityProofType.DNSTxt,
      location: "tradetrust.io"
    }
  },
  oaProof: {
    type: OaProofType.OpenAttestationProofMethod,
    value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
    method: Method.TokenRegistry
  }
};

const openAttestationDataWithW3CDID: OpenAttestationCredentialWithInnerIssuer = {
  ...openAttestationData,
  issuer: {
    ...openAttestationData.issuer,
    identityProof: {
      type: IdentityProofType.W3CDid,
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
      expect(wrappedDocument.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
      expect(wrappedDocument.proof.targetHash).toBeDefined();
      expect(wrappedDocument.proof.merkleRoot).toBeDefined();
      expect(wrappedDocument.proof.proofs).toEqual([]);
      expect(wrappedDocument.proof.merkleRoot).toBe(wrappedDocument.proof.targetHash);
    });
    test("creates a wrapped document with W3C-DID IdentityProof", async () => {
      const wrappedDocumentWithW3CDID = await wrapDocument(openAttestationDataWithW3CDID, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      expect(wrappedDocumentWithW3CDID.schema).toBe("http://example.com/schema.json");
      expect(wrappedDocumentWithW3CDID.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
      expect(wrappedDocumentWithW3CDID.proof.targetHash).toBeDefined();
      expect(wrappedDocumentWithW3CDID.proof.merkleRoot).toBeDefined();
      expect(wrappedDocumentWithW3CDID.proof.proofs).toEqual([]);
      expect(wrappedDocumentWithW3CDID.proof.merkleRoot).toBe(wrappedDocumentWithW3CDID.proof.targetHash);
      expect(wrappedDocumentWithW3CDID.issuer.identityProof.type).toContain(IdentityProofType.W3CDid);
      expect(wrappedDocumentWithW3CDID.issuer.identityProof.location).toContain(
        openAttestationDataWithW3CDID.issuer.identityProof.location
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
      expect(wrappedDocument.proof.merkleRoot).not.toBe(newDocument.proof.merkleRoot);
    }, 14000);
    test("obfuscate data correctly", async () => {
      const newDocument = await wrapDocument(datum[2], { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscate(newDocument, ["key2"]);
      expect(verifySignature(obfuscatedDocument)).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
    });
    test("obfuscate data transistively", async () => {
      const newDocument = await wrapDocument(datum[2], { version: SchemaId.v3 });
      const intermediateDocument = obfuscate(newDocument, ["key2"]);
      const obfuscatedDocument = obfuscate(intermediateDocument, ["key3"]);
      const comparison = obfuscate(newDocument, ["key2", "key3"]);
      expect(comparison).toEqual(obfuscatedDocument);
    });
  });

  describe("Issuing a batch of documents", () => {
    test("fails if there is a malformed document", () => {
      const malformedDatum = [
        ...datum,
        // @ts-expect-error
        {
          laurent: "task force, assemble!!"
        } as OpenAttestationVerifiableCredential
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
        expect(doc.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
        expect(doc.key1).toEqual(expect.stringContaining(datum[i].key1));
        expect(doc.proof.targetHash).toBeDefined();
        expect(doc.proof.merkleRoot).toBeDefined();
        expect(doc.proof.proofs.length).toEqual(2);
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
      expect(signedDocuments[0].proof.merkleRoot).not.toBe(newSignedDocuments[0].proof.merkleRoot);
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
            proofs: [],
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
            proofs: [],
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
            "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld",
            "https://nebulis.github.io/tmp-jsonld/CustomContext.jsonld",
            "https://nebulis.github.io/tmp-jsonld/DrivingLicenceCredential.jsonld"
          ],
          reference: "SERIAL_NUMBER_123",
          name: "Republic of Singapore Driving Licence",
          issuanceDate: "2010-01-01T19:23:24Z",
          validFrom: "2010-01-01T19:23:24Z",
          issuer: {
            id: "https://example.com",
            name: "DEMO STORE",
            identityProof: {
              type: "DNS-TXT",
              location: "tradetrust.io"
            }
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
          oaProof: {
            type: "OpenAttestationProofMethod",
            method: "DOCUMENT_STORE",
            value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
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
            "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld"
          ],
          reference: "reference",
          name: "name",
          issuanceDate: "2010-01-01T19:23:24Z",
          validFrom: "2010-01-01T19:23:24Z",
          type: ["VerifiableCredential", "UniversityDegreeCredential"],
          issuer: {
            id: "https://example.com",
            name: "issuer.name",
            identityProof: {
              type: IdentityProofType.W3CDid,
              location: openAttestationDataWithW3CDID.issuer.identityProof.location
            }
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
          oaProof: {
            type: OaProofType.OpenAttestationProofMethod,
            method: "TOKEN_REGISTRY",
            value: "proof.value"
          },
          proof: {
            type: "OpenAttestationMerkleProofSignature2018",
            merkleRoot: "0xabc",
            proofs: [],
            targetHash: "0xabc"
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
                type: IdentityProofType.W3CDid
              }
            },
            template: {
              name: "template.name",
              type: "EMBEDDED_RENDERER",
              url: "https://example.com"
            },
            proof: {
              type: OaProofType.OpenAttestationProofMethod,
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
