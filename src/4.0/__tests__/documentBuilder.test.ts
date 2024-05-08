import { verify } from "../verify";
import { DocumentBuilder, DocumentBuilderErrors } from "../documentBuilder";
import { isSignedWrappedDocument, isWrappedDocument, signDocument } from "../exports";
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

  test("given additional properties in constructor payload, should not be added into the document", async () => {
    const signed = await new DocumentBuilder({
      content: { name: "John Doe" },
      name: "Diploma",
      anotherProperty: "value",
    })
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
      .wrapAndSign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed).not.toHaveProperty("anotherProperty");
  });

  test("given attachment is added, should be added into the document", async () => {
    const signed = await new DocumentBuilder({
      content: { name: "John Doe" },
      name: "Diploma",
      attachments: [
        {
          data: "data",
          fileName: "file",
          mimeType: "application/pdf",
        },
      ],
    })
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
      .wrapAndSign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed.attachments).toMatchInlineSnapshot(`
      [
        {
          "data": "data",
          "fileName": "file",
          "mimeType": "application/pdf",
        },
      ]
    `);
  });

  test("given wrap only is called, should be able to sign the wrapped document with the standalone sign fn", async () => {
    const wrapped = await new DocumentBuilder({
      content: { name: "John Doe" },
      name: "Diploma",
    })
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
      .justWrapWithoutSigning();

    const signed = await signDocument(wrapped, "Secp256k1VerificationKey2018", SAMPLE_SIGNING_KEYS);
    expect(isSignedWrappedDocument(signed)).toBe(true);
    expect(verify(signed)).toBe(true);
  });

  test("should not allow re-setting of values", async () => {
    const builder = await new DocumentBuilder({
      content: { name: "John Doe" },
      name: "Diploma",
    });

    const documentWithRenderMethod = builder.embeddedRenderer({
      rendererUrl: "https://example.com",
      templateName: "example",
    });

    expect(() =>
      builder.embeddedRenderer({
        rendererUrl: "https://another.com",
        templateName: "another",
      })
    ).toThrowError(DocumentBuilderErrors.ShouldNotModifyAfterSettingError);

    documentWithRenderMethod.dnsTxtIssuance({
      identityProofDomain: "example.com",
      issuerId: "did:example:123",
      issuerName: "Example University",
    });

    expect(() =>
      documentWithRenderMethod.dnsTxtIssuance({
        identityProofDomain: "another.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
    ).toThrowError(DocumentBuilderErrors.ShouldNotModifyAfterSettingError);
  });
});
