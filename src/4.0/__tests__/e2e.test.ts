import { cloneDeep, omit } from "lodash";
import {
  digestVc,
  digestVcs,
  obfuscateOAVerifiableCredential,
  validateDigest,
  isDigestedOAVerifiableCredential,
} from "../exports";
import type { OAVerifiableCredential } from "../exports";
import { RAW_DOCUMENT_DID, SIGNED_WRAPPED_DOCUMENT_DID, WRAPPED_DOCUMENT_DID } from "../fixtures";

const DOCUMENT_ONE = {
  ...RAW_DOCUMENT_DID,
  credentialSubject: {
    ...RAW_DOCUMENT_DID.credentialSubject,
    key1: "test",
  },
} satisfies OAVerifiableCredential;
const DOCUMENT_TWO = {
  ...RAW_DOCUMENT_DID,
  credentialSubject: {
    ...RAW_DOCUMENT_DID.credentialSubject,
    key1: "hello",
    key2: "item2",
  },
} satisfies OAVerifiableCredential;

const DOCUMENT_THREE = {
  ...RAW_DOCUMENT_DID,
  credentialSubject: {
    ...RAW_DOCUMENT_DID.credentialSubject,
    key1: "item1",
    key2: "true",
    key3: 3.14159,
    key4: false,
  },
} satisfies OAVerifiableCredential;

const DOCUMENT_FOUR = {
  ...RAW_DOCUMENT_DID,
  credentialSubject: {
    ...RAW_DOCUMENT_DID.credentialSubject,
    key1: "item2",
  },
};
const DATUM = [DOCUMENT_ONE, DOCUMENT_TWO, DOCUMENT_THREE, DOCUMENT_FOUR] satisfies OAVerifiableCredential[];

describe("V4.0 E2E Test Scenarios", () => {
  describe("Issuing a single document", () => {
    test("fails for missing data", async () => {
      const missingData = {
        ...omit(cloneDeep(DOCUMENT_ONE), "issuer"),
      };
      await expect(digestVc(missingData as unknown as OAVerifiableCredential)).rejects
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
      const wrappedDocument = await digestVc(RAW_DOCUMENT_DID);
      expect(wrappedDocument["@context"]).toEqual([
        "https://www.w3.org/ns/credentials/v2",
        "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
      ]);
      expect(wrappedDocument.type).toEqual(["VerifiableCredential", "OpenAttestationCredential"]);
      expect(wrappedDocument.proof.type).toBe("OpenAttestationHashProof2018");
      expect(wrappedDocument.proof.targetHash).toBeDefined();
      expect(wrappedDocument.proof.merkleRoot).toBeDefined();
      expect(wrappedDocument.proof.proofs).toEqual([]);
      expect(wrappedDocument.proof.merkleRoot).toBe(wrappedDocument.proof.targetHash);
    });

    test("checks that document is wrapped correctly", async () => {
      const wrappedDocument = await digestVc(DOCUMENT_ONE);
      const verified = validateDigest(wrappedDocument);
      expect(verified).toBe(true);
    });

    test("checks that document conforms to the schema", async () => {
      const wrappedDocument = await digestVc(DOCUMENT_ONE);
      expect(isDigestedOAVerifiableCredential(wrappedDocument)).toBe(true);
    });

    test("does not allow for the same merkle root to be generated", async () => {
      // This test takes some time to run, so we set the timeout to 14s
      const wrappedDocument = await digestVc(DOCUMENT_ONE);
      const newDocument = await digestVc(DOCUMENT_ONE);
      expect(wrappedDocument.proof.merkleRoot).not.toBe(newDocument.proof.merkleRoot);
    }, 14000);

    test("obfuscate data correctly", async () => {
      const newDocument = await digestVc(DOCUMENT_THREE);
      expect(newDocument.credentialSubject.key2).toBeDefined();
      const obfuscatedDocument = obfuscateOAVerifiableCredential(newDocument, ["credentialSubject.key2"]);
      expect(validateDigest(obfuscatedDocument)).toBe(true);
      expect(isDigestedOAVerifiableCredential(obfuscatedDocument)).toBe(true);
      expect(obfuscatedDocument.credentialSubject.key2).toBeUndefined();
    });

    test("obfuscate data transistively", async () => {
      const newDocument = await digestVc(DOCUMENT_THREE);
      const intermediateDocument = obfuscateOAVerifiableCredential(newDocument, ["credentialSubject.key2"]);
      const obfuscatedDocument = obfuscateOAVerifiableCredential(intermediateDocument, ["credentialSubject.key3"]);
      expect(
        obfuscateOAVerifiableCredential(newDocument, ["credentialSubject.key2", "credentialSubject.key3"])
      ).toEqual(obfuscatedDocument);
    });

    describe("Issuing a batch of documents", () => {
      test("fails if there is a malformed document", async () => {
        const malformedDatum = [
          ...DATUM,
          {
            laurent: "task force, assemble!!",
          } as unknown as OAVerifiableCredential,
        ];
        await expect(digestVcs(malformedDatum)).rejects.toThrow(
          "Input document does not conform to Verifiable Credentials"
        );
      });

      test("creates a batch of documents if all are in the right format", async () => {
        const wrappedDocuments = await digestVcs(DATUM);
        wrappedDocuments.forEach((doc, i: number) => {
          expect(doc.type).toEqual(["VerifiableCredential", "OpenAttestationCredential"]);
          expect(doc.proof.type).toBe("OpenAttestationHashProof2018");
          expect(doc.proof.type).toBe("OpenAttestationHashProof2018");
          expect(doc.credentialSubject.key1).toEqual(expect.stringContaining(DATUM[i].credentialSubject.key1));
          expect(doc.proof.targetHash).toBeDefined();
          expect(doc.proof.merkleRoot).toBeDefined();
          expect(doc.proof.proofs.length).toEqual(2);
        });
      });

      test("checks that documents are wrapped correctly", async () => {
        const wrappedDocuments = await digestVcs(DATUM);
        const verified = wrappedDocuments.reduce((prev, curr) => validateDigest(curr) && prev, true);
        expect(verified).toBe(true);
      });

      test("checks that documents conforms to the schema", async () => {
        const wrappedDocuments = await digestVcs(DATUM);
        const validatedSchema = wrappedDocuments.reduce(
          (prev: boolean, curr: any) => isDigestedOAVerifiableCredential(curr) && prev,
          true
        );
        expect(validatedSchema).toBe(true);
      });

      test("does not allow for same merkle root to be generated", async () => {
        const wrappedDocuments = await digestVcs(DATUM);
        const newWrappedDocuments = await digestVcs(DATUM);
        expect(wrappedDocuments[0].proof.merkleRoot).not.toBe(newWrappedDocuments[0].proof.merkleRoot);
      });
    });
  });

  describe("validate schema", () => {
    test("should return true when document is a valid wrapped v4 document and identityProof is DNS-DID", () => {
      expect(isDigestedOAVerifiableCredential(WRAPPED_DOCUMENT_DID)).toStrictEqual(true);
    });

    test("should return true when signed document is a valid signed wrapped v4 document and identityProof is DNS-DID", () => {
      expect(isDigestedOAVerifiableCredential(SIGNED_WRAPPED_DOCUMENT_DID)).toStrictEqual(true);
    });

    test("should return false when document is invalid due to no DNS-DID identifier", () => {
      const modifiedIssuer = cloneDeep(RAW_DOCUMENT_DID.issuer);
      delete (modifiedIssuer as any).id;
      const credential = {
        ...RAW_DOCUMENT_DID,
        issuer: modifiedIssuer,
      } satisfies OAVerifiableCredential;
      expect(isDigestedOAVerifiableCredential(credential)).toStrictEqual(false);
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
      const wrapped = await digestVc(document);
      expect(wrapped.proof.merkleRoot).toBeTruthy();
      expect(wrapped.credentialSubject.key1).toBe(document.credentialSubject.key1);
      expect(wrapped.credentialSubject.key2).toBe(document.credentialSubject.key2);
      expect(wrapped.credentialSubject.key3).toBe(document.credentialSubject.key3);
      expect(wrapped.credentialSubject.key4).toBe(document.credentialSubject.key4);
    });
  });
});
