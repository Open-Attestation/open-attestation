import { genTargetHash } from "../hash";
import { decodeSalt } from "../salt";
import { SIGNED_WRAPPED_DOCUMENT_DID as ROOT_CREDENTIAL } from "../fixtures";
import { Signed } from "../types";
import { obfuscateOAVerifiableCredential } from "../obfuscate";

// All obfuscated documents are generated from the ROOT_CREDENTIAL
const ROOT_CREDENTIAL_TARGET_HASH = ROOT_CREDENTIAL.proof.targetHash;

describe("V4.0 hash", () => {
  test("given that obfuscated documents are generated from the ROOT_CREDENTIAL, ROOT_CREDENTIAL_TARGET_HASH should match snapshot", () => {
    expect(ROOT_CREDENTIAL_TARGET_HASH).toMatchInlineSnapshot(
      `"0b1f90bc8e87cfce8ec49cea60d406291ad130ddedc26e866a8c4f2152747abc"`
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

    const digest = genTargetHash(ROOT_CREDENTIAL, decodeSalt(ROOT_CREDENTIAL.proof.salts), []);
    expect(digest).toBe(ROOT_CREDENTIAL_TARGET_HASH);
  });

  test("given a document with ONE element obfuscated, should digest and match the root credential's target hash", () => {
    const OBFUSCATED_WRAPPED_DOCUMENT = obfuscateOAVerifiableCredential(ROOT_CREDENTIAL, "credentialSubject.id");
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
        "31744f7aac0af84e23e752611279933657ff78a9065330f8c5029ec5205979a3",
      ]
    `);

    const digest = genTargetHash(
      OBFUSCATED_WRAPPED_DOCUMENT,
      decodeSalt(OBFUSCATED_WRAPPED_DOCUMENT.proof.salts),
      OBFUSCATED_WRAPPED_DOCUMENT.proof.privacy.obfuscated
    );
    expect(digest).toBe(ROOT_CREDENTIAL_TARGET_HASH);
    expect(digest).toBe(OBFUSCATED_WRAPPED_DOCUMENT.proof.targetHash);
  });

  test("given a document with THREE elements obfuscated, should digest and match the root credential's target hash", () => {
    const OBFUSCATED_WRAPPED_DOCUMENT = obfuscateOAVerifiableCredential(ROOT_CREDENTIAL, [
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
        "31744f7aac0af84e23e752611279933657ff78a9065330f8c5029ec5205979a3",
        "f49443c7e5fcb9f20dad4463a5e0b2cb3e341c430d4792cb87cb11bce0efd9b0",
        "7f2ecdae29b49b3a971d5acdfbbf9225a193e735ce41b89b0d84cca801794fc9",
      ]
    `);

    const digest = genTargetHash(
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
        type: "OpenAttestationHashProof2018",
        proofPurpose: "assertionMethod",
        targetHash: "0b1f90bc8e87cfce8ec49cea60d406291ad130ddedc26e866a8c4f2152747abc",
        proofs: [],
        merkleRoot: "0b1f90bc8e87cfce8ec49cea60d406291ad130ddedc26e866a8c4f2152747abc",
        salts: "W10=",
        privacy: {
          obfuscated: [
            "fb3e116ab528a97d055822754f9ccd1ca5d2962a74d533cc34f066e65a93c76f",
            "fe5c8db00ea1f1b4cfcbc29d00810cd6e18f715b98d3660090ee30cf88b4375c",
            "27c33bf2f9e5ba4d94c017569174f1432f8887994bfaa70a50c0cf42e62e9f3e",
            "5094d0467785684f843648d3edbd1e370df296327796a13b18112e0941bbf14e",
            "a4723abfc6809faa72d62d44bb9a11d35e93a780c7a5cb69cdd3693c45960367",
            "62858cb5907188767134ec958c6cdfd17e44e52f1511e56b06670fe1b0588160",
            "f0250ff7053e849fda119078d5d5dd6689eb7751a74cab71aa11f92941d22aa9",
            "d1741f3c9b8bde24eea271870f8200c6c627a94739051d7b7a480e0aaff60bc0",
            "6da741164cefb41160b23388b3ee9b0944fab0bedd70b63e20cee0af3fabe565",
            "780e835a67653d28f0582d8fb3a1980709b178841fe4d1f6019be0f49db41ac3",
            "5c91f334f63f258e4ba299da14880019711538169512e5c6449fbfca7edd7110",
            "31744f7aac0af84e23e752611279933657ff78a9065330f8c5029ec5205979a3",
            "ab0957fe8747ac06749268e6398bd4cf67a8a22bf0e67eaacc030bcb5f11e3ed",
            "f49443c7e5fcb9f20dad4463a5e0b2cb3e341c430d4792cb87cb11bce0efd9b0",
            "0df8aa79b275612b491103b10804276364da6dc49f398faa7be2190de1d60cd2",
            "7f2ecdae29b49b3a971d5acdfbbf9225a193e735ce41b89b0d84cca801794fc9",
            "0eccbf844ac0b68bdd5de85894dce6ecb429f36f4e21630ff70d487a92b2e75f",
            "135c5417e9baec64bbe977f9244496aae4a452bf58177b4fd9064c8afdfe483a",
            "b8e8cc46e99c58420e5819ed9f80b90489b2db72f6eb94dc84d1f6a15a331030",
            "b5554487209f1b99fc73190a8f32e3b2087a6e310f3d05f7c8f7c1f488565b0c",
            "c38928d0bad7d71f6e2a7aa33b4983afbeaa9e3c990de6137385b30fc6d5a9ac",
            "856d307b40543221d78ba858c6438f4f3e773ab2a81f3140bdff8bc21e30b0d5",
            "2be8c866f23b27108c9f2d9acfc21bfef5f61124a2272eb3cee1e94cd79c68c0",
          ],
        },
        key: "did:ethr:0xB26B4941941C51a4885E5B7D3A1B861E54405f90#controller",
        signature:
          "0x949b76d8df493a56c1cf21303a74d6a54904461c1c10f4619b43ad7d339c64467c61eb4c0873f279cd21d5bdd044d3af5318f14d63f57acbd4cde30f271f3eb71c",
      },
    } as unknown as Signed;

    const digest = genTargetHash(
      OBFUSCATED_WRAPPED_DOCUMENT,
      decodeSalt(OBFUSCATED_WRAPPED_DOCUMENT.proof.salts),
      OBFUSCATED_WRAPPED_DOCUMENT.proof.privacy.obfuscated
    );
    expect(digest).toBe(ROOT_CREDENTIAL_TARGET_HASH);
  });
});
