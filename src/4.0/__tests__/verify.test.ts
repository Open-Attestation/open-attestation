import { cloneDeep } from "lodash";
import { BATCHED_SIGNED_WRAPPED_DOCUMENTS_DID, SIGNED_WRAPPED_DOCUMENT_DID } from "../fixtures";
import { V4SignedWrappedDocument } from "../types";
import { verify } from "../verify";

const TEST_DOCUMENTS = {
  "Document without proofs mean these documents are wrapped individually (i.e. targetHash == merkleRoot)":
    SIGNED_WRAPPED_DOCUMENT_DID,
  "Document with proofs mean these documents are wrapped as a batch (i.e. proofs exist, and targetHash !== merkleRoot)":
    BATCHED_SIGNED_WRAPPED_DOCUMENTS_DID[0],
} as const;

describe("signature", () => {
  describe("verify", () => {
    Object.entries(TEST_DOCUMENTS).forEach(([description, document]) => {
      describe(`${description}`, () => {
        test("given a document wiht unaltered data, should return true", () => {
          expect(verify(document)).toBe(true);
        });

        describe("tempering", () => {
          test("given a value of a key in object is changed, should return false", () => {
            const newName = "Fake Name";
            expect(document.issuer.name).not.toBe(newName);
            expect(
              verify({
                ...document,
                issuer: {
                  ...document.issuer,
                  name: "Fake Name", // Value was originally "DEMO STORE"
                },
              })
            ).toBe(false);
          });

          test("given a key in an object is altered (value kept the same), should return false", () => {
            const { name, ...issuerWithoutName } = document.issuer;

            expect(
              verify({
                ...document,
                issuer: {
                  ...issuerWithoutName,
                  fakename: name, // Key was originally "name"
                } as unknown as V4SignedWrappedDocument["issuer"],
              })
            ).toBe(false);
          });

          test("given a new array item is added, should return false", () => {
            const modifiedCredentialSubject = cloneDeep(document.credentialSubject);
            expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
            modifiedCredentialSubject.licenses.push({
              class: "Class 2A",
              effectiveDate: "2020-06-05T00:00:00Z",
              description: "Motorcycle",
            });
            expect(modifiedCredentialSubject.licenses[2].description).toBeDefined();

            expect(
              verify({
                ...document,
                credentialSubject: modifiedCredentialSubject,
              })
            ).toBe(false);
          });

          test("given a key in an item is removed, should return false", () => {
            const modifiedCredentialSubject = cloneDeep(document.credentialSubject);
            expect(modifiedCredentialSubject.licenses[0].description).toBeDefined();
            delete (modifiedCredentialSubject.licenses[0] as any).description;
            expect(modifiedCredentialSubject.licenses[0].description).toBeUndefined();

            expect(
              verify({
                ...document,
                credentialSubject: modifiedCredentialSubject,
              })
            ).toBe(false);
          });

          describe("given insertion of an empty object, should return false", () => {
            test("given insertion into an object", () => {
              expect(
                verify({
                  ...document,
                  credentialSubject: {
                    ...document.credentialSubject,
                    newField: {},
                  },
                })
              ).toBe(false);
            });

            test("given insertion into an array", () => {
              const modifiedCredentialSubject = cloneDeep(document.credentialSubject);
              expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
              modifiedCredentialSubject.licenses.push({} as any);
              expect(modifiedCredentialSubject.licenses[2]).toEqual({});

              expect(
                verify({
                  ...document,
                  credentialSubject: modifiedCredentialSubject,
                })
              ).toBe(false);
            });
          });

          describe("given insertion of an empty array, should return false", () => {
            test("given insertion into an object", () => {
              expect(
                verify({
                  ...document,
                  credentialSubject: {
                    ...document.credentialSubject,
                    newField: [],
                  },
                })
              ).toBe(false);
            });

            test("given insertion into an array", () => {
              const modifiedCredentialSubject = cloneDeep(document.credentialSubject);
              expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
              modifiedCredentialSubject.licenses.push([] as any);
              expect(modifiedCredentialSubject.licenses[2]).toEqual([]);

              expect(
                verify({
                  ...document,
                  credentialSubject: modifiedCredentialSubject,
                })
              ).toBe(false);
            });
          });

          test("given insertion of a null value into an object, should return false", () => {
            expect(
              verify({
                ...document,
                credentialSubject: {
                  ...document.credentialSubject,
                  newField: null,
                },
              })
            ).toBe(false);

            const modifiedCredentialSubject = cloneDeep(document.credentialSubject);
            expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
            modifiedCredentialSubject.licenses.push({} as any);
            expect(modifiedCredentialSubject.licenses[2]).toEqual({});

            expect(
              verify({
                ...document,
                credentialSubject: modifiedCredentialSubject,
              })
            ).toBe(false);
          });

          test("given a null value is inserted into an array, should return false", () => {
            const modifiedCredentialSubject = cloneDeep(document.credentialSubject);
            expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
            modifiedCredentialSubject.licenses.push(null as any);
            expect(modifiedCredentialSubject.licenses[2]).toBe(null);

            expect(
              verify({
                ...document,
                credentialSubject: modifiedCredentialSubject,
              })
            ).toBe(false);
          });

          test("given an altered value type that string coerce to the same value, should return false", () => {
            const modifiedCredentialSubject = cloneDeep(document.credentialSubject);
            expect(typeof modifiedCredentialSubject.licenses[0].class).toBe("string");
            modifiedCredentialSubject.licenses[0].class = 3 as unknown as string;
            expect(typeof modifiedCredentialSubject.licenses[0].class).toBe("number");

            expect(
              verify({
                ...document,
                credentialSubject: modifiedCredentialSubject,
              })
            ).toBe(false);
          });

          test("given a key and value is moved, should return false", () => {
            const modifiedCredentialSubject = cloneDeep(document.credentialSubject);

            // move "id" from credentialSubject to root
            expect(modifiedCredentialSubject.id).toBe("urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42");
            const id = modifiedCredentialSubject.id;
            delete (modifiedCredentialSubject as any).id;
            expect(modifiedCredentialSubject.id).toBeUndefined();

            expect(
              verify({
                ...document,
                id,
                credentialSubject: modifiedCredentialSubject,
              })
            ).toBe(false);
          });
        });
      });
    });
  });
});
