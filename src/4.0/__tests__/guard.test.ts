import { SUPPORTED_SIGNING_ALGORITHM } from "../../shared/@types/sign";
import { RAW_VC_DID } from "../fixtures";
import { digestVc } from "../digest";
import { signVc } from "../sign";
import {
  W3cVerifiableCredential,
  OAVerifiableCredential,
  OADigestedOAVerifiableCredential,
  OASignedOAVerifiableCredential,
  OADigested,
  OASigned,
  OADigestedW3cVerifiableCredential,
  OASignedW3cVerifiableCredential,
} from "../types";

const RAW_VC = {
  ...RAW_VC_DID,
  credentialSubject: {
    ...RAW_VC_DID.credentialSubject,
    attachments: [
      {
        mimeType: "image/png",
        filename: "aaa",
        data: "abcd",
      },
    ],
  },
} satisfies OAVerifiableCredential;

describe("V4.0 guard", () => {
  let DIGESTED_VC: OADigested;
  let SIGNED_VC: OASigned;
  beforeAll(async () => {
    DIGESTED_VC = await digestVc(RAW_VC);
    SIGNED_VC = await signVc(RAW_VC, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, {
      public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller",
      private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
    });
  });

  describe("given a raw VC", () => {
    test("should pass W3C VC validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = RAW_VC_DID;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(RAW_VC_DID);
    });

    test("should pass VC validation without removal of any data", () => {
      const results = OAVerifiableCredential.parse(RAW_VC_DID);
      expect(results).toEqual(RAW_VC_DID);
    });

    test("should fail digested VC validation", () => {
      const results = OADigestedOAVerifiableCredential.safeParse(RAW_VC_DID);
      expect(results.success).toBe(false);
      expect((results as { error: unknown }).error).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_union",
            "unionErrors": [
              {
                "issues": [
                  {
                    "code": "invalid_type",
                    "expected": "object",
                    "received": "undefined",
                    "path": [
                      "proof"
                    ],
                    "message": "Required"
                  }
                ],
                "name": "ZodError"
              },
              {
                "issues": [
                  {
                    "code": "invalid_type",
                    "expected": "object",
                    "received": "undefined",
                    "path": [
                      "proof"
                    ],
                    "message": "Required"
                  }
                ],
                "name": "ZodError"
              }
            ],
            "path": [
              "proof"
            ],
            "message": "Invalid input"
          }
        ]]
      `);
    });

    test("should fail signed VC validation", () => {
      const results = OASignedOAVerifiableCredential.safeParse(RAW_VC_DID);
      expect(results.success).toBe(false);
      expect((results as { error: unknown }).error).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_type",
            "expected": "object",
            "received": "undefined",
            "path": [
              "proof"
            ],
            "message": "Required"
          }
        ]]
      `);
    });
  });

  describe("given a digested VC", () => {
    test("should pass W3C VC validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = DIGESTED_VC;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(DIGESTED_VC);
    });

    test("should pass VC validation without removal of any data", () => {
      const oaVc: OAVerifiableCredential = DIGESTED_VC;
      const results = OAVerifiableCredential.parse(oaVc);
      expect(results).toEqual(DIGESTED_VC);
    });

    test("should pass digested VC validation without removal of any data", () => {
      const results = OADigestedOAVerifiableCredential.parse(DIGESTED_VC);
      expect(results).toEqual(DIGESTED_VC);
    });

    test("should fail signed VC validation", () => {
      const results = OASignedOAVerifiableCredential.safeParse(DIGESTED_VC);
      expect(results.success).toBe(false);
      expect((results as { error: unknown }).error).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "proof",
              "key"
            ],
            "message": "Required"
          },
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "proof",
              "signature"
            ],
            "message": "Required"
          }
        ]]
      `);
    });
  });

  describe("given a signed VC", () => {
    test("should pass W3C VC validation without removal of any data", () => {
      const w3cVerifiableCredential: W3cVerifiableCredential = SIGNED_VC;
      const results = W3cVerifiableCredential.parse(w3cVerifiableCredential);
      expect(results).toEqual(SIGNED_VC);
    });

    test("should pass VC validation without removal of any data", () => {
      const oaVc: OAVerifiableCredential = SIGNED_VC;
      const results = OAVerifiableCredential.parse(oaVc);
      expect(results).toEqual(SIGNED_VC);
    });

    test("should pass digested VC validation without removal of any data", () => {
      const oaDigestedVc: OASigned = SIGNED_VC;
      const results = OADigestedW3cVerifiableCredential.parse(oaDigestedVc);
      expect(results).toEqual(SIGNED_VC);
    });

    test("should pass signed VC validation without removal of any data", () => {
      const results = OASignedW3cVerifiableCredential.parse(SIGNED_VC);
      expect(results).toEqual(SIGNED_VC);
    });
  });
});
