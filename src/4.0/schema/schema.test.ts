/* eslint-disable jest/no-try-expect,jest/no-conditional-expect */
import { cloneDeep } from "lodash";
import { _unsafe_use_it_at_your_own_risk_v4_alpha_wrapDocument as wrapDocumentV4 } from "../../index";
import sample from "../../../test/fixtures/v4/did-raw.json";
import { ContextUrl } from "../../shared/@types/document";
import { OpenAttestationDocument } from "../../__generated__/schema.4.0";

const sampleVc = sample as OpenAttestationDocument;

// eslint-disable-next-line jest/no-disabled-tests
describe("schema/4.0", () => {
  it("should be valid with sample document", async () => {
    const document = cloneDeep(sampleVc);
    const wrappedDocument = await wrapDocumentV4(document);
    expect(wrappedDocument["type"]).toStrictEqual(["VerifiableCredential", "OpenAttestationCredential"]);
    expect(wrappedDocument["proof"]["type"]).toStrictEqual("OpenAttestationMerkleProofSignature2018");
  });

  it("should be valid when adding any additional data", async () => {
    const document = { ...cloneDeep(sampleVc), key1: "some" };
    const wrappedDocument = await wrapDocumentV4(document);
    expect(wrappedDocument["key1"]).toStrictEqual("some");
    expect(wrappedDocument["type"]).toStrictEqual(["VerifiableCredential", "OpenAttestationCredential"]);
    expect(wrappedDocument["proof"]["type"]).toStrictEqual("OpenAttestationMerkleProofSignature2018");
  });

  describe("@context", () => {
    it("should be invalid if @context contains one invalid URI", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleVc), "@context": [ContextUrl.v2_vc, "bad string"] };
      await expect(wrapDocumentV4(document)).rejects.toMatchInlineSnapshot(
        `[Error: Unable to interpret @context: {"name":"jsonld.InvalidUrl","details":{"code":"loading remote context failed","url":"bad string","cause":{}}}]`
      );
    });
  });
});
