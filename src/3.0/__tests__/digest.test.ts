import { cloneDeep } from "lodash";
import { digestCredential } from "../digest";
import { OpenAttestationVerifiableCredential, SchemaId, SignatureAlgorithm } from "../..";
import { obfuscateVerifiableCredential } from "../obfuscate";
import { decodeSalt } from "../salt";
import { Method, OaProofType, TemplateType } from "../../__generated__/schema.3.0";

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
  template: {
    name: "EXAMPLE_RENDERER",
    type: TemplateType.EmbeddedRenderer,
    url: "https://renderer.openattestation.com/"
  },
  oaProof: {
    type: OaProofType.OpenAttestationProofMethod,
    method: Method.DocumentStore,
    value: "0xED2E50434Ac3623bAD763a35213DAD79b43208E4"
  },
  proof: {
    type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
    targetHash: "b2af70b24dfdc606b684ef3a0172fe3667d248fbc5eaa0e005e9b5b34eab05b0",
    proofs: [],
    merkleRoot: "b2af70b24dfdc606b684ef3a0172fe3667d248fbc5eaa0e005e9b5b34eab05b0",
    salts:
      "W3sidmFsdWUiOiIxZGY3Mzg2Mi1mZThhLTQ1OTktOTA0OC1jZGQ5NTc1Yzc0ZDAiLCJwYXRoIjoidmVyc2lvbiJ9LHsidmFsdWUiOiJjY2I3ZGVhNi04NmE0LTQ5ZjMtOWI5ZC1iM2FiOTA1NTQyZmUiLCJwYXRoIjoiQGNvbnRleHRbMF0ifSx7InZhbHVlIjoiZTAwYzU0NzEtYWEzYS00MTk0LTgwZTMtNmEyOWFjNWUwOGE5IiwicGF0aCI6IkBjb250ZXh0WzFdIn0seyJ2YWx1ZSI6ImQ5MzZmMjc3LTRhYzItNGRlZS1hOTlkLTMzMThmNjlhOWNmYSIsInBhdGgiOiJAY29udGV4dFsyXSJ9LHsidmFsdWUiOiIzNzdkMWJmZS00NDEwLTQyZmQtYmI2ZS02NGFhMzBlOTNhNzciLCJwYXRoIjoiaWQifSx7InZhbHVlIjoiZDc0Mzc5OGMtNDI3OS00MjkzLWIyZDItNjgxN2MzMTI1NjU4IiwicGF0aCI6InR5cGVbMF0ifSx7InZhbHVlIjoiNWM5MDkzYjktZTU2NC00M2RhLThjMzEtM2ZkZDAwOTY5NmJmIiwicGF0aCI6InR5cGVbMV0ifSx7InZhbHVlIjoiNjk5Mjg4ZWEtMzE2My00ZjFkLTgyMGEtZDhmYTRiNDNmNmI3IiwicGF0aCI6Imlzc3VlciJ9LHsidmFsdWUiOiJhYTBmNDMyNS1lMDJiLTQzOTktOGY1ZC1kZDcyNTFlMzAxNjAiLCJwYXRoIjoiaXNzdWFuY2VEYXRlIn0seyJ2YWx1ZSI6ImExZGRhYzQ1LWE1ODAtNDg3ZC1hNGRlLWQ1Njk0MmQyMmZlZSIsInBhdGgiOiJjcmVkZW50aWFsU3ViamVjdC5pZCJ9LHsidmFsdWUiOiI3NWYyZWZiNi1lMzc5LTQwODAtYjBhYy01ODI0OTU0NmM2ZjQiLCJwYXRoIjoiY3JlZGVudGlhbFN1YmplY3QuYWx1bW5pT2YifSx7InZhbHVlIjoiYjE2M2NlMGMtY2I3Zi00ODQzLTk4NGMtZmRjYmVjZDRkMWFmIiwicGF0aCI6InRlbXBsYXRlLm5hbWUifSx7InZhbHVlIjoiNGYwYjI1NzMtOThhYS00NzU1LWFmNzEtODc0OWYwZTlkMzM1IiwicGF0aCI6InRlbXBsYXRlLnR5cGUifSx7InZhbHVlIjoiOGVkNTliNTEtZGQ0YS00ZmUxLWJlMWItY2UzZmQ2OTg4OTk0IiwicGF0aCI6InRlbXBsYXRlLnVybCJ9LHsidmFsdWUiOiJmMDMwZWNhNC0xZDY0LTQ5MmUtODBlMi0yNTg2MzA1NjY5NTUiLCJwYXRoIjoib2FQcm9vZi50eXBlIn0seyJ2YWx1ZSI6ImQxMmZhN2QwLTMzYWYtNDQ4OS05OTBiLWI0N2ZkMDA3MGEzOCIsInBhdGgiOiJvYVByb29mLm1ldGhvZCJ9LHsidmFsdWUiOiJiYWVlYzA1ZS00MDRjLTRjN2EtODNhOC0zNGRiNjRmOWMzN2MiLCJwYXRoIjoib2FQcm9vZi52YWx1ZSJ9XQ==",
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
      const expectedDigest = "b2af70b24dfdc606b684ef3a0172fe3667d248fbc5eaa0e005e9b5b34eab05b0";
      expect(digest).toEqual(expectedDigest);
    });
    test("digests a document when one single element is obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, "id");
      const expectedDigest = "b2af70b24dfdc606b684ef3a0172fe3667d248fbc5eaa0e005e9b5b34eab05b0";
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toStrictEqual([
        "e1203acd5f6684e39edb4ed6bfce328eef5f58f3ce512b2b83d29e0f6a5bbec1"
      ]);
      expect(digest).toBe(expectedDigest);
    });
    test("digests a document when multiple element are obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, [
        "id",
        "credentialSubject"
      ]);
      const expectedDigest = "b2af70b24dfdc606b684ef3a0172fe3667d248fbc5eaa0e005e9b5b34eab05b0";
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toStrictEqual([
        "e1203acd5f6684e39edb4ed6bfce328eef5f58f3ce512b2b83d29e0f6a5bbec1",
        "61897ece9882ce1122a2eb85e78c5a3a88bff3051d8a36dc027b525eb97b3117",
        "18fc30f39421cc73a8609eaaa2d9ca37e8fcd843935628e09ee297013ac91f53"
      ]);
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
        "oaProof",
        "template",
        "version",
        "credentialSubject"
      ]);
      const expectedDigest = "b2af70b24dfdc606b684ef3a0172fe3667d248fbc5eaa0e005e9b5b34eab05b0";
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential).toStrictEqual({ proof: obfuscatedVerifiableCredential.proof });
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toStrictEqual([
        "6ed4bc6f9e72f786eb39801705c6e47c85e8549446a557a4629f903efadb3a1a",
        "528803cbd11d138b0ebf2ad620d2e896599d2f24a6c6b01ad4f25039f0a31c56",
        "006b004642ecf3655cd891670f9ec6f3134bfa8185ad6a0db14c288ba9d73cb8",
        "e1203acd5f6684e39edb4ed6bfce328eef5f58f3ce512b2b83d29e0f6a5bbec1",
        "d8a93724571dcfe1096cea55fb5ea3635fe524c2e81d88e3240dc8adefc79cb3",
        "4cc1dc4f609eb6fb3ff6f4cb7e50ad90e96d8179b191c6a69ba05acbb5f58d78",
        "e495cba3a8a2d1bea9eb2eda8d54bde01df106d97694ebb7e7cbaca5163ee597",
        "b2669a826225aaa9874059c026a7322900c3b9c688c32cdfc9a6638c45fa8a7c",
        "dde74aef69caf1861a9dc04317847281e773755bd342f4a4521b2d418c472403",
        "24fa8fe435cba3e9f4dd9faf3c84dddc754fa3816a0b7fcb9a86cbdf000adafd",
        "86fc0241020eb22d4742df404b0233051db7a377ce2b18cfc0835bffee5dc6ca",
        "b05200a3a6e5938a17ab247c78af65f1ee076ddb240faa3537e7c73b582a2395",
        "f452aee55cbcebcf79f38ecdb4fef976c19399019501d2b2424dd7ab768a7cf0",
        "6d1011fa421a1e960624aee38f26b7ab3a78e6228cb2001873e1fad89dfc5aa8",
        "de584c02a4ab26b635d3026dc763a4f4bacb968c0c4828344adda4fe8fb53e05",
        "61897ece9882ce1122a2eb85e78c5a3a88bff3051d8a36dc027b525eb97b3117",
        "18fc30f39421cc73a8609eaaa2d9ca37e8fcd843935628e09ee297013ac91f53"
      ]);
      expect(digest).toBe(expectedDigest);
    });
  });
});
