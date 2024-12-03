/* eslint-disable @typescript-eslint/no-unused-vars */
import { obfuscateOAVerifiableCredential } from "../obfuscate";
import { get } from "lodash";
import { decodeSalt } from "../salt";
import { digestVc } from "../digest";
import { Salt, OAVerifiableCredential, Digested } from "../types";
import { validateDigest } from "../validate";
import { RAW_VC_DID, SIGNED_VC_DID_OBFUSCATED, DIGESTED_VC_DID } from "../fixtures";
import { hashLeafNode } from "../hash";
import { getObfuscatedData, isObfuscated } from "../../shared/utils";

const makeOAVerifiableCredential = <T extends Pick<OAVerifiableCredential, "credentialSubject">>(props: T) => {
  const { credentialSubject, ...rest } = RAW_VC_DID;
  return { ...rest, ...(props as T) } satisfies OAVerifiableCredential;
};

const findSaltByPath = (salts: string, path: string): Salt | undefined => {
  return decodeSalt(salts).find((salt) => salt.path === path);
};

/**
 * /!\ This method doesn't work with array like notation
 * This method will ensure
 * - the field has been added to the obfuscated array
 * - the salt bound to the field has been removed
 * - the field has been removed
 */
const expectRemovedFieldsWithoutArrayNotation = (field: string, vc: Digested, obfuscatedVc: Digested) => {
  const value = get(vc, field);
  const salt = findSaltByPath(vc.proof.salts, field);

  if (!salt) throw new Error("Salt not found for ${field}");

  expect(obfuscatedVc.proof.privacy.obfuscated).toContain(
    hashLeafNode({ value, salt: salt.value, path: salt.path }, { toHexString: true })
  );
  expect(findSaltByPath(obfuscatedVc.proof.salts, field)).toBeUndefined();
  expect(obfuscatedVc).not.toHaveProperty(field);
};

describe("V4.0 obfuscate", () => {
  describe("obfuscateVC", () => {
    test("removes one field from the root object", async () => {
      const PATH_TO_REMOVE = "name";
      const digestedVc = await digestVc(
        makeOAVerifiableCredential({ credentialSubject: { id: "S1234567A", name: "John Doe" } })
      );
      const obfuscatedVc = obfuscateOAVerifiableCredential(digestedVc, PATH_TO_REMOVE);
      const verified = validateDigest(obfuscatedVc);
      expect(verified).toBe(true);

      expectRemovedFieldsWithoutArrayNotation(PATH_TO_REMOVE, digestedVc, obfuscatedVc);
      expect(obfuscatedVc.proof.privacy.obfuscated).toHaveLength(1);
    });

    test("removes paths that result in an invalid digested VC, should throw", async () => {
      const PATHS_TO_REMOVE = ["credentialSubject", "renderMethod.0.id", "name"];
      const digestedVc = await digestVc(
        makeOAVerifiableCredential({ credentialSubject: { id: "S1234567A", name: "John Doe" } })
      );
      expect(() => obfuscateOAVerifiableCredential(digestedVc, PATHS_TO_REMOVE)).toThrowError(
        `"credentialSubject", "renderMethod.0.id"`
      );
    });

    test("removes one key of an object from an array", async () => {
      const PATH_TO_REMOVE = "credentialSubject.arrayOfObject[0].foo" as const;
      const digestedVc = await digestVc(
        makeOAVerifiableCredential({
          credentialSubject: {
            id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
            alumniOf: "Example University",
            array: ["one", "two", "three", "four"],
            arrayOfObject: [
              { foo: "bar", doo: "foo" },
              { foo: "baz", doo: "faz" },
            ],
          },
        })
      );
      const obfuscatedVc = obfuscateOAVerifiableCredential(digestedVc, PATH_TO_REMOVE);

      const verified = validateDigest(obfuscatedVc);
      expect(verified).toBe(true);

      const value = get(digestedVc, PATH_TO_REMOVE);
      const salt = findSaltByPath(digestedVc.proof.salts, PATH_TO_REMOVE);

      if (!salt) throw new Error(`Salt not found for ${PATH_TO_REMOVE}`);

      expect(obfuscatedVc.proof.privacy.obfuscated).toContain(
        hashLeafNode({ value, salt: salt.value, path: PATH_TO_REMOVE }, { toHexString: true })
      );
      expect(findSaltByPath(obfuscatedVc.proof.salts, PATH_TO_REMOVE)).toBeUndefined();
      expect(obfuscatedVc.credentialSubject.arrayOfObject?.[0]).toStrictEqual({ doo: "foo" });
      expect(obfuscatedVc.proof.privacy.obfuscated).toHaveLength(1);
    });

    test("given an object is to be removed, should remove the object itself, as well as add each of its key's hash into privacy.obfuscated", async () => {
      const PATH_TO_REMOVE = "credentialSubject.hee";
      const digested = await digestVc(
        makeOAVerifiableCredential({
          credentialSubject: {
            hee: { foo: "bar", doo: "foo" },
            haa: { foo: "baz", doo: "faz" },
          },
        })
      );
      const obfuscatedVc = obfuscateOAVerifiableCredential(digested, PATH_TO_REMOVE);

      const verified = validateDigest(obfuscatedVc);
      expect(verified).toBe(true);

      // assert that each key of the object has been moved to privacy.obfuscated
      ["credentialSubject.hee.foo", "credentialSubject.hee.doo"].forEach((expectedRemovedField) => {
        const value = get(digested, expectedRemovedField);
        const salt = findSaltByPath(digested.proof.salts, expectedRemovedField);

        if (!salt) throw new Error(`Salt not found for ${expectedRemovedField}`);

        expect(obfuscatedVc.proof.privacy.obfuscated).toContain(
          hashLeafNode({ value, salt: salt.value, path: expectedRemovedField }, { toHexString: true })
        );
        expect(findSaltByPath(obfuscatedVc.proof.salts, expectedRemovedField)).toBeUndefined();
      });

      expect(obfuscatedVc.credentialSubject?.hee).toBeUndefined(); // let's make sure only the first item has been removed
      expect(obfuscatedVc.proof.privacy.obfuscated).toHaveLength(2);
    });

    test("given an entire array of objects to remove, should remove the array itself, then for every item, add each of its key's hash into privacy.obfuscated", async () => {
      const PATH_TO_REMOVE = "credentialSubject.attachments";
      const digested = await digestVc(
        makeOAVerifiableCredential({
          credentialSubject: {
            arrayOfObject: [
              { foo: "bar", doo: "foo" },
              { foo: "baz", doo: "faz" },
            ],
            attachments: [
              {
                mimeType: "image/png",
                filename: "aaa",
                data: "abcd",
              },
              {
                mimeType: "image/png",
                filename: "bbb",
                data: "abcd",
              },
            ],
          },
        })
      );
      const obfuscatedVc = obfuscateOAVerifiableCredential(digested, PATH_TO_REMOVE);

      const verified = validateDigest(obfuscatedVc);
      expect(verified).toBe(true);

      [
        "credentialSubject.attachments[0].mimeType",
        "credentialSubject.attachments[0].filename",
        "credentialSubject.attachments[0].data",
        "credentialSubject.attachments[1].mimeType",
        "credentialSubject.attachments[1].filename",
        "credentialSubject.attachments[1].data",
      ].forEach((expectedRemovedField) => {
        const value = get(digested, expectedRemovedField);
        const salt = findSaltByPath(digested.proof.salts, expectedRemovedField);

        if (!salt) throw new Error(`Salt not found for ${expectedRemovedField}`);

        expect(obfuscatedVc.proof.privacy.obfuscated).toContain(
          hashLeafNode({ value, salt: salt.value, path: expectedRemovedField }, { toHexString: true })
        );
        expect(findSaltByPath(obfuscatedVc.proof.salts, expectedRemovedField)).toBeUndefined();
      });
      expect(obfuscatedVc.credentialSubject.attachments).toBeUndefined();
      expect(obfuscatedVc.proof.privacy.obfuscated).toHaveLength(6);
    });

    test("given multiple fields to be removed, should remove fields and add their hash into privacy.obfuscated", async () => {
      const PATHS_TO_REMOVE = ["credentialSubject.key1", "credentialSubject.key2"];
      const digested = await digestVc(
        makeOAVerifiableCredential({
          credentialSubject: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
          },
        })
      );
      const obfuscatedVc = obfuscateOAVerifiableCredential(digested, PATHS_TO_REMOVE);
      const verified = validateDigest(obfuscatedVc);
      expect(verified).toBe(true);

      PATHS_TO_REMOVE.forEach((expectedRemovedField) => {
        expectRemovedFieldsWithoutArrayNotation(expectedRemovedField, digested, obfuscatedVc);
      });
      expect(obfuscatedVc.proof.privacy.obfuscated).toHaveLength(2);
    });

    test("given a path to remove an entire item from an array, should throw", async () => {
      const digested = await digestVc(
        makeOAVerifiableCredential({
          credentialSubject: {
            arrayOfObject: [
              { foo: "bar", doo: "foo" },
              { foo: "baz", doo: "faz" },
            ],
            attachments: [
              {
                mimeType: "image/png",
                filename: "aaa",
                data: "abcd",
              },
              {
                mimeType: "image/png",
                filename: "bbb",
                data: "abcd",
              },
              {
                mimeType: "image/png",
                filename: "ccc",
                data: "abcd",
              },
            ],
          },
        })
      );

      expect(() =>
        obfuscateOAVerifiableCredential(digested, [
          "credentialSubject.attachments[0]",
          "credentialSubject.attachments[2]",
        ])
      ).toThrow();
    });

    test("given a path to remove all elements in an object, should throw", async () => {
      const digested = await digestVc(
        makeOAVerifiableCredential({
          credentialSubject: {
            arrayOfObject: [
              { foo: "bar", doo: "foo" },
              { foo: "baz", doo: "faz" },
            ],
            object: {
              foo: "bar",
            },
          },
        })
      );

      expect(() =>
        obfuscateOAVerifiableCredential(digested, [
          "credentialSubject.arrayOfObject[0].foo",
          "credentialSubject.arrayOfObject[0].doo",
        ])
      ).toThrowErrorMatchingInlineSnapshot(
        `"Obfuscation of "credentialSubject.arrayOfObject[0].doo" has resulted in an empty {}, this is currently not supported. Alternatively, if the object is not part of an array, you may choose to obfuscate the parent of "credentialSubject.arrayOfObject[0].doo"."`
      );
      expect(() =>
        obfuscateOAVerifiableCredential(digested, ["credentialSubject.object.foo"])
      ).toThrowErrorMatchingInlineSnapshot(
        `"Obfuscation of "credentialSubject.object.foo" has resulted in an empty {}, this is currently not supported. Alternatively, if the object is not part of an array, you may choose to obfuscate the parent of "credentialSubject.object.foo"."`
      );
    });

    test("is transitive", async () => {
      const digested = await digestVc(
        makeOAVerifiableCredential({
          credentialSubject: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
          },
        })
      );
      const intermediateDoc = obfuscateOAVerifiableCredential(digested, "key1");
      const finalDoc1 = obfuscateOAVerifiableCredential(intermediateDoc, "key2");
      const finalDoc2 = obfuscateOAVerifiableCredential(digested, ["key1", "key2"]);

      expect(finalDoc1).toEqual(finalDoc2);
      expect(intermediateDoc).not.toHaveProperty("key1");
      expect(finalDoc1).not.toHaveProperty("key1");
      expect(finalDoc1).not.toHaveProperty("key2");
      expect(finalDoc2).not.toHaveProperty("key1");
      expect(finalDoc2).not.toHaveProperty("key2");
    });
  });

  describe("getObfuscated", () => {
    test("should return empty array when there is no obfuscated data in VC", () => {
      expect(getObfuscatedData(DIGESTED_VC_DID)).toHaveLength(0);
    });

    test("should return array of hashes when there is obfuscated data in VC", () => {
      const obfuscatedData = getObfuscatedData(SIGNED_VC_DID_OBFUSCATED);
      expect(obfuscatedData.length).toBe(1);
      expect(obfuscatedData?.[0]).toMatchInlineSnapshot(
        `"7f2ecdae29b49b3a971d5acdfbbf9225a193e735ce41b89b0d84cca801794fc9"`
      );
    });
  });

  describe("isObfuscated", () => {
    test("should return false when there is no obfuscated data in VC", () => {
      expect(isObfuscated(DIGESTED_VC_DID)).toBe(false);
    });

    test("should return true where there is obfuscated data in VC", () => {
      expect(isObfuscated(SIGNED_VC_DID_OBFUSCATED)).toBe(true);
    });
  });
});
