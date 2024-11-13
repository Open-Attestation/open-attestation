import { validateDigest } from "../validate";
import { DocumentBuilder, DocumentBuilderErrors } from "../documentBuilder";
import { isSignedWrappedDocument, isWrappedDocument, signVC } from "../exports";
import { SAMPLE_SIGNING_KEYS } from "../fixtures";

describe(`V4.0 DocumentBuilder`, () => {
  describe("given a single document", () => {
    const document = new DocumentBuilder({ credentialSubject: { name: "John Doe" }, name: "Diploma" })
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .oscpRevocation({
        oscpUrl: "https://oscp.example.com",
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
      expect(signed.credentialStatus).toMatchInlineSnapshot(`
        {
          "id": "https://oscp.example.com",
          "type": "OpenAttestationOcspResponder",
        }
      `);
      expect(isSignedWrappedDocument(signed)).toBe(true);
      expect(validateDigest(signed)).toBe(true);
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
      expect(wrapped.credentialStatus).toMatchInlineSnapshot(`
        {
          "id": "https://oscp.example.com",
          "type": "OpenAttestationOcspResponder",
        }
      `);
      expect(isWrappedDocument(wrapped)).toBe(true);
      expect(isSignedWrappedDocument(wrapped)).toBe(false);
    });
  });

  describe("given a multiple documents", () => {
    const document = new DocumentBuilder([
      { credentialSubject: { name: "John Doe" }, name: "Diploma" },
      { credentialSubject: { name: "Jane Foster" }, name: "Degree" },
    ])
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .noRevocation()
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
      expect(signed[0].credentialStatus).toBeUndefined();
      expect(isSignedWrappedDocument(signed[0])).toBe(true);
      expect(validateDigest(signed[0])).toBe(true);

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
      expect(signed[1].credentialStatus).toBeUndefined();
      expect(isSignedWrappedDocument(signed[1])).toBe(true);
      expect(validateDigest(signed[1])).toBe(true);
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
      credentialSubject: { name: "John Doe" },
      name: "Diploma",
      anotherProperty: "value",
    })
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .noRevocation()
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
      .wrapAndSign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed).not.toHaveProperty("anotherProperty");
  });

  test("given svg rendering method, should be added into the document", async () => {
    const signed = await new DocumentBuilder({
      credentialSubject: {
        name: "John Doe",
        attachments: [
          {
            data: "data",
            filename: "file",
            mimeType: "application/pdf",
          },
        ],
      },
      name: "Diploma",
    })
      .svgRenderer({
        type: "EMBEDDED",
        svgTemplate: "<svg>{{ name }}</svg>",
      })
      .noRevocation()
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
      .wrapAndSign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed.renderMethod).toMatchInlineSnapshot(`
      [
        {
          "id": "<svg>{{ name }}</svg>",
          "type": "SvgRenderingTemplate2023",
        },
      ]
    `);
  });

  test("given no rendering method, should reflect in the output document", async () => {
    const signed = await new DocumentBuilder({
      credentialSubject: {
        name: "John Doe",
        attachments: [
          {
            data: "data",
            filename: "file",
            mimeType: "application/pdf",
          },
        ],
      },
      name: "Diploma",
    })
      .noRenderer()
      .noRevocation()
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
      .wrapAndSign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed.renderMethod).toMatchInlineSnapshot(`undefined`);
  });

  test("given attachment is added, should be added into the document", async () => {
    const signed = await new DocumentBuilder({
      credentialSubject: {
        name: "John Doe",
        attachments: [
          {
            data: "data",
            filename: "file",
            mimeType: "application/pdf",
          },
        ],
      },
      name: "Diploma",
    })
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .noRevocation()
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
      .wrapAndSign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed.credentialSubject.attachments).toMatchInlineSnapshot(`
      [
        {
          "data": "data",
          "filename": "file",
          "mimeType": "application/pdf",
        },
      ]
    `);
  });

  test("given revocation store revocation is added, should be added into credential status of the document", async () => {
    const signed = await new DocumentBuilder({
      credentialSubject: { name: "John Doe" },
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
      .revocationStoreRevocation({
        storeAddress: "0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
      })
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
      .wrapAndSign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed.credentialStatus).toMatchInlineSnapshot(`
      {
        "id": "0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        "type": "OpenAttestationRevocationStore",
      }
    `);
  });

  test("given wrap only is called, should be able to sign the wrapped document with the standalone sign fn", async () => {
    const wrapped = await new DocumentBuilder({
      credentialSubject: { name: "John Doe" },
      name: "Diploma",
    })
      .embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      })
      .noRevocation()
      .dnsTxtIssuance({
        identityProofDomain: "example.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
      .justWrapWithoutSigning();

    const signed = await signVC(wrapped, "Secp256k1VerificationKey2018", SAMPLE_SIGNING_KEYS);

    expect(isSignedWrappedDocument(signed)).toBe(true);
    expect(validateDigest(signed)).toBe(true);
  });

  test("given re-setting of values, should throw", async () => {
    const builder = await new DocumentBuilder({
      credentialSubject: { name: "John Doe" },
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

    const documentWithNoRevocation = documentWithRenderMethod.noRevocation();
    expect(() => documentWithRenderMethod.oscpRevocation({ oscpUrl: "https://oscp.example.com" })).toThrowError(
      DocumentBuilderErrors.ShouldNotModifyAfterSettingError
    );

    documentWithNoRevocation.dnsTxtIssuance({
      identityProofDomain: "example.com",
      issuerId: "did:example:123",
      issuerName: "Example University",
    });

    expect(() =>
      documentWithNoRevocation.dnsTxtIssuance({
        identityProofDomain: "another.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
    ).toThrowError(DocumentBuilderErrors.ShouldNotModifyAfterSettingError);
  });

  describe("given invalid props", () => {
    test("given an invalid attachment, should throw", () => {
      let error;
      expect(() => {
        try {
          new DocumentBuilder({
            credentialSubject: {
              name: "John Doe",
              attachments: [
                {
                  data: "data",
                  fileName: "file",
                } as any,
              ],
            },
            name: "Diploma",
          });
        } catch (e) {
          error = e;
          throw e;
        }
      }).toThrowError(DocumentBuilderErrors.PropsValidationError);
      expect(error).toBeInstanceOf(DocumentBuilderErrors.PropsValidationError);
    });

    test("given an invalid identity identifier, should throw", () => {
      const builder = new DocumentBuilder({
        credentialSubject: { name: "John Doe" },
        name: "Diploma",
      })
        .embeddedRenderer({
          rendererUrl: "https://example.com",
          templateName: "example",
        })
        .noRevocation();
      let error;
      expect(() => {
        try {
          builder.dnsTxtIssuance({
            identityProofDomain: "example.com",
            issuerId: "invalid",
            issuerName: "Example University",
          });
        } catch (e) {
          error = e;
          throw e;
        }
      }).toThrowErrorMatchingInlineSnapshot(`
              "Invalid props: 
               {
                "_errors": [],
                "issuerId": {
                  "_errors": [
                    "Invalid URI"
                  ]
                }
              }"
          `);
      expect(error).toBeInstanceOf(DocumentBuilderErrors.PropsValidationError);
    });

    test("given an invalid ethereum address for revocation store, should throw", () => {
      const builder = new DocumentBuilder({
        credentialSubject: { name: "John Doe" },
        name: "Diploma",
      }).embeddedRenderer({
        rendererUrl: "https://example.com",
        templateName: "example",
      });

      let error;
      expect(() => {
        try {
          builder.revocationStoreRevocation({
            storeAddress: "0x123",
          });
        } catch (e) {
          error = e;
          throw e;
        }
      }).toThrowErrorMatchingInlineSnapshot(`
        "Invalid props: 
         {
          "_errors": [],
          "storeAddress": {
            "_errors": [
              "Invalid Ethereum address"
            ]
          }
        }"
      `);
      expect(error).toBeInstanceOf(DocumentBuilderErrors.PropsValidationError);
    });
  });
});
