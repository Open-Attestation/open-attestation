import { verify } from "../verify";
import { DocumentBuilder } from "../documentBuilder";
import { isSignedWrappedDocument, isWrappedDocument } from "../exports";
import { SAMPLE_SIGNING_KEYS } from "../fixtures";

describe(`DocumentBuilder`, () => {
  describe("given a single document", () => {
    const document = new DocumentBuilder({ content: { name: "John Doe" }, name: "Diploma" })
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      });

    test("given sign and wrap is called, return a single signed document", async () => {
      const signed = await document.wrapAndSign({ signer: SAMPLE_SIGNING_KEYS });
      expect(signed.issuer).toMatchInlineSnapshot(`
        {
          "id": "did:example:123",
          "identityProof": {
            "identifier": "example.com",
            "identityProofType": "DNS-TXT",
          },
          "name": "Example University",
          "type": "OpenAttestationIssuer",
        }
      `);
      expect(signed.credentialSubject).toMatchInlineSnapshot(`
        {
          "name": "John Doe",
        }
      `);
      expect(signed.renderMethod).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.com",
            "templateName": "example",
            "type": "OpenAttestationEmbeddedRenderer",
          },
        ]
      `);
      expect(isSignedWrappedDocument(signed)).toBe(true);
      expect(verify(signed)).toBe(true);
    });

    test("given wrap is called, return a wrapped document", async () => {
      const wrapped = await document.justWrapWithoutSigning();
      expect(wrapped.issuer).toMatchInlineSnapshot(`
        {
          "id": "did:example:123",
          "identityProof": {
            "identifier": "example.com",
            "identityProofType": "DNS-TXT",
          },
          "name": "Example University",
          "type": "OpenAttestationIssuer",
        }
      `);
      expect(wrapped.credentialSubject).toMatchInlineSnapshot(`
        {
          "name": "John Doe",
        }
      `);
      expect(wrapped.renderMethod).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.com",
            "templateName": "example",
            "type": "OpenAttestationEmbeddedRenderer",
          },
        ]
      `);
      expect(isWrappedDocument(wrapped)).toBe(true);
      expect(isSignedWrappedDocument(wrapped)).toBe(false);
    });
  });

  describe("given a multiple documents", () => {
    const document = new DocumentBuilder([
      { content: { name: "John Doe" }, name: "Diploma" },
      { content: { name: "Jane Foster" }, name: "Degree" },
    ])
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      });

    test("given sign and wrap is called, return a list of signed document", async () => {
      const signed = await document.wrapAndSign({ signer: SAMPLE_SIGNING_KEYS });
      expect(signed[0].issuer).toMatchInlineSnapshot(`
        {
          "id": "did:example:123",
          "identityProof": {
            "identifier": "example.com",
            "identityProofType": "DNS-TXT",
          },
          "name": "Example University",
          "type": "OpenAttestationIssuer",
        }
      `);
      expect(signed[0].credentialSubject).toMatchInlineSnapshot(`
        {
          "name": "John Doe",
        }
      `);
      expect(signed[0].renderMethod).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.com",
            "templateName": "example",
            "type": "OpenAttestationEmbeddedRenderer",
          },
        ]
      `);
      expect(isSignedWrappedDocument(signed[0])).toBe(true);
      expect(verify(signed[0])).toBe(true);

      expect(signed[1].issuer).toMatchInlineSnapshot(`
        {
          "id": "did:example:123",
          "identityProof": {
            "identifier": "example.com",
            "identityProofType": "DNS-TXT",
          },
          "name": "Example University",
          "type": "OpenAttestationIssuer",
        }
      `);
      expect(signed[1].credentialSubject).toMatchInlineSnapshot(`
        {
          "name": "Jane Foster",
        }
      `);
      expect(signed[1].renderMethod).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.com",
            "templateName": "example",
            "type": "OpenAttestationEmbeddedRenderer",
          },
        ]
      `);
      expect(isSignedWrappedDocument(signed[1])).toBe(true);
      expect(verify(signed[1])).toBe(true);
    });

    test("given wrap is called, return a list of wrapped document", async () => {
      const wrapped = await document.justWrapWithoutSigning();
      expect(wrapped[0].issuer).toMatchInlineSnapshot(`
        {
          "id": "did:example:123",
          "identityProof": {
            "identifier": "example.com",
            "identityProofType": "DNS-TXT",
          },
          "name": "Example University",
          "type": "OpenAttestationIssuer",
        }
      `);
      expect(wrapped[0].credentialSubject).toMatchInlineSnapshot(`
        {
          "name": "John Doe",
        }
      `);
      expect(wrapped[0].renderMethod).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.com",
            "templateName": "example",
            "type": "OpenAttestationEmbeddedRenderer",
          },
        ]
      `);
      expect(isWrappedDocument(wrapped[0])).toBe(true);
      expect(isSignedWrappedDocument(wrapped[0])).toBe(false);

      expect(wrapped[1].issuer).toMatchInlineSnapshot(`
        {
          "id": "did:example:123",
          "identityProof": {
            "identifier": "example.com",
            "identityProofType": "DNS-TXT",
          },
          "name": "Example University",
          "type": "OpenAttestationIssuer",
        }
      `);
      expect(wrapped[1].credentialSubject).toMatchInlineSnapshot(`
        {
          "name": "Jane Foster",
        }
      `);
      expect(wrapped[1].renderMethod).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.com",
            "templateName": "example",
            "type": "OpenAttestationEmbeddedRenderer",
          },
        ]
      `);
      expect(isWrappedDocument(wrapped[1])).toBe(true);
      expect(isSignedWrappedDocument(wrapped[1])).toBe(false);
    });
  });
});
