import { obfuscateDocument, obfuscateData } from "./obfuscate";
import { OpenAttestationCredentialWithInnerIssuer, validateSchema, verifySignature, wrapDocument } from "../";
import { get } from "lodash";

import { SchemaId } from "../shared/@types/document";
import { Method, OaProofType, TemplateType, IdentityProofType } from "../../src/__generated__/schemaV3";
import { toBuffer } from "../shared/utils";

const openAttestationData: OpenAttestationCredentialWithInnerIssuer = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld",
    "https://nebulis.github.io/tmp-jsonld/CustomContext.jsonld"
  ],
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

const testData = {
  key1: "value1",
  key2: "value2",
  ...openAttestationData
};

describe("privacy", () => {
  describe("obfuscated", () => {
    test("removes one field", async () => {
      const field = "key1";
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      // newDocument.proof.salts.forEach(salt => {
      //   console.log(salt?.value, salt?.path);
      // });
      const { data, obfuscated } = obfuscateData(newDocument, field);
      const salt = newDocument.proof.salts.find(s => s.path === field);
      const value = get(newDocument, field);
      // data.proof.salts.forEach(salt => {
      //   console.log(salt?.value, salt?.path);
      // });
      expect(obfuscated).toEqual([toBuffer(`${salt?.value}:${value}`).toString("hex")]);
      expect(data).not.toHaveProperty(field);
    });

    test("removes multiple fields", async () => {
      const fields = ["key1", "key2"];
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const { data, obfuscated } = obfuscateData(newDocument, fields);
      const salt1 = newDocument.proof.salts.find(s => s.path === fields[0]);
      const salt2 = newDocument.proof.salts.find(s => s.path === fields[1]);
      const value1 = get(newDocument, fields[0]);
      const value2 = get(newDocument, fields[1]);
      expect(obfuscated).toEqual([
        toBuffer(`${salt1?.value}:${value1}`).toString("hex"),
        toBuffer(`${salt2?.value}:${value2}`).toString("hex")
      ]);
      expect(data).not.toHaveProperty(fields);
    });
    test("removes values from root object", async () => {
      const fields = ["key1", "key2"];
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const { data, obfuscated } = obfuscateData(newDocument, fields);
      const salt1 = newDocument.proof.salts.find(s => s.path === fields[0]);
      const salt2 = newDocument.proof.salts.find(s => s.path === fields[1]);
      const value1 = get(newDocument, fields[0]);
      const value2 = get(newDocument, fields[1]);
      expect(obfuscated).toEqual([
        toBuffer(`${salt1?.value}:${value1}`).toString("hex"),
        toBuffer(`${salt2?.value}:${value2}`).toString("hex")
      ]);
      expect(data).not.toHaveProperty(fields);
    });

    test("removes values from nested object", async () => {
      const field = "credentialSubject.degree.name";
      const newDocument = await wrapDocument(openAttestationData, { version: SchemaId.v3 });
      const { data, obfuscated } = obfuscateData(newDocument, field);
      const salt = newDocument.proof.salts.find(s => s.path === field);
      const value = get(newDocument, field);
      expect(obfuscated).toEqual([toBuffer(`${salt?.value}:${value}`).toString("hex")]);
      expect(data).not.toHaveProperty(field);
    });

    test("removes values from arrays", async () => {
      const newDocument = await wrapDocument(openAttestationData, { version: SchemaId.v3 });
      const fields = ["@context[2]", "@context[3]"];
      const { data, obfuscated } = obfuscateData(newDocument, fields);
      const salt1 = newDocument.proof.salts.find(s => s.path === fields[0]);
      const value1 = get(newDocument, fields[0]);
      const salt2 = newDocument.proof.salts.find(s => s.path === fields[1]);
      const value2 = get(newDocument, fields[1]);
      expect(obfuscated).toEqual([
        toBuffer(`${salt1?.value}:${value1}`).toString("hex"),
        toBuffer(`${salt2?.value}:${value2}`).toString("hex")
      ]);
      expect(data).not.toHaveProperty(fields);
    });
  });

  describe("obfuscateDocument", () => {
    test("is transitive", async () => {
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const intermediateDoc = obfuscateDocument(newDocument, "key1");
      const finalDoc1 = obfuscateDocument(intermediateDoc, "key2");
      const finalDoc2 = obfuscateDocument(newDocument, ["key1", "key2"]);
      expect(finalDoc1).toEqual(finalDoc2);
      expect(intermediateDoc).not.toHaveProperty("key1");
      expect(finalDoc1).not.toHaveProperty(["key1", "key2"]);
      expect(finalDoc2).not.toHaveProperty(["key1", "key2"]);
    });
    test("removes one field", async () => {
      const field = "key1";
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, field);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
      expect(obfuscatedDocument).not.toHaveProperty(field);
    });

    test("removes multiple fields", async () => {
      const fields = ["key1", "key2"];
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, fields);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
      expect(obfuscatedDocument).not.toHaveProperty(fields);
    });

    test("removes values from nested object", async () => {
      const fields = ["issuer.name"];
      const newDocument = await wrapDocument(openAttestationData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, fields);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);
      expect(obfuscatedDocument).not.toHaveProperty("issuer.name");
    });
  });
});
