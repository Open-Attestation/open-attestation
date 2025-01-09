import { cloneDeep, omit } from "lodash";
import { digestVc, digestVcs, obfuscateOAVerifiableCredential, validateDigest } from "../exports";
import type { OAVerifiableCredential } from "../exports";
import { RAW_VC_DID, SIGNED_VC_DID, DIGESTED_VC_DID } from "../fixtures";
import { isOADigestedOAVerifiableCredential, ProoflessOAVerifiableCredential } from "../types";

const VC_ONE = {
  ...RAW_VC_DID,
  credentialSubject: {
    ...RAW_VC_DID.credentialSubject,
    key1: "test",
  },
} satisfies OAVerifiableCredential;
const VC_TWO = {
  ...RAW_VC_DID,
  credentialSubject: {
    ...RAW_VC_DID.credentialSubject,
    key1: "hello",
    key2: "item2",
  },
} satisfies OAVerifiableCredential;

const VC_THREE = {
  ...RAW_VC_DID,
  credentialSubject: {
    ...RAW_VC_DID.credentialSubject,
    key1: "item1",
    key2: "true",
    key3: 3.14159,
    key4: false,
  },
} satisfies OAVerifiableCredential;

const VC_FOUR = {
  ...RAW_VC_DID,
  credentialSubject: {
    ...RAW_VC_DID.credentialSubject,
    key1: "item2",
  },
};
const DATUM = [VC_ONE, VC_TWO, VC_THREE, VC_FOUR] satisfies OAVerifiableCredential[];

describe("V4.0 E2E Test Scenarios", () => {
  describe("Issuing a single VC", () => {
    test("fails for missing data", async () => {
      const missingData = {
        ...omit(cloneDeep(VC_ONE), "issuer"),
      };
      await expect(digestVc(missingData as unknown as ProoflessOAVerifiableCredential)).rejects
        .toThrowErrorMatchingInlineSnapshot(`
        "Input VC does not conform to Open Attestation v4.0 Data Model: 
         {
          "_errors": [],
          "issuer": {
            "_errors": [
              "Required"
            ]
          }
        }"
      `);
    });

    test("creates a digested VC", async () => {
      const digested = await digestVc(RAW_VC_DID);
      expect(digested["@context"]).toEqual([
        "https://www.w3.org/ns/credentials/v2",
        "https://schemata.openattestation.com/com/openattestation/4.0/context.json",
      ]);
      expect(digested.type).toEqual(["VerifiableCredential", "OpenAttestationCredential"]);
      expect(digested.proof.type).toBe("OpenAttestationHashProof2018");
      expect(digested.proof.targetHash).toBeDefined();
      expect(digested.proof.merkleRoot).toBeDefined();
      expect(digested.proof.proofs).toEqual([]);
      expect(digested.proof.merkleRoot).toBe(digested.proof.targetHash);
    });

    test("checks that VC is digested correctly", async () => {
      const digested = await digestVc(VC_ONE);
      const verified = validateDigest(digested);
      expect(verified).toBe(true);
    });

    test("checks that VC conforms to the schema", async () => {
      const digested = await digestVc(VC_ONE);
      expect(isOADigestedOAVerifiableCredential(digested)).toBe(true);
    });

    test("does not allow for the same merkle root to be generated", async () => {
      // This test takes some time to run, so we set the timeout to 14s
      const digested = await digestVc(VC_ONE);
      const newDigested = await digestVc(VC_ONE);
      expect(digested.proof.merkleRoot).not.toBe(newDigested.proof.merkleRoot);
    }, 14000);

    test("obfuscate data correctly", async () => {
      const newDigested = await digestVc(VC_THREE);
      expect(newDigested.credentialSubject.key2).toBeDefined();
      const obfuscatedVc = obfuscateOAVerifiableCredential(newDigested, ["credentialSubject.key2"]);
      expect(validateDigest(obfuscatedVc)).toBe(true);
      expect(isOADigestedOAVerifiableCredential(obfuscatedVc)).toBe(true);
      expect(obfuscatedVc.credentialSubject.key2).toBeUndefined();
    });

    test("obfuscate data transistively", async () => {
      const newDigested = await digestVc(VC_THREE);
      const intermediateVc = obfuscateOAVerifiableCredential(newDigested, ["credentialSubject.key2"]);
      const obfuscatedVc = obfuscateOAVerifiableCredential(intermediateVc, ["credentialSubject.key3"]);
      expect(
        obfuscateOAVerifiableCredential(newDigested, ["credentialSubject.key2", "credentialSubject.key3"])
      ).toEqual(obfuscatedVc);
    });

    describe("Issuing a batch of VCs", () => {
      test("fails if there is a malformed VC", async () => {
        const malformedDatum = [
          ...DATUM,
          {
            laurent: "task force, assemble!!",
          } as unknown as ProoflessOAVerifiableCredential,
        ];
        await expect(digestVcs(malformedDatum)).rejects.toThrowErrorMatchingInlineSnapshot(`
          "Input VC does not conform to Verifiable Credentials v2.0 Data Model: 
           {
            "_errors": [],
            "@context": {
              "_errors": [
                "Required",
                "Required",
                "Required"
              ]
            },
            "issuer": {
              "_errors": [
                "Required",
                "Required"
              ]
            },
            "type": {
              "_errors": [
                "Required",
                "Required"
              ]
            },
            "credentialSubject": {
              "_errors": [
                "Required",
                "Required"
              ]
            }
          }"
        `);
      });

      test("creates a batch of VC if all are in the right format", async () => {
        const digestedVcs = await digestVcs(DATUM);
        digestedVcs.forEach((doc, i: number) => {
          expect(doc.type).toEqual(["VerifiableCredential", "OpenAttestationCredential"]);
          expect(doc.proof.type).toBe("OpenAttestationHashProof2018");
          expect(doc.proof.type).toBe("OpenAttestationHashProof2018");
          expect(doc.credentialSubject.key1).toEqual(expect.stringContaining(DATUM[i].credentialSubject.key1));
          expect(doc.proof.targetHash).toBeDefined();
          expect(doc.proof.merkleRoot).toBeDefined();
          expect(doc.proof.proofs.length).toEqual(2);
        });
      });

      test("checks that VCs are digested correctly", async () => {
        const digestedVcs = await digestVcs(DATUM);
        const verified = digestedVcs.reduce((prev, curr) => validateDigest(curr) && prev, true);
        expect(verified).toBe(true);
      });

      test("checks that VCs conforms to the schema", async () => {
        const digestedVcs = await digestVcs(DATUM);
        const validatedSchema = digestedVcs.reduce(
          (prev: boolean, curr: any) => isOADigestedOAVerifiableCredential(curr) && prev,
          true
        );
        expect(validatedSchema).toBe(true);
      });

      test("does not allow for same merkle root to be generated", async () => {
        const digestedVcs = await digestVcs(DATUM);
        const newDigestedVcs = await digestVcs(DATUM);
        expect(digestedVcs[0].proof.merkleRoot).not.toBe(newDigestedVcs[0].proof.merkleRoot);
      });
    });
  });

  describe("validate schema", () => {
    test("should return true when VC is a valid digested v4 VC and identityProof is DNS-DID", () => {
      expect(isOADigestedOAVerifiableCredential(DIGESTED_VC_DID)).toStrictEqual(true);
    });

    test("should return true when signed VC is a valid signed v4 VC and identityProof is DNS-DID", () => {
      expect(isOADigestedOAVerifiableCredential(SIGNED_VC_DID)).toStrictEqual(true);
    });

    test("should return false when VC is invalid due to no DNS-DID identifier", () => {
      const modifiedIssuer = cloneDeep(RAW_VC_DID.issuer);
      delete (modifiedIssuer as any).id;
      const credential = {
        ...RAW_VC_DID,
        issuer: modifiedIssuer,
      } satisfies OAVerifiableCredential;
      expect(isOADigestedOAVerifiableCredential(credential)).toStrictEqual(false);
    });
  });

  describe("unicode", () => {
    test("should not corrupt unicode VC", async () => {
      const vc = {
        ...RAW_VC_DID,
        credentialSubject: {
          key1: "哦喷啊特特是他题哦你",
          key2: "นยำืฟะะำหะฟะรนื",
          key3: "おぺなってsたちおn",
          key4: "خحثىشففثسفشفهخى",
        },
      };
      const digested = await digestVc(vc);
      expect(digested.proof.merkleRoot).toBeTruthy();
      expect(digested.credentialSubject.key1).toBe(vc.credentialSubject.key1);
      expect(digested.credentialSubject.key2).toBe(vc.credentialSubject.key2);
      expect(digested.credentialSubject.key3).toBe(vc.credentialSubject.key3);
      expect(digested.credentialSubject.key4).toBe(vc.credentialSubject.key4);
    });
  });
});
