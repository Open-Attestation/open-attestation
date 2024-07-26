import { obfuscate, validateSchema, verifySignature } from "../..";
import { cloneDeep, omit } from "lodash";
import { RAW_DOCUMENT_DID, SIGNED_WRAPPED_DOCUMENT_DID, WRAPPED_DOCUMENT_DID } from "../fixtures";
import { V4OpenAttestationDocument } from "../types";
import { wrapDocument, wrapDocuments } from "../wrap";

const DOCUMENT_ONE = {
  ...RAW_DOCUMENT_DID,
  credentialSubject: {
    ...RAW_DOCUMENT_DID.credentialSubject,
    key1: "test",
  },
} satisfies V4OpenAttestationDocument;
const DOCUMENT_TWO = {
  ...RAW_DOCUMENT_DID,
  credentialSubject: {
    ...RAW_DOCUMENT_DID.credentialSubject,
    key1: "hello",
    key2: "item2",
  },
} satisfies V4OpenAttestationDocument;

const DOCUMENT_THREE = {
  ...RAW_DOCUMENT_DID,
  credentialSubject: {
    ...RAW_DOCUMENT_DID.credentialSubject,
    key1: "item1",
    key2: "true",
    key3: 3.14159,
    key4: false,
  },
} satisfies V4OpenAttestationDocument;

const DOCUMENT_FOUR = {
  ...RAW_DOCUMENT_DID,
  credentialSubject: {
    ...RAW_DOCUMENT_DID.credentialSubject,
    key1: "item2",
  },
};
const DATUM = [DOCUMENT_ONE, DOCUMENT_TWO, DOCUMENT_THREE, DOCUMENT_FOUR] satisfies V4OpenAttestationDocument[];

describe("V4 E2E Test Scenarios", () => {
  describe("Issuing a single document", () => {
    test("fails for missing data", async () => {
      const missingData = {
        ...omit(cloneDeep(DOCUMENT_ONE), "issuer"),
      };
      await expect(wrapDocument(missingData as unknown as V4OpenAttestationDocument)).rejects
        .toThrowErrorMatchingInlineSnapshot(`
        "Input document does not conform to Open Attestation v4.0 Data Model: 
         {
          "_errors": [],
          "issuer": {
            "_errors": [
              "Required"
            ]
          }
        }"
      `);
    });

    test("creates a wrapped document", async () => {
      const wrappedDocument = await wrapDocument(RAW_DOCUMENT_DID);
      expect(wrappedDocument["@context"]).toEqual([
        "https://www.w3.org/ns/credentials/v2",
        "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
      ]);
      expect(wrappedDocument.type).toEqual(["VerifiableCredential", "OpenAttestationCredential"]);
      expect(wrappedDocument.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
      expect(wrappedDocument.proof.targetHash).toBeDefined();
      expect(wrappedDocument.proof.merkleRoot).toBeDefined();
      expect(wrappedDocument.proof.proofs).toEqual([]);
      expect(wrappedDocument.proof.merkleRoot).toBe(wrappedDocument.proof.targetHash);
    });

    test("checks that document is wrapped correctly", async () => {
      const wrappedDocument = await wrapDocument(DOCUMENT_ONE);
      const verified = verifySignature(wrappedDocument);
      expect(verified).toBe(true);
    });

    test("checks that document conforms to the schema", async () => {
      const wrappedDocument = await wrapDocument(DOCUMENT_ONE);
      expect(validateSchema(wrappedDocument)).toBe(true);
    });

    test("does not allow for the same merkle root to be generated", async () => {
      // This test takes some time to run, so we set the timeout to 14s
      const wrappedDocument = await wrapDocument(DOCUMENT_ONE);
      const newDocument = await wrapDocument(DOCUMENT_ONE);
      expect(wrappedDocument.proof.merkleRoot).not.toBe(newDocument.proof.merkleRoot);
    }, 14000);

    test("obfuscate data correctly", async () => {
      const newDocument = await wrapDocument(DOCUMENT_THREE);
      expect(newDocument.credentialSubject.key2).toBeDefined();
      const obfuscatedDocument = obfuscate(newDocument, ["credentialSubject.key2"]);
      expect(verifySignature(obfuscatedDocument)).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
      expect(obfuscatedDocument.credentialSubject.key2).toBeUndefined();
    });

    test("obfuscate data transistively", async () => {
      const newDocument = await wrapDocument(DOCUMENT_THREE);
      const intermediateDocument = obfuscate(newDocument, ["credentialSubject.key2"]);
      const obfuscatedDocument = obfuscate(intermediateDocument, ["credentialSubject.key3"]);
      expect(obfuscate(newDocument, ["credentialSubject.key2", "credentialSubject.key3"])).toEqual(obfuscatedDocument);
    });

    describe("Issuing a batch of documents", () => {
      test("fails if there is a malformed document", async () => {
        const malformedDatum = [
          ...DATUM,
          {
            laurent: "task force, assemble!!",
          } as unknown as V4OpenAttestationDocument,
        ];
        await expect(wrapDocuments(malformedDatum)).rejects.toThrow(
          "Input document does not conform to Verifiable Credentials"
        );
      });

      test("creates a batch of documents if all are in the right format", async () => {
        const wrappedDocuments = await wrapDocuments(DATUM);
        wrappedDocuments.forEach((doc, i: number) => {
          expect(doc.type).toEqual(["VerifiableCredential", "OpenAttestationCredential"]);
          expect(doc.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
          expect(doc.proof.type).toBe("OpenAttestationMerkleProofSignature2018");
          expect(doc.credentialSubject.key1).toEqual(expect.stringContaining(DATUM[i].credentialSubject.key1));
          expect(doc.proof.targetHash).toBeDefined();
          expect(doc.proof.merkleRoot).toBeDefined();
          expect(doc.proof.proofs.length).toEqual(2);
        });
      });

      test("checks that documents are wrapped correctly", async () => {
        const wrappedDocuments = await wrapDocuments(DATUM);
        const verified = wrappedDocuments.reduce((prev, curr) => verifySignature(curr) && prev, true);
        expect(verified).toBe(true);
      });

      test("checks that documents conforms to the schema", async () => {
        const wrappedDocuments = await wrapDocuments(DATUM);
        const validatedSchema = wrappedDocuments.reduce(
          (prev: boolean, curr: any) => validateSchema(curr) && prev,
          true
        );
        expect(validatedSchema).toBe(true);
      });

      test("does not allow for same merkle root to be generated", async () => {
        const wrappedDocuments = await wrapDocuments(DATUM);
        const newWrappedDocuments = await wrapDocuments(DATUM);
        expect(wrappedDocuments[0].proof.merkleRoot).not.toBe(newWrappedDocuments[0].proof.merkleRoot);
      });
    });
  });

  describe("validate", () => {
    test("should return true when document is a valid wrapped v4 document and identityProof is DNS-DID", () => {
      expect(validateSchema(WRAPPED_DOCUMENT_DID)).toStrictEqual(true);
    });

    test("should return true when signed document is a valid signed wrapped v4 document and identityProof is DNS-DID", () => {
      expect(validateSchema(SIGNED_WRAPPED_DOCUMENT_DID)).toStrictEqual(true);
    });

    test("should return false when document is invalid due to no DNS-DID identifier", () => {
      const modifiedIssuer = cloneDeep(RAW_DOCUMENT_DID.issuer);
      delete (modifiedIssuer as any).id;
      const credential = {
        ...RAW_DOCUMENT_DID,
        issuer: modifiedIssuer,
      } satisfies V4OpenAttestationDocument;
      expect(validateSchema(credential)).toStrictEqual(false);
    });

    test("should default to 2.0 when document is valid and version is undefined", () => {
      expect(
        validateSchema({
          version: undefined,
          data: {
            issuers: [
              {
                name: "issuer.name",
                certificateStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
              },
            ],
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof",
          },
        })
      ).toStrictEqual(true);
    });
  });

  describe("unicode", () => {
    test("should not corrupt unicode document", async () => {
      const document = {
        ...RAW_DOCUMENT_DID,
        credentialSubject: {
          key1: "哦喷啊特特是他题哦你",
          key2: "นยำืฟะะำหะฟะรนื",
          key3: "おぺなってsたちおn",
          key4: "خحثىشففثسفشفهخى",
        },
      };
      const wrapped = await wrapDocument(document);
      expect(wrapped.proof.merkleRoot).toBeTruthy();
      expect(wrapped.credentialSubject.key1).toBe(document.credentialSubject.key1);
      expect(wrapped.credentialSubject.key2).toBe(document.credentialSubject.key2);
      expect(wrapped.credentialSubject.key3).toBe(document.credentialSubject.key3);
      expect(wrapped.credentialSubject.key4).toBe(document.credentialSubject.key4);
    });
  });
});
