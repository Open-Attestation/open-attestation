import { cloneDeep } from "lodash";
import { digestCredential } from "../digest";
import { SchemaId, SignatureAlgorithm } from "../..";
import { OpenAttestationVerifiableCredential } from "../../3.0/types";
import { obfuscateVerifiableCredential } from "../obfuscate";
import { decodeSalt } from "../salt";
import * as v3 from "../../__generated__/schema.3.0";
import { Method, ProofType, TemplateType } from "../../__generated__/schema.3.0";

const verifiableCredential: OpenAttestationVerifiableCredential = {
  version: SchemaId.v3,
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld"
  ],
  id: "http://example.edu/credentials/58473",
  type: ["VerifiableCredential", "AlumniCredential"],
  issuer: "https://example.edu/issuers/14",
  issuanceDate: "2010-01-01T19:23:24Z",
  credentialSubject: { id: "did:example:ebfeb1f712ebc6f1c276e12ec21", alumniOf: "Example University" },
  openAttestationMetadata: {
    template: {
      name: "EXAMPLE_RENDERER",
      type: TemplateType.EmbeddedRenderer,
      url: "https://renderer.openattestation.com/"
    },
    proof: {
      type: ProofType.OpenAttestationProofMethod,
      method: Method.DocumentStore,
      value: "0xED2E50434Ac3623bAD763a35213DAD79b43208E4"
    },
    identityProof: {
      location: "some.example",
      type: v3.IdentityProofType.DNSTxt
    }
  },
  proof: {
    type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
    targetHash: "32d04be80c1468d96905f0a5d8f4f285f8434710eeac20eec7d10febb3bfb6d5",
    proofs: [],
    merkleRoot: "32d04be80c1468d96905f0a5d8f4f285f8434710eeac20eec7d10febb3bfb6d5",
    salts:
      "W3sidmFsdWUiOiIzNmNiZjlkNy1jMWExLTQxZTItYjViMi05ZTBhY2U0NGE1YTkiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJkNTE3YmIzYy1kNGQ2LTRkOGMtOTgwNy02YzEwZjQ0NDliYjEiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiMjdmYTEwYzYtMWZmMy00MmYzLTg4YmItMTQyZjQ4YjI1YTVmIiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6ImU5ZjliMzhjLTRmNTItNDU2ZS04ZjcyLTI2YzM4M2Y4ZTI4NyIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiI2ZjJhOGYzMS1iNDg0LTQ1NmItYjVmMC1hM2RiYTkwMjIxYWYiLCJwYXRoIjoiaWQifSx7InZhbHVlIjoiY2I0ZDk3NTktYTdhNS00NzkxLWIwOTAtZGU1YzQzYzJkYmY5IiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiM2RhZDZmMjYtMzU3NS00NzQwLWJlMzgtYjgzNmQ4MjRlZjZiIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiNWRiYmRjYWYtYTRiYy00YTQ1LWFhNmQtZjI0M2U3OTY3OTdjIiwicGF0aCI6Imlzc3VlciJ9LHsidmFsdWUiOiIzNjZjN2E4Ni1kZGZlLTQ0ZTAtODNhMy1lMGE4YjEwMDRjMzgiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6IjFmZTAzNTExLWI4ZmQtNGI1OS1hZTA0LTJlYTYzNjQ5ZmVjMCIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiJkNWZmMWI5OC1jMzYzLTQ3YWUtYTc3MC1hNmIzOTlhZmIzMjAiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuYWx1bW5pT2YifSx7InZhbHVlIjoiNjcyNDA2YmItMDZhMS00MzdiLWE5MWEtODA1ZjkwNmY5MmJmIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLm5hbWUifSx7InZhbHVlIjoiN2FjODgyYjUtZGZmYy00M2JmLTk4YjItYjU3MjI3MzYyZmJiIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiNmJhMjliY2UtNDBkYi00NDkxLTlmNGYtMjNlNzlhNmFjYjRiIiwicGF0aCI6Im9wZW5BdHRlc3RhdGlvbk1ldGFkYXRhLnRlbXBsYXRlLnVybCJ9LHsidmFsdWUiOiJkNDZlNmI4Zi1lNTUyLTQ0ZWQtYjE1ZC03NTBkYzMzNTA5OTciLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YudHlwZSJ9LHsidmFsdWUiOiI2NzZlNTY4Zi03YzU3LTRhZDctOTUzNC1lNWEzNjE0ZGY4MDQiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEucHJvb2YubWV0aG9kIn0seyJ2YWx1ZSI6IjM4ODIzZDFiLTNiODEtNDdlNy1iM2VkLTQ2YjkyYWIzODgwOCIsInBhdGgiOiJvcGVuQXR0ZXN0YXRpb25NZXRhZGF0YS5wcm9vZi52YWx1ZSJ9LHsidmFsdWUiOiI1MWY3OGViYS01OGQ3LTQ2NzgtOWUwYy02YTAzNDJmZjNiMmQiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEuaWRlbnRpdHlQcm9vZi5sb2NhdGlvbiJ9LHsidmFsdWUiOiJmNGY5MmJiZC00ZWQ1LTRiOWUtYWU4ZS0xYTllODg3MTliZGMiLCJwYXRoIjoib3BlbkF0dGVzdGF0aW9uTWV0YWRhdGEuaWRlbnRpdHlQcm9vZi50eXBlIn1d",
    privacy: { obfuscated: [] }
  }
};
const { proof, ...credential } = verifiableCredential;

describe("digest v3.0", () => {
  describe("digestCredential", () => {
    test("digests a document with all visible content correctly", () => {
      const clonedCredential = cloneDeep(credential);

      // We shouldn't use create salts on every test here as it's non-deterministic
      const digest = digestCredential(clonedCredential, decodeSalt(proof.salts), []);
      const expectedDigest = "32d04be80c1468d96905f0a5d8f4f285f8434710eeac20eec7d10febb3bfb6d5";
      expect(digest).toEqual(expectedDigest);
    });
    test("digests a document when one single element is obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, "id");
      const expectedDigest = "32d04be80c1468d96905f0a5d8f4f285f8434710eeac20eec7d10febb3bfb6d5";
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        Array [
          "0897ad126cab4ee7e343d9ce2988f33c7b90671a492672c20efce806b3f4dc27",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(1);
      expect(digest).toBe(expectedDigest);
    });
    test("digests a document when multiple element are obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, [
        "id",
        "credentialSubject"
      ]);
      const expectedDigest = "32d04be80c1468d96905f0a5d8f4f285f8434710eeac20eec7d10febb3bfb6d5";
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        Array [
          "0897ad126cab4ee7e343d9ce2988f33c7b90671a492672c20efce806b3f4dc27",
          "6266d9b8d0b0a5c3019500ca9cf8bfeff74225e0cd5c3cf53c629ded0c8ce84f",
          "1a6c820d9623f67ec8895209b8d389fe37e26d206bd25dd6a2acc51dc740a072",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(3);
      expect(digest).toBe(expectedDigest);
    });
    test("digests a document with no visible content correctly", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, [
        "@context",
        "id",
        "type",
        "issuer",
        "issuanceType",
        "issuanceDate",
        "openAttestationMetadata",
        "version",
        "credentialSubject"
      ]);
      const expectedDigest = "32d04be80c1468d96905f0a5d8f4f285f8434710eeac20eec7d10febb3bfb6d5";
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential).toStrictEqual({ proof: obfuscatedVerifiableCredential.proof });
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        Array [
          "15e6067e4bd1ce6890facae15105756dfcb1ad2e1eee81eff453eb944a560104",
          "129a54d776ea60d42fe00e37724441f88028373b4140f8e2e9a94abdea8fba5c",
          "a5717263519b7012470c77f38cf17f19282393c4a1be069f9e49d7694d390b3b",
          "0897ad126cab4ee7e343d9ce2988f33c7b90671a492672c20efce806b3f4dc27",
          "04299fa7066fb5c12ede25735c0b5cfc39657e9f6039199c25cc1a9ef2902d25",
          "bc13a9fcbad47b7d8be8d45848ad85c4fc3d4ffbd5eead2f3e32edcf97bcbaec",
          "dd5bb9612cbafa96a4c90afe339d3103a0b2221bd2dfef6642bbe18c265999b3",
          "85088eb035ef3ed0e28105635cedc8fda14313746274ac3ff4c3457226a8ee88",
          "2e218b0c1ee732cc869709bbc8c6f6bb6af2fd64a1bd7eba365558d585ef2b3b",
          "359cae0078adea427157cb2f917ea72227b74381d514cf1c1d93e48d66a2970a",
          "a3523e932fae4b16ae8b60c15305c2b758697f6fa9b130a07fb1b36bf053e391",
          "e613fd087e7d1162eaef6ceedaf4ac6aca18f5d50a1f38d1aba804489011c84c",
          "afe75e53eaae60863ec0d8e3a0d41ad12b0d40d67e0c10c5078fe02514bd56d0",
          "da6cfe2973c3e6ec356c566bbe51ab1ab10fa19aa6f1aa83f4551ecb3f2352c7",
          "5f9268fb43fc9ba626aa3ab9a20907b941d6b2ccc0203c57f6cc2f0a82beb804",
          "88ca202ab0fcdd66a587767df47bdd369b6cafade97d3939c697281a6227f12d",
          "f1d5ec1675e7b680f8c5a474f84a8b68f40e97acb7291e76c3280c154db59e47",
          "6266d9b8d0b0a5c3019500ca9cf8bfeff74225e0cd5c3cf53c629ded0c8ce84f",
          "1a6c820d9623f67ec8895209b8d389fe37e26d206bd25dd6a2acc51dc740a072",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(19);
      expect(digest).toBe(expectedDigest);
    });
  });
});
