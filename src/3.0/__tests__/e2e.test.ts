import {
  __unsafe__use__it__at__your__own__risks__wrapCredential as wrapCredential,
  __unsafe__use__it__at__your__own__risks__wrapCredentials as wrapCredentials,
  obfuscate,
  SchemaId,
  SignatureAlgorithm,
  validateSchema,
  verifySignature
} from "../..";
import { OpenAttestationVerifiableCredential } from "../../3.0/types";
import {
  IdentityProofType,
  Method,
  ProofType,
  TemplateType,
  OpenAttestationDocument
} from "../../__generated__/schema.3.0";
import { cloneDeep, omit } from "lodash";

const openAttestationData: OpenAttestationDocument = {
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
  openAttestationMetadata: {
    template: {
      name: "any",
      type: TemplateType.EmbeddedRenderer,
      url: "http://some.example.com"
    },
    proof: {
      type: ProofType.OpenAttestationProofMethod,
      value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
      method: Method.TokenRegistry
    },
    identityProof: {
      type: IdentityProofType.DNSTxt,
      location: "tradetrust.io"
    }
  },
  issuer: {
    id: "http://some.example.com",
    name: "DEMO STORE"
  }
};

const openAttestationDataWithW3CDID: OpenAttestationDocument = {
  ...openAttestationData,
  openAttestationMetadata: {
    ...openAttestationData.openAttestationMetadata,
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
    key3: 3.14159,
    key4: false,
    ...openAttestationData
  },
  {
    key1: "item2",
    ...openAttestationData
  }
];

describe("3.0 E2E Test Scenarios", () => {
  describe("Issuing a single document", () => {
    const document = datum[0];

    test("fails for missing data", async () => {
      const missingData = {
        ...omit(cloneDeep(document), "issuer")
      };
      await expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        wrapCredential(missingData, {
          externalSchemaId: "http://example.com/schema.json",
          version: SchemaId.v3
        })
      ).rejects.toThrow("Invalid document");
    });
    test("creates a wrapped document", async () => {
      const wrappedDocument = await wrapCredential(
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
      expect(wrappedDocument.key1).toEqual(expect.stringContaining("test"));
      expect(wrappedDocument.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
      expect(wrappedDocument.proof.targetHash).toBeDefined();
      expect(wrappedDocument.proof.merkleRoot).toBeDefined();
      expect(wrappedDocument.proof.proofs).toEqual([]);
      expect(wrappedDocument.proof.merkleRoot).toBe(wrappedDocument.proof.targetHash);
    });
    test("creates a wrapped document with W3C-DID IdentityProof", async () => {
      const wrappedDocumentWithW3CDID = await wrapCredential(openAttestationDataWithW3CDID, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      expect(wrappedDocumentWithW3CDID.schema).toBe("http://example.com/schema.json");
      expect(wrappedDocumentWithW3CDID.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
      expect(wrappedDocumentWithW3CDID.proof.targetHash).toBeDefined();
      expect(wrappedDocumentWithW3CDID.proof.merkleRoot).toBeDefined();
      expect(wrappedDocumentWithW3CDID.proof.proofs).toEqual([]);
      expect(wrappedDocumentWithW3CDID.proof.merkleRoot).toBe(wrappedDocumentWithW3CDID.proof.targetHash);
      expect(wrappedDocumentWithW3CDID.openAttestationMetadata.identityProof?.type).toContain(IdentityProofType.W3CDid);
      expect(wrappedDocumentWithW3CDID.openAttestationMetadata.identityProof?.location).toContain(
        openAttestationDataWithW3CDID.openAttestationMetadata.identityProof?.location
      );
    });
    test("checks that document is wrapped correctly", async () => {
      const wrappedDocument = await wrapCredential(document, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const verified = verifySignature(wrappedDocument);
      expect(verified).toBe(true);
    });
    test("checks that document conforms to the schema", async () => {
      const wrappedDocument = await wrapCredential(document, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      expect(validateSchema(wrappedDocument)).toBe(true);
    });
    test("does not allow for the same merkle root to be generated", async () => {
      // This test takes some time to run, so we set the timeout to 14s
      const wrappedDocument = await wrapCredential(document, { version: SchemaId.v3 });
      const newDocument = await wrapCredential(document, { version: SchemaId.v3 });
      expect(wrappedDocument.proof.merkleRoot).not.toBe(newDocument.proof.merkleRoot);
    }, 14000);
    test("obfuscate data correctly", async () => {
      const newDocument = await wrapCredential(datum[2], { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscate(newDocument, ["key2"]);
      expect(verifySignature(obfuscatedDocument)).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
    });
    test("obfuscate data transistively", async () => {
      const newDocument = await wrapCredential(datum[2], { version: SchemaId.v3 });
      const intermediateDocument = obfuscate(newDocument, ["key2"]);
      const obfuscatedDocument = obfuscate(intermediateDocument, ["key3"]);
      expect(obfuscate(newDocument, ["key2", "key3"])).toEqual(obfuscatedDocument);
    });
  });

  describe("Issuing a batch of documents", () => {
    test("fails if there is a malformed document", async () => {
      const malformedDatum = [
        ...datum,
        // @ts-expect-error missing properties from OpenAttestationCredential: "@context", credentialSubject, issuanceDate, issuer, and 2 more.
        {
          laurent: "task force, assemble!!"
        } as OpenAttestationVerifiableCredential
      ];
      await expect(wrapCredentials(malformedDatum)).rejects.toStrictEqual(new Error("Invalid document"));
    });
    test("creates a batch of documents if all are in the right format", async () => {
      const wrappedDocuments = await wrapCredentials(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      wrappedDocuments.forEach((doc, i: number) => {
        expect(doc.schema).toBe("http://example.com/schema.json");
        expect(doc.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
        expect(doc.key1).toEqual(expect.stringContaining(datum[i].key1));
        expect(doc.proof.targetHash).toBeDefined();
        expect(doc.proof.merkleRoot).toBeDefined();
        expect(doc.proof.proofs.length).toEqual(2);
      });
    });
    test("checks that documents are wrapped correctly", async () => {
      const wrappedDocuments = await wrapCredentials(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const verified = wrappedDocuments.reduce((prev, curr) => verifySignature(curr) && prev, true);
      expect(verified).toBe(true);
    });
    test("checks that documents conforms to the schema", async () => {
      const wrappedDocuments = await wrapCredentials(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const validatedSchema = wrappedDocuments.reduce((prev: boolean, curr: any) => validateSchema(curr) && prev, true);
      expect(validatedSchema).toBe(true);
    });
    test("does not allow for same merkle root to be generated", async () => {
      const wrappedDocuments = await wrapCredentials(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const newWrappedDocuments = await wrapCredentials(datum, {
        version: SchemaId.v3
      });
      expect(wrappedDocuments[0].proof.merkleRoot).not.toBe(newWrappedDocuments[0].proof.merkleRoot);
    });
  });

  describe("validate", () => {
    test("should return true when document is valid and version is 3.0", () => {
      const credential: OpenAttestationVerifiableCredential = {
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
        openAttestationMetadata: {
          template: {
            name: "CUSTOM_TEMPLATE",
            type: TemplateType.EmbeddedRenderer,
            url: "https://localhost:3000/renderer"
          },
          proof: {
            type: ProofType.OpenAttestationProofMethod,
            method: Method.DocumentStore,
            value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
          },
          identityProof: {
            type: IdentityProofType.DNSTxt,
            location: "tradetrust.io"
          }
        },
        attachments: [
          {
            fileName: "sample.pdf",
            mimeType: "application/pdf",
            data: "BASE64_ENCODED_FILE"
          }
        ],
        proof: {
          salts: "",
          merkleRoot: "",
          privacy: {
            obfuscated: []
          },
          proofs: [],
          targetHash: "",
          type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018
        }
      };
      expect(validateSchema(credential)).toStrictEqual(true);
    });
    test("should return true when document is valid and version is 3.0 and identityProof is W3C-DID", () => {
      const credential: OpenAttestationVerifiableCredential = {
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
          name: "issuer.name"
        },
        credentialSubject: {
          id: "did:example:1234",
          name: "Example Name"
        },
        openAttestationMetadata: {
          template: {
            name: "template.name",
            type: TemplateType.EmbeddedRenderer,
            url: "https://example.com"
          },
          proof: {
            type: ProofType.OpenAttestationProofMethod,
            method: Method.TokenRegistry,
            value: "proof.value"
          },
          identityProof: {
            type: IdentityProofType.W3CDid,
            location: openAttestationDataWithW3CDID.openAttestationMetadata.identityProof?.location
          }
        },
        proof: {
          salts: "",
          merkleRoot: "",
          privacy: {
            obfuscated: []
          },
          proofs: [],
          targetHash: "",
          type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018
        }
      };
      expect(validateSchema(credential)).toStrictEqual(true);
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
              type: ProofType.OpenAttestationProofMethod,
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
    test("should default to 2.0 when document is valid and version is undefined", () => {
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
