import { cloneDeep } from "lodash";
import { SIGNED_BATCHED_VC_DID, SIGNED_VC_DID } from "../fixtures";
import { Signed } from "../types";
import { validateDigest } from "../validate";

const TEST_VCS = {
  "VCs without proofs mean these VCs are digested individually (i.e. targetHash == merkleRoot)": SIGNED_VC_DID,
  "VCs with proofs mean these VCs are digested as a batch (i.e. proofs exist, and targetHash !== merkleRoot)":
    SIGNED_BATCHED_VC_DID[0],
} as const;

describe("V4.0 validate", () => {
  Object.entries(TEST_VCS).forEach(([description, vc]) => {
    describe(`${description}`, () => {
      test("given a VC with unaltered data, should return true", () => {
        expect(validateDigest(vc)).toBe(true);
      });

      describe("tempering", () => {
        test("given a value of a key in object is changed, should return false", () => {
          const newName = "Fake Name";
          expect(vc.issuer.name).not.toBe(newName);
          expect(
            validateDigest({
              ...vc,
              issuer: {
                ...vc.issuer,
                name: "Fake Name", // Value was originally "DEMO STORE"
              },
            })
          ).toBe(false);
        });

        test("given a key in an object is altered (value kept the same), should return false", () => {
          const { name, ...issuerWithoutName } = vc.issuer;

          expect(
            validateDigest({
              ...vc,
              issuer: {
                ...issuerWithoutName,
                fakename: name, // Key was originally "name"
              } as unknown as Signed["issuer"],
            })
          ).toBe(false);
        });

        test("given a new array item is added, should return false", () => {
          const modifiedCredentialSubject = cloneDeep(vc.credentialSubject);
          expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
          modifiedCredentialSubject.licenses.push({
            class: "Class 2A",
            effectiveDate: "2020-06-05T00:00:00Z",
            description: "Motorcycle",
          });
          expect(modifiedCredentialSubject.licenses[2].description).toBeDefined();

          expect(
            validateDigest({
              ...vc,
              credentialSubject: modifiedCredentialSubject,
            })
          ).toBe(false);
        });

        test("given a key in an item is removed, should return false", () => {
          const modifiedCredentialSubject = cloneDeep(vc.credentialSubject);
          expect(modifiedCredentialSubject.licenses[0].description).toBeDefined();
          delete (modifiedCredentialSubject.licenses[0] as any).description;
          expect(modifiedCredentialSubject.licenses[0].description).toBeUndefined();

          expect(
            validateDigest({
              ...vc,
              credentialSubject: modifiedCredentialSubject,
            })
          ).toBe(false);
        });

        describe("given insertion of an empty object, should return false", () => {
          test("given insertion into an object", () => {
            expect(
              validateDigest({
                ...vc,
                credentialSubject: {
                  ...vc.credentialSubject,
                  newField: {},
                },
              })
            ).toBe(false);
          });

          test("given insertion into an array", () => {
            const modifiedCredentialSubject = cloneDeep(vc.credentialSubject);
            expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
            modifiedCredentialSubject.licenses.push({} as any);
            expect(modifiedCredentialSubject.licenses[2]).toEqual({});

            expect(
              validateDigest({
                ...vc,
                credentialSubject: modifiedCredentialSubject,
              })
            ).toBe(false);
          });
        });

        describe("given insertion of an empty array, should return false", () => {
          test("given insertion into an object", () => {
            expect(
              validateDigest({
                ...vc,
                credentialSubject: {
                  ...vc.credentialSubject,
                  newField: [],
                },
              })
            ).toBe(false);
          });

          test("given insertion into an array", () => {
            const modifiedCredentialSubject = cloneDeep(vc.credentialSubject);
            expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
            modifiedCredentialSubject.licenses.push([] as any);
            expect(modifiedCredentialSubject.licenses[2]).toEqual([]);

            expect(
              validateDigest({
                ...vc,
                credentialSubject: modifiedCredentialSubject,
              })
            ).toBe(false);
          });
        });

        test("given insertion of a null value into an object, should return false", () => {
          expect(
            validateDigest({
              ...vc,
              credentialSubject: {
                ...vc.credentialSubject,
                newField: null,
              },
            })
          ).toBe(false);

          const modifiedCredentialSubject = cloneDeep(vc.credentialSubject);
          expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
          modifiedCredentialSubject.licenses.push({} as any);
          expect(modifiedCredentialSubject.licenses[2]).toEqual({});

          expect(
            validateDigest({
              ...vc,
              credentialSubject: modifiedCredentialSubject,
            })
          ).toBe(false);
        });

        test("given a null value is inserted into an array, should return false", () => {
          const modifiedCredentialSubject = cloneDeep(vc.credentialSubject);
          expect(modifiedCredentialSubject.licenses[2]).toBeUndefined();
          modifiedCredentialSubject.licenses.push(null as any);
          expect(modifiedCredentialSubject.licenses[2]).toBe(null);

          expect(
            validateDigest({
              ...vc,
              credentialSubject: modifiedCredentialSubject,
            })
          ).toBe(false);
        });

        test("given an altered value type that string coerce to the same value, should return false", () => {
          const modifiedCredentialSubject = cloneDeep(vc.credentialSubject);
          expect(typeof modifiedCredentialSubject.licenses[0].class).toBe("string");
          modifiedCredentialSubject.licenses[0].class = 3 as unknown as string;
          expect(typeof modifiedCredentialSubject.licenses[0].class).toBe("number");

          expect(
            validateDigest({
              ...vc,
              credentialSubject: modifiedCredentialSubject,
            })
          ).toBe(false);
        });

        test("given a key and value is moved, should return false", () => {
          const modifiedCredentialSubject = cloneDeep(vc.credentialSubject);

          // move "id" from credentialSubject to root
          expect(modifiedCredentialSubject.id).toBe("urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42");
          const id = modifiedCredentialSubject.id;
          delete (modifiedCredentialSubject as any).id;
          expect(modifiedCredentialSubject.id).toBeUndefined();

          expect(
            validateDigest({
              ...vc,
              id,
              credentialSubject: modifiedCredentialSubject,
            })
          ).toBe(false);
        });
      });
    });
  });
});
