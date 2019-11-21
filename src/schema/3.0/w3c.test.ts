import wrappedDocument from "./wrapped-sample-document.json";
import { __unsafe__mapToW3cVc as mapToW3cVc } from "./w3c";
import { WrappedDocument } from "../../@types/document";

describe("it should be correct", () => {
  it("should really be correct", () => {
    expect(mapToW3cVc(wrappedDocument as WrappedDocument)).toStrictEqual({
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential"],
      credentialSubject: {
        name: "Singapore Driving Licence",
        recipient: {
          name: "Recipient Name"
        },
        reference: "SERIAL_NUMBER_123",
        unknownKey: "unknownValue",
        template: {
          name: "CUSTOM_TEMPLATE",
          type: "EMBEDDED_RENDERER",
          url: "https://localhost:3000/renderer"
        }
      },
      validFrom: "2010-01-01T19:23:24Z",
      validUntil: undefined,
      issuer: {
        id: "https://example.com",
        name: "DEMO STORE"
      },
      evidence: [
        {
          type: "DocumentVerification2018",
          data: "BASE64_ENCODED_FILE",
          filename: "sample.pdf",
          mimeType: "application/pdf"
        }
      ],
      proof: {
        method: "DOCUMENT_STORE",
        type: "OpenAttestationSignature2018",
        value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
        identityProof: {
          location: "tradetrust.io",
          type: "DNS-TXT"
        },
        signature: {
          merkleRoot: "a6ec0d8e649108377ace82fa06598131bcad343b49a5f05286d195365ead9f02",
          proof: [],
          targetHash: "a6ec0d8e649108377ace82fa06598131bcad343b49a5f05286d195365ead9f02",
          type: "SHA3MerkleProof"
        },
        salts: [
          { type: "string", value: "50152a6f-5a64-4b19-9857-ad45bd2be60f", path: "reference" },
          { type: "string", value: "e4aed1f1-928d-4664-a926-088ff975349f", path: "name" },
          { type: "string", value: "2f4f7bdb-d2f9-42d1-8437-ff841cf97c81", path: "validFrom" },
          { type: "string", value: "2356a363-a63b-414a-960d-c0a95c7d6ce6", path: "template.name" },
          { type: "string", value: "686e556f-a2c6-4458-a40c-8bf99ff83307", path: "template.type" },
          { type: "string", value: "98cf315f-45d9-479d-be41-345aa4e509ab", path: "template.url" },
          { type: "string", value: "023f2304-3d9c-46d3-a5a2-86baae661ac5", path: "issuer.id" },
          { type: "string", value: "cabb23f2-393d-4740-b9eb-1f7d431a7a5e", path: "issuer.name" },
          { type: "string", value: "60b30202-b3f3-4efd-a462-90414567b76d", path: "issuer.identityProof.type" },
          { type: "string", value: "928b5286-75a7-4882-a42c-530f9a8ccd41", path: "issuer.identityProof.location" },
          { type: "string", value: "dbd607cc-f88c-47d5-99df-0c679428a611", path: "proof.type" },
          { type: "string", value: "0d0150da-fc0e-467a-bf21-128924c2a3e8", path: "proof.method" },
          { type: "string", value: "8a194d55-da32-433d-bbbc-9674eea258e6", path: "proof.value" },
          { type: "string", value: "07ca6916-f2d4-4e66-b6e3-eb892936eb1f", path: "recipient.name" },
          { type: "string", value: "749159d5-b600-420c-86b7-885a93647671", path: "unknownKey" },
          { type: "string", value: "47e067d6-8792-4584-bce8-c939b417761e", path: "attachments[0].type" },
          { type: "string", value: "a03de0f7-7e7b-4004-845a-5698575584de", path: "attachments[0].filename" },
          { type: "string", value: "6a1e986a-3fdb-4609-9e75-526cb5378604", path: "attachments[0].mimeType" },
          { type: "string", value: "622d9030-aa0c-4065-8baf-445f01401246", path: "attachments[0].data" }
        ]
      }
    });
  });
});
