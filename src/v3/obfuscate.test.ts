import { obfuscateDocument } from "./obfuscate";
import { OpenAttestationCredentialWithInnerIssuer, validateSchema, verifySignature, wrapDocument } from "../";

import { SchemaId } from "../shared/@types/document";
// import {
//   IdentityType,
//   Method,
//   OpenAttestationDocument,
//   ProofType,
//   TemplateType
// } from "../../src/__generated__/schemaV3";
import { IdentityProofType, Method, OaProofType, TemplateType } from "../../src/__generated__/schemaV3";

const openAttestationData: OpenAttestationCredentialWithInnerIssuer = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld",
    "https://nebulis.github.io/tmp-jsonld/CustomContext.jsonld"
  ],
  reference: "document identifier",
  validFrom: "2010-01-01T19:23:24Z",
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
    type: OaProofType.OpenAttestationSignature2018,
    value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
    method: Method.TokenRegistry
  }
};

describe("privacy", () => {
  describe("obfuscateData", () => {
    test("removes one field", async () => {
      const testData = {
        key1: "value1",
        key2: "value2",
        ...openAttestationData
      };
      const field = "key1";
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, field);
      const verified = verifySignature(obfuscatedDocument);
      console.log(obfuscatedDocument);

      console.log(obfuscatedDocument.proof.privacy.obfuscated);
      expect(verified).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
      expect(obfuscatedDocument).not.toHaveProperty(field);
    });

    test("removes multiple fields", async () => {
      const testData = {
        key1: "value1",
        key2: "value2",
        ...openAttestationData
      };
      const fields = ["key1", "key2"];
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, fields);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
      expect(obfuscatedDocument).not.toHaveProperty(fields);
    });

    test("removes values from nested object", async () => {
      const testData = {
        ...openAttestationData
      };
      const fields = ["issuer.name"];
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const obfuscatedDocument = await obfuscateDocument(newDocument, fields);
      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);
      console.log(obfuscatedDocument);
      expect(obfuscatedDocument).not.toHaveProperty("issuer.name");
    });
  });

  describe("obfuscateDocument", () => {
    test("is transitive", async () => {
      const testData = {
        key1: "value1",
        key2: "value2",
        ...openAttestationData
      };
      const newDocument = await wrapDocument(testData, { version: SchemaId.v3 });
      const intermediateDoc2 = obfuscateDocument(newDocument, "key1");
      const finalDoc1 = obfuscateDocument(intermediateDoc2, "key2");
      const finalDoc2 = obfuscateDocument(newDocument, ["key1", "key2"]);
      expect(finalDoc1).toEqual(finalDoc2);
    });
  });

  // describe("getData", () => {
  //   test("returns original data given salted content and, optionally, salt length", () => {
  //     const document: WrappedDocument = {
  //       version: SchemaId.v2,
  //       schema: "http://example.com/schema.json",
  //       signature: {
  //         type: "SHA3MerkleProof",
  //         targetHash: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54",
  //         proof: [],
  //         merkleRoot: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54"
  //       },
  //       privacy: {
  //         obfuscatedData: ["674afcc934fede83cbfef6361de969d520ec3f8aebacbc984b8d39b11dbdcd38"]
  //       },
  //       data: {
  //         key1: "f9ec69be-ab21-474d-b8d7-012424813dc3:string:value1",
  //         key2: {
  //           key21: "181e6794-45e4-4ecd-ac45-4c2aed0d757f:boolean:true"
  //         }
  //       }
  //     };
  //     const data = getData(document);
  //     expect(data).toEqual({
  //       key1: "value1",
  //       key2: {
  //         key21: true
  //       }
  //     });
  //   });
  // });
});
