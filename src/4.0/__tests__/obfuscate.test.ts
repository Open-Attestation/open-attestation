/* eslint-disable @typescript-eslint/no-unused-vars */
import { obfuscateVerifiableCredential } from "../obfuscate";
import { get } from "lodash";
import { decodeSalt } from "../salt";
import { SchemaId } from "../../shared/@types/document";
import { toBuffer, isObfuscated, getObfuscatedData } from "../../shared/utils";
import { wrapDocument } from "../wrap";
import { Salt, V4Document, V4WrappedDocument } from "../types";
import { verifySignature } from "../../";

const makeV4RawDocument = <T extends V4Document["credentialSubject"]>(credentialSubject: T) =>
  ({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
    ],
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    validFrom: "2021-03-08T12:00:00+08:00",
    name: "Republic of Singapore Driving Licence",
    issuer: {
      id: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90",
      type: "OpenAttestationIssuer",
      name: "Government Technology Agency of Singapore (GovTech)",
      identityProof: { identityProofType: "DNS-DID", identifier: "example.openattestation.com" },
    },
    renderMethod: [
      {
        id: "https://demo-renderer.opencerts.io",
        type: "OpenAttestationEmbeddedRenderer",
        templateName: "GOVTECH_DEMO",
      },
    ],
    credentialSubject: credentialSubject as T,
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

  expect(obfuscatedDocument.proof.privacy.obfuscated).toContain(
    toBuffer({ [field]: `${salt?.value}:${value}` }).toString("hex")
  );
  expect(findSaltByPath(obfuscatedDocument.proof.salts, field)).toBeUndefined();
  expect(obfuscatedDocument).not.toHaveProperty(field);
};

describe("privacy", () => {
  describe("obfuscateDocument", () => {
    test("removes one field from the root object", async () => {
      const PATH_TO_REMOVE = "name";
      const rawDocument = makeV4RawDocument({ id: "S1234567A", name: "John Doe" });
      const wrappedDocument = await wrapDocument(rawDocument);
      const obfuscatedDocument = obfuscateVerifiableCredential(wrappedDocument, PATH_TO_REMOVE);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      expectRemovedFieldsWithoutArrayNotation(PATH_TO_REMOVE, wrappedDocument, obfuscatedDocument);
      expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(1);
    });

    test("removes paths that result in an invalid wrapped document, should throw", async () => {
      const PATHS_TO_REMOVE = ["credentialSubject.id", "credentialSubject.name", "renderMethod.0.id", "name"];
      const rawDocument = makeV4RawDocument({ id: "S1234567A", name: "John Doe" });
      const wrappedDocument = await wrapDocument(rawDocument);
      expect(() => obfuscateVerifiableCredential(wrappedDocument, PATHS_TO_REMOVE)).toThrowError(
        `"credentialSubject", "renderMethod.0.id"`
      );
    });

    test("removes one key of an object from an array", async () => {
      const PATH_TO_REMOVE = "credentialSubject.arrayOfObject[0].foo" as const;
      const rawDocument = makeV4RawDocument({
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
        alumniOf: "Example University",
        array: ["one", "two", "three", "four"],
        arrayOfObject: [
          { foo: "bar", doo: "foo" },
          { foo: "baz", doo: "faz" },
        ],
      });
      const newDocument = await wrapDocument(rawDocument);
      const obfuscatedDocument = await obfuscateVerifiableCredential(newDocument, PATH_TO_REMOVE);

      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      const value = get(newDocument, PATH_TO_REMOVE);
      const salt = findSaltByPath(newDocument.proof.salts, PATH_TO_REMOVE);

      expect(obfuscatedDocument.proof.privacy.obfuscated).toContain(
        toBuffer({ [PATH_TO_REMOVE]: `${salt?.value}:${value}` }).toString("hex")
      );
      expect(findSaltByPath(obfuscatedDocument.proof.salts, PATH_TO_REMOVE)).toBeUndefined();
      expect(obfuscatedDocument.credentialSubject.arrayOfObject[0]).toStrictEqual({ doo: "foo" });
      expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(1);
    });

    test("removes one object from an array", async () => {
      const field = "credentialSubject.arrayOfObject[0]";
      const PATHS_TO_REMOVE = ["credentialSubject.arrayOfObject[0].foo", "credentialSubject.arrayOfObject[0].doo"];
      const rawDocument = makeV4RawDocument({
        id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
        alumniOf: "Example University",
        array: ["one", "two", "three", "four"],
        arrayOfObject: [
          { foo: "bar", doo: "foo" },
          { foo: "baz", doo: "faz" },
        ],
      });
      const wrappedDocument = await wrapDocument(rawDocument);
      const obfuscatedDocument = obfuscateVerifiableCredential(wrappedDocument, PATHS_TO_REMOVE);

      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      PATHS_TO_REMOVE.forEach((field) => {
        const value = get(wrappedDocument, field);
        const salt = findSaltByPath(wrappedDocument.proof.salts, field);

        expect(obfuscatedDocument.proof.privacy.obfuscated).toContain(
          toBuffer({ [field]: `${salt?.value}:${value}` }).toString("hex")
        );
        expect(findSaltByPath(obfuscatedDocument.proof.salts, field)).toBeUndefined();
      });
      expect(obfuscatedDocument.credentialSubject.arrayOfObject[0]).toBeUndefined();
      expect(obfuscatedDocument.credentialSubject.arrayOfObject[1]).not.toBeUndefined(); // let's make sure only the first item has been removed
      expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(2);
    });
    // test("removes an array of object", async () => {
    //   const field = "attachments";
    //   const expectedFieldsToBeRemoved = [
    //     "attachments[0].mimeType",
    //     "attachments[0].fileName",
    //     "attachments[0].data",
    //     "attachments[1].mimeType",
    //     "attachments[1].fileName",
    //     "attachments[1].data",
    //   ];
    //   const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
    //   const obfuscatedDocument = await obfuscateVerifiableCredential(newDocument, field);

    //   const verified = verifySignature(obfuscatedDocument);
    //   expect(verified).toBe(true);

    //   expectedFieldsToBeRemoved.forEach((field) => {
    //     const value = get(newDocument, field);
    //     const salt = findSaltByPath(newDocument.proof.salts, field);

    //     expect(obfuscatedDocument.proof.privacy.obfuscated).toContain(
    //       toBuffer({ [field]: `${salt?.value}:${value}` }).toString("hex")
    //     );
    //     expect(findSaltByPath(obfuscatedDocument.proof.salts, field)).toBeUndefined();
    //   });
    //   expect(obfuscatedDocument.attachments).toBeUndefined();
    //   expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(6);
    // });

    // test("removes multiple fields", async () => {
    //   const fields = ["key1", "key2"];
    //   const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
    //   const obfuscatedDocument = await obfuscateVerifiableCredential(newDocument, fields);
    //   const verified = verifySignature(obfuscatedDocument);
    //   expect(verified).toBe(true);

    //   fields.forEach((field) => {
    //     expectRemovedFieldsWithoutArrayNotation(field, newDocument, obfuscatedDocument);
    //   });
    //   expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(2);
    // });

    // test("removes values from nested object", async () => {
    //   const field = "credentialSubject.alumniOf";
    //   const newDocument = await wrapDocument(openAttestationData, { version: SchemaId.v3 });
    //   const obfuscatedDocument = await obfuscateVerifiableCredential(newDocument, field);
    //   const verified = verifySignature(obfuscatedDocument);
    //   expect(verified).toBe(true);

    //   expectRemovedFieldsWithoutArrayNotation(field, newDocument, obfuscatedDocument);
    //   expect(obfuscatedDocument.proof.privacy.obfuscated).toHaveLength(1);
    // });

    // test("removes values from arrays", async () => {
    //   const fields = ["credentialSubject.array[2]", "credentialSubject.array[3]"];
    //   const newDocument = await wrapDocument(openAttestationData, { version: SchemaId.v3 });
    //   const obfuscatedDocument = await obfuscateVerifiableCredential(newDocument, fields);
    //   const verified = verifySignature(obfuscatedDocument);
    //   expect(verified).toBe(true);

    //   const salts = decodeSalt(newDocument.proof.salts);
    //   const salt1 = salts.find((s) => s.path === fields[0]);
    //   const value1 = get(newDocument, fields[0]);
    //   const salt2 = salts.find((s) => s.path === fields[1]);
    //   const value2 = get(newDocument, fields[1]);

    //   expect(obfuscatedDocument.proof.privacy.obfuscated).toEqual([
    //     toBuffer({ [fields[0]]: `${salt1?.value}:${value1}` }).toString("hex"),
    //     toBuffer({ [fields[1]]: `${salt2?.value}:${value2}` }).toString("hex"),
    //   ]);
    //   expect(findSaltByPath(obfuscatedDocument.proof.salts, fields[0])).toBeUndefined();
    //   expect(findSaltByPath(obfuscatedDocument.proof.salts, fields[1])).toBeUndefined();
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore not typable
    //   expect(obfuscatedDocument.credentialSubject.array).not.toContain("three");
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore not typable
    //   expect(obfuscatedDocument.credentialSubject.array).not.toContain("four");
    // });

    // test("is transitive", async () => {
    //   const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
    //   const intermediateDoc = obfuscateVerifiableCredential(newDocument, "key1");
    //   const finalDoc1 = obfuscateVerifiableCredential(intermediateDoc, "key2");
    //   const finalDoc2 = obfuscateVerifiableCredential(newDocument, ["key1", "key2"]);

    //   expect(finalDoc1).toEqual(finalDoc2);
    //   expect(intermediateDoc).not.toHaveProperty("key1");
    //   expect(finalDoc1).not.toHaveProperty("key1");
    //   expect(finalDoc1).not.toHaveProperty("key2");
    //   expect(finalDoc2).not.toHaveProperty("key1");
    //   expect(finalDoc2).not.toHaveProperty("key2");
    // });
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
