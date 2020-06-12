import { obfuscateDocument } from "./obfuscate";
import { verifySignature, wrapDocument } from "../";
import { get } from "lodash";
import { decodeSalt } from "./wrap";

import { SchemaId } from "../shared/@types/document";
import { Method, OaProofType, OpenAttestationCredential } from "../../src/__generated__/schemaV3";
import { toBuffer } from "../shared/utils";

const openAttestationData: OpenAttestationCredential = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld",
    "https://nebulis.github.io/tmp-jsonld/CustomContext.jsonld"
  ],
  issuanceDate: "2010-01-01T19:23:24Z",
  name: "document owner name",
  type: ["VerifiableCredential", "AlumniCredential"],
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
    alumniOf: "Example University"
  },
  issuer: "https://example.edu/issuers/14",
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
  describe("obfuscateDocument", () => {
    test("removes one field from the root object", async () => {
      const field = "key1";
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, field);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      const salt = decodeSalt(newDocument.proof.salts).find(s => s.path === field);
      const value = get(newDocument, field);

      expect(obfuscatedDocument.proof.privacy.obfuscated).toEqual([
        toBuffer({ [field]: `${salt?.value}:${value}` }).toString("hex")
      ]);
      expect(decodeSalt(obfuscatedDocument.proof.salts)).not.toHaveProperty(field);
      expect(obfuscatedDocument).not.toHaveProperty(field);
    });

    test("removes multiple fields", async () => {
      const fields = ["key1", "key2"];
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, fields);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      const salts = decodeSalt(newDocument.proof.salts);
      const salt1 = salts.find(s => s.path === fields[0]);
      const salt2 = salts.find(s => s.path === fields[1]);
      const value1 = get(newDocument, fields[0]);
      const value2 = get(newDocument, fields[1]);

      expect(obfuscatedDocument.proof.privacy.obfuscated).toEqual([
        toBuffer({ [fields[0]]: `${salt1?.value}:${value1}` }).toString("hex"),
        toBuffer({ [fields[1]]: `${salt2?.value}:${value2}` }).toString("hex")
      ]);
      expect(decodeSalt(obfuscatedDocument.proof.salts)).not.toHaveProperty(fields[0]);
      expect(decodeSalt(obfuscatedDocument.proof.salts)).not.toHaveProperty(fields[1]);
      expect(obfuscatedDocument).not.toHaveProperty(fields[0]);
      expect(obfuscatedDocument).not.toHaveProperty(fields[1]);
    });

    test("removes values from nested object", async () => {
      const field = "oaProof.type";
      const newDocument = await wrapDocument(openAttestationData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, field);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      const salt = decodeSalt(newDocument.proof.salts).find(s => s.path === field);
      const value = get(newDocument, field);

      expect(obfuscatedDocument.proof.privacy.obfuscated).toEqual([
        toBuffer({ [field]: `${salt?.value}:${value}` }).toString("hex")
      ]);
      expect(decodeSalt(obfuscatedDocument.proof.salts)).not.toHaveProperty(field);
      expect(obfuscatedDocument).not.toHaveProperty(field);
    });

    test("removes values from arrays", async () => {
      const fields = ["@context[2]", "@context[3]"];
      const newDocument = await wrapDocument(openAttestationData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, fields);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);

      const salts = decodeSalt(newDocument.proof.salts);
      const salt1 = salts.find(s => s.path === fields[0]);
      const value1 = get(newDocument, fields[0]);
      const salt2 = salts.find(s => s.path === fields[1]);
      const value2 = get(newDocument, fields[1]);

      expect(obfuscatedDocument.proof.privacy.obfuscated).toEqual([
        toBuffer({ [fields[0]]: `${salt1?.value}:${value1}` }).toString("hex"),
        toBuffer({ [fields[1]]: `${salt2?.value}:${value2}` }).toString("hex")
      ]);
      expect(decodeSalt(obfuscatedDocument.proof.salts)).not.toHaveProperty(fields[0]);
      expect(decodeSalt(obfuscatedDocument.proof.salts)).not.toHaveProperty(fields[1]);
      expect(obfuscatedDocument).not.toHaveProperty("context", [
        "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld",
        "https://nebulis.github.io/tmp-jsonld/CustomContext.jsonld"
      ]);
    });

    test("is transitive", async () => {
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const intermediateDoc = obfuscateDocument(newDocument, "key1");
      const finalDoc1 = obfuscateDocument(intermediateDoc, "key2");
      const finalDoc2 = obfuscateDocument(newDocument, ["key1", "key2"]);

      expect(finalDoc1).toEqual(finalDoc2);
      expect(intermediateDoc).not.toHaveProperty("key1");
      expect(finalDoc1).not.toHaveProperty("key1");
      expect(finalDoc1).not.toHaveProperty("key2");
      expect(finalDoc2).not.toHaveProperty("key1");
      expect(finalDoc2).not.toHaveProperty("key2");
    });
  });
});
