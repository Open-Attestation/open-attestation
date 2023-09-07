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
    it("should self-correct when @context is a string with a valid context, appending it to the array of @context", async () => {
      // @context MUST be an ordered set in W3C VC data model, see https://www.w3.org/TR/vc-data-model/#contexts
      const document = { ...cloneDeep(sampleVc), "@context": "https://w3id.org/traceability/v1" };
      const wrappedDocument = await wrapDocumentV4(document as any);
      expect(wrappedDocument["@context"]).toStrictEqual([
        "https://www.w3.org/2018/credentials/v1",
        ContextUrl.v4_alpha,
        "https://w3id.org/traceability/v1",
      ]);
    });
    it("should self-correct when @context is an array that contains a valid context but is missing the required contexts", async () => {
      // This should not have AJV validation errors as it's only caught after
      const document = { ...cloneDeep(sampleVc), "@context": ["https://w3id.org/traceability/v1"] };
      const wrappedDocument = await wrapDocumentV4(document);
      expect(wrappedDocument["@context"]).toStrictEqual([
        "https://www.w3.org/2018/credentials/v1",
        ContextUrl.v4_alpha,
        "https://w3id.org/traceability/v1",
      ]);
    });
    it("should self-correct when @context is an array that contains the required context but not the right order", async () => {
      // This should not have AJV validation errors as it's only caught during validateW3C
      const document = {
        ...cloneDeep(sampleVc),
        "@context": ["https://w3id.org/traceability/v1", "https://www.w3.org/2018/credentials/v1"],
      };
      const wrappedDocument = await wrapDocumentV4(document);
      expect(wrappedDocument["@context"]).toStrictEqual([
        "https://www.w3.org/2018/credentials/v1",
        ContextUrl.v4_alpha,
        "https://w3id.org/traceability/v1",
      ]);
    });
    it("should be invalid if @context contains one invalid URI", async () => {
      expect.assertions(1);
      const document = { ...cloneDeep(sampleVc), "@context": ["https://www.w3.org/2018/credentials/v1", "any"] };
      await expect(wrapDocumentV4(document)).rejects.toHaveProperty("validationErrors", [
        {
          keyword: "format",
          instancePath: "/@context/2",
          schemaPath: "#/properties/%40context/items/format",
          params: { format: "uri" },
          message: 'must match format "uri"',
        },
      ]);
    });
  });
});
