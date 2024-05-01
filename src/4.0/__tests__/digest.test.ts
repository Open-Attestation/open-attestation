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
      `"4b178a75faf7d7ecff1341ee1e0907810df23c88a217b814eb12c2a4454631ec"`
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
        "5f13a0a8b4e3bd8030bc8b8bd9e30af7f71a2b113e8c67232ddd47f6beffab34",
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
        "5f13a0a8b4e3bd8030bc8b8bd9e30af7f71a2b113e8c67232ddd47f6beffab34",
        "236baa019d96f812bf333c8ed2599823f5c796471860538c4e526edae6c88b2c",
        "0394c26c5be1bde929bf5aec2e076fc6843ace379be541c30707dab467baa59f",
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
        targetHash: "4b178a75faf7d7ecff1341ee1e0907810df23c88a217b814eb12c2a4454631ec",
        proofs: [],
        merkleRoot: "4b178a75faf7d7ecff1341ee1e0907810df23c88a217b814eb12c2a4454631ec",
        salts: "W10=",
        privacy: {
          obfuscated: [
            "ba719e50b3af802c74e306f028009c7e4726d29ecd03cd05668fb82eafef34d9",
            "45648522f4477a017a60d7131fc191fc1dc49e4de7e67e3e42f04e31f964357a",
            "b05fa7c260585b3a73eb3f64610a8ae1a282902d7ef36817bf798aa2e9f25dc5",
            "b03c7f68ee230f53a8e0a06f5f5c2ca1b2195b97425ae63623cfc84b50730163",
            "bd5e40059db1699bb49d5cf07d306d558ebd241d48f6f83d05ccd2a22acc2387",
            "47b25ce748576c172fe6268c8de2916e08ea23fe56bea155c2eb97c787c37b0b",
            "0231e0eeaf917998c5d7834172e99add661c91a71ea3ce81d4f10bb7d196337f",
            "b2d480de30ca619feae838cb859178476e571fb5cbce50eaa0f9f19ea3d0404f",
            "0e4344b5675a18e80c32c683362f99a47aa1e815a6ae495f3696e89b83b4a4bb",
            "7e1c13f6b1ef867b6e75810ab6629fab33f2cd895212b1231c354496b50b355a",
            "cb0800c5926b75dc379c73c1d6d92d459f9adacd1ebffd8ea8165248d55a2485",
            "5f13a0a8b4e3bd8030bc8b8bd9e30af7f71a2b113e8c67232ddd47f6beffab34",
            "668e8bc4e2fd13809dd8c815d8c26819794b28a334a2a6d4dc0564e306cbdde8",
            "236baa019d96f812bf333c8ed2599823f5c796471860538c4e526edae6c88b2c",
            "110cf75ee55d9e5d7db95becf4fb6d4162cdb8223d83d097b5f47fc1e3e7d378",
            "0394c26c5be1bde929bf5aec2e076fc6843ace379be541c30707dab467baa59f",
            "b9d3f903419f585d7f174802496aeeef1e15d9cac513da074026c8b186314a14",
            "18c6ebe5e22f6c9a272a8bbec47f261d1c5eff5599eaf47885e0c43b6dd24149",
            "ad93c39a9559065c4e133a9fbd26f557fc0c8bed74982162187148d093b03a92",
            "02a9da9a4199f9e6f6e2f4205b76a456d954e0835914c69dcb8479b2dc8d1ab0",
            "ea083928953e5f9901c58f4cb0c367a2f4ab4b67fbba46b77fa76502512c1493",
            "c9687c9bfffa291fee284c2d208b6fb983473e46513ed490c99ec4c5fc6cf194",
            "f3e68c691c2fc1a3453c7584a4faf51eda264decd0e469e1807d5055d02e26f8",
          ],
        },
        key: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
        signature:
          "0x1744f9615fa8d725cf4ae14f2654762dd8e0ee88a9b6d8af13cec688019a7a501e9bae10fa407fdbe359977f8124a26a0061a0ef0ea212c42fd1d91e0998928d1c",
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
