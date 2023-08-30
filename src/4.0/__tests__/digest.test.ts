import { cloneDeep } from "lodash";
import { digestCredential } from "../digest";
import { WrappedDocument } from "../../4.0/types";
import { obfuscateVerifiableCredential } from "../obfuscate";
import { decodeSalt } from "../salt";
import sample from "../../../test/fixtures/v4/did-wrapped.json";

const verifiableCredential = sample as WrappedDocument;
// Digest will change whenever sample document is regenerated
const credentialRoot = "98d0979858c8d96c11373462b84e485863c7cec7a3c6b81f80c2673144839d48";

const { proof, ...credential } = verifiableCredential;

describe("digest v4.0", () => {
  describe("digestCredential", () => {
    test("digests a document with all visible content correctly", () => {
      const clonedCredential = cloneDeep(credential);

      const digest = digestCredential(clonedCredential, decodeSalt(proof.salts), []);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document when one single element is obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, "issuer.id");
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        [
          "83151d9c1f36da1f39e2adb42affefd66ee40c834d38f5a89b240db9e30ccf04",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(1);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document when multiple element are obfuscated", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(verifiableCredential, [
        "credentialSubject.id",
        "credentialSubject.name",
        "credentialSubject.licenses.0.description",
      ]);
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        [
          "b3acf9662d89be51e61794d73e4d5c355afd474f1c08d0227929404990bd3fd4",
          "3a58e681d26494a01f00d7679c2a7eb725a329dbf4990521cd231714cb986f32",
          "5d415abceac2bbf21b2ee03e8b6fb56a08bcce65045919ce2e56f77eb9a295fc",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(3);
      expect(digest).toBe(credentialRoot);
    });
    test("digests a document with no visible content correctly", () => {
      const obfuscatedVerifiableCredential = obfuscateVerifiableCredential(
        verifiableCredential,
        Object.keys(verifiableCredential).filter((k) => k != "proof")
      );
      const digest = digestCredential(
        obfuscatedVerifiableCredential,
        decodeSalt(obfuscatedVerifiableCredential.proof.salts),
        obfuscatedVerifiableCredential.proof.privacy.obfuscated
      );

      expect(obfuscatedVerifiableCredential).toStrictEqual({ proof: obfuscatedVerifiableCredential.proof });
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toMatchInlineSnapshot(`
        [
          "6bb0814c2d4da2b6e65bd7f309b137820f75a72309d4433b6a65654ca25eb9e4",
          "3fe0b259f06f8db4c24f714869ff9b8a461c30db543865102fd9e21f9480e1ff",
          "d1564ddab477b0f4038842b0c0f2ebde03bfcbc80c935297287097f78c299598",
          "6d325245e343a13f578fb106fdea79ff5b468867ce40f0f9a55aefa156d0a566",
          "b1fbc543d5346c308483db1178eac169a002a77bcbac3fa2e4166f0576759cfe",
          "f4e63f855e703e4ecb4eb7b385df05aaf4805c323697393631cf83c62a7f585e",
          "5d7cd395ad239a9bc58172c25d1b60de505c4e6c2db3a4ebbf6ee9b065e99112",
          "83151d9c1f36da1f39e2adb42affefd66ee40c834d38f5a89b240db9e30ccf04",
          "0d168dc997ced57b338b09d8ca9c00cbe20cb91b2da9489c372e18570b26ac2c",
          "111f2faaf43644cc53378c107ea939aa7de5a6d0c34bc910f763ae0645e02ffb",
          "ffa0c76626b3961350bdd18aabc98058e50b3d6ae4db0b741839f2e405e32a75",
          "083fce57e36ad296344603de334a83d326f128b97f9f55c776140f91f6735eb0",
          "91deffeed39119cee5200e10401623b54caf972e77efcf8efb93d9fbe6f47222",
          "9ae8b2ce6231b2eb9b28ad811eaafb0844560d9639d95382ae030fc0d91ca649",
          "7288a389668a20ebab0ea701d36d4a1f5dc125e996b875713705d673f3f7e30a",
          "1d46cb9bdffab2643ce2bc0485027e78e825813453a08dba451b46442b9452ff",
          "cbd3bb27af0714e508b8d83d3ab35e450e182a4815e9f8b93d6cb5b2a9c2676b",
          "1ffd2bfe8cab5ca7a991a2d55503d33d32fb04e86bd3aee11a11a723fff6b211",
          "a8885080f61fcfcd511c6ce3d539f945c3b7b211fe69f9e2b0408b835b74f6b7",
          "b3acf9662d89be51e61794d73e4d5c355afd474f1c08d0227929404990bd3fd4",
          "1a819a3039cfbf30870cf68ca567691d37437a5356a14355d2936bfddc8e07f9",
          "3a58e681d26494a01f00d7679c2a7eb725a329dbf4990521cd231714cb986f32",
          "d56b1b93f20c0d204cc609ad0726363ee520da7ee3f0446f304f9fce2c1fbaa8",
          "5d415abceac2bbf21b2ee03e8b6fb56a08bcce65045919ce2e56f77eb9a295fc",
          "04d91d673245a38bdf50638fb34905d859eb13aa21c169c90742d3900d1a58a6",
          "df89e72363a326993ff64894e824997e9cb0174d8309643a712448433556be5c",
          "51e397c49c274a6e06ecbabf4572b4b932f894c093e67116109286a2c7e88b97",
          "162930f89edeedec8502c642246771e3d03c61c9cb172ea7f85addce7a065372",
        ]
      `);
      expect(obfuscatedVerifiableCredential.proof.privacy.obfuscated).toHaveLength(28);
      expect(digest).toBe(credentialRoot);
    });
  });
});
