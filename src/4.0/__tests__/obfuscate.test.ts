/* eslint-disable @typescript-eslint/no-unused-vars */
import { obfuscateVerifiableCredential } from "../obfuscate";
import { get } from "lodash";
import { decodeSalt } from "../salt";
import { SchemaId } from "../../shared/@types/document";
import { wrapDocument } from "../wrap";
import { Salt, V4Document, V4WrappedDocument } from "../types";
import { verifySignature } from "../../";
import { RAW_DOCUMENT_DID } from "../fixtures";
import { hashLeafNode } from "../digest";

const makeV4RawDocument = <T extends Pick<V4Document, "credentialSubject" | "attachments">>(props: T) =>
  ({
    ...RAW_DOCUMENT_DID,
    ...(props as T),
  } satisfies V4Document);

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
const expectRemovedFieldsWithoutArrayNotation = (
  field: string,
  document: V4WrappedDocument,
  obfuscatedDocument: V4WrappedDocument
) => {
  const value = get(document, field);
  const salt = findSaltByPath(document.proof.salts, field);

  if (!salt) throw new Error("Salt not found for ${field}");

  expect(obfuscatedDocument.proof.privacy.obfuscated).toContain(
    hashLeafNode({ value, salt: salt.value, path: salt.path }, { toHexString: true })
  );
  expect(findSaltByPath(obfuscatedDocument.proof.salts, field)).toBeUndefined();
  expect(obfuscatedDocument).not.toHaveProperty(field);
};

describe("privacy", () => {
  describe("obfuscateDocument", () => {
    test("removes one field from the root object", async () => {
      const PATH_TO_REMOVE = "name";
      const wrappedDocument = await wrapDocument(
        makeV4RawDocument({ credentialSubject: { id: "S1234567A", name: "John Doe" } })
      );
      const obfuscatedDocument = obfuscateVerifiableCredential(wrappedDocument, PATH_TO_REMOVE);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      expectRemovedFieldsWithoutArrayNotation(PATH_TO_REMOVE, wrappedDocument, obfuscatedDocument);
      expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(1);
    });

    test("removes paths that result in an invalid wrapped document, should throw", async () => {
      const PATHS_TO_REMOVE = ["credentialSubject", "renderMethod.0.id", "name"];
      const wrappedDocument = await wrapDocument(
        makeV4RawDocument({ credentialSubject: { id: "S1234567A", name: "John Doe" } })
      );
      expect(() => obfuscateVerifiableCredential(wrappedDocument, PATHS_TO_REMOVE)).toThrowError(
        `"credentialSubject", "renderMethod.0.id"`
      );
    });

    test("removes one key of an object from an array", async () => {
      const PATH_TO_REMOVE = "credentialSubject.arrayOfObject[0].foo" as const;
      const newDocument = await wrapDocument(
        makeV4RawDocument({
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
      const obfuscatedDocument = await obfuscateVerifiableCredential(newDocument, PATH_TO_REMOVE);

      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      const value = get(newDocument, PATH_TO_REMOVE);
      const salt = findSaltByPath(newDocument.proof.salts, PATH_TO_REMOVE);

      if (!salt) throw new Error(`Salt not found for ${PATH_TO_REMOVE}`);

      expect(obfuscatedDocument.proof.privacy.obfuscated).toContain(
        hashLeafNode({ value, salt: salt.value, path: PATH_TO_REMOVE }, { toHexString: true })
      );
      expect(findSaltByPath(obfuscatedDocument.proof.salts, PATH_TO_REMOVE)).toBeUndefined();
      expect(obfuscatedDocument.credentialSubject.arrayOfObject?.[0]).toStrictEqual({ doo: "foo" });
      expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(1);
    });

    test("given an object is to be removed, should remove the object itself, as well as add each of its key's hash into privacy.obfuscated", async () => {
      const PATH_TO_REMOVE = "credentialSubject.hee";
      const wrappedDocument = await wrapDocument(
        makeV4RawDocument({
          credentialSubject: {
            hee: { foo: "bar", doo: "foo" },
            haa: { foo: "baz", doo: "faz" },
          },
        })
      );
      const obfuscatedDocument = obfuscateVerifiableCredential(wrappedDocument, PATH_TO_REMOVE);

      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      // assert that each key of the object has been moved to privacy.obfuscated
      ["credentialSubject.hee.foo", "credentialSubject.hee.doo"].forEach((expectedRemovedField) => {
        const value = get(wrappedDocument, expectedRemovedField);
        const salt = findSaltByPath(wrappedDocument.proof.salts, expectedRemovedField);

        if (!salt) throw new Error(`Salt not found for ${expectedRemovedField}`);

        expect(obfuscatedDocument.proof.privacy.obfuscated).toContain(
          hashLeafNode({ value, salt: salt.value, path: expectedRemovedField }, { toHexString: true })
        );
        expect(findSaltByPath(obfuscatedDocument.proof.salts, expectedRemovedField)).toBeUndefined();
      });

      expect(obfuscatedDocument.credentialSubject?.hee).toBeUndefined(); // let's make sure only the first item has been removed
      expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(2);
    });

    test("given an entire array of objects to remove, should remove the array itself, then for every item, add each of its key's hash into privacy.obfuscated", async () => {
      const PATH_TO_REMOVE = "attachments";
      const wrappedDocument = await wrapDocument(
        makeV4RawDocument({
          credentialSubject: {
            arrayOfObject: [
              { foo: "bar", doo: "foo" },
              { foo: "baz", doo: "faz" },
            ],
          },
          attachments: [
            {
              mimeType: "image/png",
              fileName: "aaa",
              data: "abcd",
            },
            {
              mimeType: "image/png",
              fileName: "bbb",
              data: "abcd",
            },
          ],
        })
      );
      const obfuscatedDocument = await obfuscateVerifiableCredential(wrappedDocument, PATH_TO_REMOVE);

      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      [
        "attachments[0].mimeType",
        "attachments[0].fileName",
        "attachments[0].data",
        "attachments[1].mimeType",
        "attachments[1].fileName",
        "attachments[1].data",
      ].forEach((expectedRemovedField) => {
        const value = get(wrappedDocument, expectedRemovedField);
        const salt = findSaltByPath(wrappedDocument.proof.salts, expectedRemovedField);

        if (!salt) throw new Error(`Salt not found for ${expectedRemovedField}`);

        expect(obfuscatedDocument.proof.privacy.obfuscated).toContain(
          hashLeafNode({ value, salt: salt.value, path: expectedRemovedField }, { toHexString: true })
        );
        expect(findSaltByPath(obfuscatedDocument.proof.salts, expectedRemovedField)).toBeUndefined();
      });
      expect(obfuscatedDocument.attachments).toBeUndefined();
      expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(6);
    });

    test("given multiple fields to be removed, should remove fields and add their hash into privacy.obfuscated", async () => {
      const PATHS_TO_REMOVE = ["credentialSubject.key1", "credentialSubject.key2"];
      const wrappedDocument = await wrapDocument(
        makeV4RawDocument({
          credentialSubject: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
          },
        })
      );
      const obfuscatedDocument = await obfuscateVerifiableCredential(wrappedDocument, PATHS_TO_REMOVE);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      PATHS_TO_REMOVE.forEach((expectedRemovedField) => {
        expectRemovedFieldsWithoutArrayNotation(expectedRemovedField, wrappedDocument, obfuscatedDocument);
      });
      expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(2);
    });

    test("given a path to remove an entire item from an array, should throw", async () => {
      const wrappedDocument = await wrapDocument(
        makeV4RawDocument({
          credentialSubject: {
            arrayOfObject: [
              { foo: "bar", doo: "foo" },
              { foo: "baz", doo: "faz" },
            ],
          },
          attachments: [
            {
              mimeType: "image/png",
              fileName: "aaa",
              data: "abcd",
            },
            {
              mimeType: "image/png",
              fileName: "bbb",
              data: "abcd",
            },
            {
              mimeType: "image/png",
              fileName: "ccc",
              data: "abcd",
            },
          ],
        })
      );

      expect(() => obfuscateVerifiableCredential(wrappedDocument, ["attachments[0]", "attachments[2]"])).toThrow();
    });

    test("given a path to remove all elements in an object, should throw", async () => {
      const wrappedDocument = await wrapDocument(
        makeV4RawDocument({
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
        obfuscateVerifiableCredential(wrappedDocument, [
          "credentialSubject.arrayOfObject[0].foo",
          "credentialSubject.arrayOfObject[0].doo",
        ])
      ).toThrowErrorMatchingInlineSnapshot(
        `"Obfuscation of "credentialSubject.arrayOfObject[0].doo" has resulted in an empty {}, this is currently not supported."`
      );
      expect(() =>
        obfuscateVerifiableCredential(wrappedDocument, ["credentialSubject.object.foo"])
      ).toThrowErrorMatchingInlineSnapshot(
        `"Obfuscation of "credentialSubject.object.foo" has resulted in an empty {}, this is currently not supported."`
      );
    });

    test("is transitive", async () => {
      const wrappedDocument = await wrapDocument(
        makeV4RawDocument({
          credentialSubject: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
          },
        })
      );
      const intermediateDoc = obfuscateVerifiableCredential(wrappedDocument, "key1");
      const finalDoc1 = obfuscateVerifiableCredential(intermediateDoc, "key2");
      const finalDoc2 = obfuscateVerifiableCredential(wrappedDocument, ["key1", "key2"]);

      expect(finalDoc1).toEqual(finalDoc2);
      expect(intermediateDoc).not.toHaveProperty("key1");
      expect(finalDoc1).not.toHaveProperty("key1");
      expect(finalDoc1).not.toHaveProperty("key2");
      expect(finalDoc2).not.toHaveProperty("key1");
      expect(finalDoc2).not.toHaveProperty("key2");
    });
  });

  // describe("getObfuscated", () => {
  //   const documentObfuscatedV3 = ObfuscatedWrapped as WrappedDocument<OpenAttestationDocument>;
  //   const documentNotObfuscatedV3 = NotObfuscatedWrapped as WrappedDocument<OpenAttestationDocument>;

  //   test("should return empty array when there is no obfuscated data in document v3", () => {
  //     expect(getObfuscatedData(documentNotObfuscatedV3)).toHaveLength(0);
  //   });

  //   test("should return array of hashes when there is obfuscated data in document v3", () => {
  //     const obfuscatedData = getObfuscatedData(documentObfuscatedV3);
  //     expect(obfuscatedData.length).toBe(1);
  //     expect(obfuscatedData?.[0]).toBe("e411260249d681968bdde76246350f7ca1c9bf1fae59b6bbf147692961b12e26");
  //   });
  // });

  // describe("isObfuscated", () => {
  //   const documentObfuscatedV3 = ObfuscatedWrapped as WrappedDocument<OpenAttestationDocument>;
  //   const documentNotObfuscatedV3 = NotObfuscatedWrapped as WrappedDocument<OpenAttestationDocument>;

  //   test("should return false when there is no obfuscated data in document v3", () => {
  //     expect(isObfuscated(documentNotObfuscatedV3)).toBe(false);
  //   });

  //   test("should return true where there is obfuscated data in document v3", () => {
  //     expect(isObfuscated(documentObfuscatedV3)).toBe(true);
  //   });
  // });
});
