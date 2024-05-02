import { cloneDeep } from "lodash";
import { SIGNED_WRAPPED_DOCUMENT_DID } from "../fixtures";
import { V4SignedWrappedDocument } from "../types";
import { verify } from "../verify";

describe("signature", () => {
  describe("verify", () => {
    // Documents without proofs mean these documents are wrapped individually (i.e. targetHash == merkleRoot)
    describe("documents without proofs", () => {
      test("returns true for documents with unaltered data", () => {
        expect(verify(SIGNED_WRAPPED_DOCUMENT_DID)).toBe(true);
      });

      test("returns false for documents with altered value", () => {
        expect(
          verify({
            ...SIGNED_WRAPPED_DOCUMENT_DID,
            issuer: {
              ...SIGNED_WRAPPED_DOCUMENT_DID.issuer,
              name: "Fake Name", // Value was originally "DEMO STORE"
            },
          })
        ).toBe(false);
      });

      test("returns false for documents with altered key", () => {
        const { name: _, ...issuerWithoutName } = SIGNED_WRAPPED_DOCUMENT_DID.issuer;

        expect(
          verify({
            ...SIGNED_WRAPPED_DOCUMENT_DID,
            issuer: {
              ...issuerWithoutName,
              fakename: "DEMO STORE", // Key was originally "name"
            } as unknown as V4SignedWrappedDocument["issuer"],
          })
        ).toBe(false);
      });

      test("returns false for documents with additional data not part of salt", () => {
        const modifiedCredentialSubject = cloneDeep(SIGNED_WRAPPED_DOCUMENT_DID.credentialSubject);
        expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
        modifiedCredentialSubject.licenses.push({
          class: "Class 2A",
          effectiveDate: "2020-06-05T00:00:00Z",
          description: "Motorcycle",
        });
        expect(modifiedCredentialSubject.licenses[2].description).toBeDefined();

        expect(
          verify({
            ...SIGNED_WRAPPED_DOCUMENT_DID,
            credentialSubject: {
              ...modifiedCredentialSubject,
            },
          })
        ).toBe(false);
      });

      test("returns false for documents with missing data", () => {
        const modifiedCredentialSubject = cloneDeep(SIGNED_WRAPPED_DOCUMENT_DID.credentialSubject);
        expect(modifiedCredentialSubject.licenses[0].description).toBeDefined();
        delete (modifiedCredentialSubject.licenses[0] as any).description;
        expect(modifiedCredentialSubject.licenses[0].description).toBeUndefined();

        expect(
          verify({
            ...SIGNED_WRAPPED_DOCUMENT_DID,
            credentialSubject: {
              ...modifiedCredentialSubject,
            },
          })
        ).toBe(false);
      });

      test.todo("given insertion of an empty object, should return false");
      test.todo("given insertion of an empty array, should return false");
      test.todo("given an altered value type that string coerce to the same value, should return false");
      test.todo("given a key and value is moved, should return false");
    });

    // Documents with proofs mean these documents are wrapped as a batch (i.e. proofs exist, and targetHash !== merkleRoot)
    describe("documents with proofs", () => {
      test.todo("returns true for documents with unaltered data");
      test.todo("returns false for documents with altered value");
      test.todo("returns false for documents with altered key");
      test.todo("returns false for documents with additional data not part of salt");
      test.todo("returns false for documents with missing data");
      test.todo("returns false for documents with altered targetHash");
      test.todo("returns false for documents with altered proofs");
      test.todo("returns false for documents with missing proofs");
      test.todo("returns false for documents with altered merkleRoot");
    });
  });
});
