import { digestCredential } from "../digest";
import { decodeSalt } from "../salt";
import { SIGNED_WRAPPED_DOCUMENT_DID as ROOT_CREDENTIAL } from "../fixtures";
import { V4SignedWrappedDocument } from "../types";
import { obfuscateVerifiableCredential } from "../obfuscate";

// All obfuscated documents are generated from the ROOT_CREDENTIAL
const ROOT_CREDENTIAL_TARGET_HASH = ROOT_CREDENTIAL.proof.targetHash;

describe("V4 digestCredential", () => {
  test("given all testobfuscated documents are generated from the ROOT_CREDENTIAL, ROOT_CREDENTIAL_TARGET_HASH should match snapshot", () => {
    expect(ROOT_CREDENTIAL_TARGET_HASH).toMatchInlineSnapshot(
      `"dd55a7d96d47e58350f2cfb03ebdf3f859684c9f97ba75eed55b1bdcc761c5aa"`
    );
  });

  test("given a document with ALL FIELDS VISIBLE, should digest and match the root credential's target hash", () => {
    expect(ROOT_CREDENTIAL.credentialSubject).toMatchInlineSnapshot(`
        {
          "id": "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
          "licenses": [
            {
              "class": "3",
              "description": "Motor cars with unladen weight <= 3000kg",
              "effectiveDate": "2013-05-16T00:00:00+08:00",
            },
            {
              "class": "3A",
              "description": "Motor cars with unladen weight <= 3000kg",
              "effectiveDate": "2013-05-16T00:00:00+08:00",
            },
          ],
          "name": "John Doe",
          "type": [
            "DriversLicense",
          ],
        }
      `);
    expect(ROOT_CREDENTIAL.proof.privacy.obfuscated).toMatchInlineSnapshot(`[]`);

    const digest = digestCredential(ROOT_CREDENTIAL, decodeSalt(ROOT_CREDENTIAL.proof.salts), []);
    expect(digest).toBe(ROOT_CREDENTIAL_TARGET_HASH);
  });

  test("given a document with ONE element obfuscated, should digest and match the root credential's target hash", () => {
    const OBFUSCATED_WRAPPED_DOCUMENT = obfuscateVerifiableCredential(ROOT_CREDENTIAL, "credentialSubject.id");
    expect(OBFUSCATED_WRAPPED_DOCUMENT.credentialSubject).toMatchInlineSnapshot(`
        {
          "licenses": [
            {
              "class": "3",
              "description": "Motor cars with unladen weight <= 3000kg",
              "effectiveDate": "2013-05-16T00:00:00+08:00",
            },
            {
              "class": "3A",
              "description": "Motor cars with unladen weight <= 3000kg",
              "effectiveDate": "2013-05-16T00:00:00+08:00",
            },
          ],
          "name": "John Doe",
          "type": [
            "DriversLicense",
          ],
        }
      `);
    expect(OBFUSCATED_WRAPPED_DOCUMENT.proof.privacy.obfuscated).toMatchInlineSnapshot(`
      [
        "410849f7c317307141d4cecd4d72fe7efb9655abaa0ee37374b2ec53a3588ee7",
      ]
    `);

    const digest = digestCredential(
      OBFUSCATED_WRAPPED_DOCUMENT,
      decodeSalt(OBFUSCATED_WRAPPED_DOCUMENT.proof.salts),
      OBFUSCATED_WRAPPED_DOCUMENT.proof.privacy.obfuscated
    );
    expect(digest).toBe(ROOT_CREDENTIAL_TARGET_HASH);
    expect(digest).toBe(OBFUSCATED_WRAPPED_DOCUMENT.proof.targetHash);
  });

  test("given a document with THREE elements obfuscated, should digest and match the root credential's target hash", () => {
    const OBFUSCATED_WRAPPED_DOCUMENT = obfuscateVerifiableCredential(ROOT_CREDENTIAL, [
      "credentialSubject.id",
      "credentialSubject.name",
      "credentialSubject.licenses[0].description",
    ]);
    expect(OBFUSCATED_WRAPPED_DOCUMENT.credentialSubject).toMatchInlineSnapshot(`
        {
          "licenses": [
            {
              "class": "3",
              "effectiveDate": "2013-05-16T00:00:00+08:00",
            },
            {
              "class": "3A",
              "description": "Motor cars with unladen weight <= 3000kg",
              "effectiveDate": "2013-05-16T00:00:00+08:00",
            },
          ],
          "type": [
            "DriversLicense",
          ],
        }
      `);
    expect(OBFUSCATED_WRAPPED_DOCUMENT.proof.privacy.obfuscated).toMatchInlineSnapshot(`
      [
        "410849f7c317307141d4cecd4d72fe7efb9655abaa0ee37374b2ec53a3588ee7",
        "21f8a6f2f464ff14afbc52e4dcb965d7891a7c63fd37eb93f8f98477dcdfc7f9",
        "228eb6b469ca3a475238455f11125b7edc826c6dc3ae727d023d1eb71d0e60d6",
      ]
    `);

    const digest = digestCredential(
      OBFUSCATED_WRAPPED_DOCUMENT,
      decodeSalt(OBFUSCATED_WRAPPED_DOCUMENT.proof.salts),
      OBFUSCATED_WRAPPED_DOCUMENT.proof.privacy.obfuscated
    );
    expect(digest).toBe(ROOT_CREDENTIAL_TARGET_HASH);
    expect(digest).toBe(OBFUSCATED_WRAPPED_DOCUMENT.proof.targetHash);
  });

  test("given a document with NO VISIBLE FIELDS, should digest and match the root credential's target hash", () => {
    // this has to be manually generated, since obfuscateVerifiableCredential does not allow obfuscating fields that
    // result in a non compliant V4 OA document
    const OBFUSCATED_WRAPPED_DOCUMENT = {
      // no visible fields
      proof: {
        type: "OpenAttestationMerkleProofSignature2018",
        proofPurpose: "assertionMethod",
        targetHash: "dd55a7d96d47e58350f2cfb03ebdf3f859684c9f97ba75eed55b1bdcc761c5aa",
        proofs: [],
        merkleRoot: "dd55a7d96d47e58350f2cfb03ebdf3f859684c9f97ba75eed55b1bdcc761c5aa",
        salts: "W10=",
        privacy: {
          obfuscated: [
            "0fd4ac5ade244ee2fe47437ea43cd142479540b878fffc86662600fce4d47ef5",
            "0cc6e4c50bb090af720d224a9bd73be4c0d72831fc701907339693cdcb34ede3",
            "d2afadbec39872577eae0d5e4ea3b590608cab744f214a2f703f65a5b41683cb",
            "569b596d71fb145e9c87be1b301da3cbc89cfc104627f6dd95c8123f7974e9c6",
            "5dee7aa2b48b9a5edae5042459c7c3eeaa8c5b13132b1477641c727a89471b36",
            "2a1ff14be659821afa68edc245f67b9e25331b450715b41348ed2405334d5abd",
            "0f1d172b5352464121dffc550e16f64b8019637e39768c506fd2e517a0da305d",
            "ff4eeed1d7bb70aef646d46dc75b3408cf019e0daeaf2ef0313974690d8beef2",
            "2a4e9fd43be0221af2f02a6b959edf704b630559268a0b2a657fe046e282fbb8",
            "bbdf2b05cc0bd2a64fc3483211806e2f863bea05fba81f63092ec07c4ee8ebd9",
            "bd9acf6bef05f94720f0fa9c5540bb9db7d6370c39e2bbbee31e408842985dae",
            "410849f7c317307141d4cecd4d72fe7efb9655abaa0ee37374b2ec53a3588ee7",
            "32a55f464387e37df8f74cf3de6a8e04626e19c2f4d5ec8931aee4b866329fb8",
            "21f8a6f2f464ff14afbc52e4dcb965d7891a7c63fd37eb93f8f98477dcdfc7f9",
            "6bc7b2350b59b02a44d2593ee7538590114544bc3a39fe9564ee49b387c883c4",
            "228eb6b469ca3a475238455f11125b7edc826c6dc3ae727d023d1eb71d0e60d6",
            "d6e7027dd62b265e83aaf306f095446efab2677e940a0fbb118cc91dd8226fdb",
            "da26ce90128b1cfd747218cad4c7e86b83f6ab236598ce18aecc3b10426b1b71",
            "5edea35aa869577c2fd14159534b08da061a7833665cf1cc28f400474c26be01",
            "d55b72f926f7adaa5ea4f271ffc2f574e4859b05c16042f5b604e52f044a11d0",
            "dd69de699de90b82cfb658fc304ae4f3131e841d56fd68eb20e17af73613a4d3",
            "280bc622006d5ec28a42096b57f15f8238df27762c3f754d56dcd89f3aa02c25",
            "3d8bc5cbcd2826489cdc80a64d586a4d220d975bc2848aa535bd1e4f17dc619f",
          ],
        },
        key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        signature:
          "0xa3ac9f73a7314c0aad47bad875921f5c88d2af9440d6c309fc2f93dbf43bd8235e84b744cb1ff1c09c214b559ce3bd6eb148c2f68c677cb8408d96e9b5411dfb1c",
      },
    } as unknown as V4SignedWrappedDocument;

    const digest = digestCredential(
      OBFUSCATED_WRAPPED_DOCUMENT,
      decodeSalt(OBFUSCATED_WRAPPED_DOCUMENT.proof.salts),
      OBFUSCATED_WRAPPED_DOCUMENT.proof.privacy.obfuscated
    );
    expect(digest).toBe(ROOT_CREDENTIAL_TARGET_HASH);
  });
});
