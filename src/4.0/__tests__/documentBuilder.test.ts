import { validateDigest } from "../validate";
import { VcBuilder, VcBuilderErrors } from "../vcBuilder";
import { isOASignedOAVerifiableCredential, isOADigestedOAVerifiableCredential, signVc } from "../exports";
import { SAMPLE_SIGNING_KEYS } from "../fixtures";
import { ProoflessOAVerifiableCredential } from "../types";

describe(`V4.0 VcBuilder`, () => {
  describe("given a single VC", () => {
    const vc = new VcBuilder({ credentialSubject: { name: "John Doe" }, name: "Diploma" })
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

    test("given sign is called, return a single signed VC", async () => {
      const signed = await vc.sign({ signer: SAMPLE_SIGNING_KEYS });
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
      expect(isOASignedOAVerifiableCredential(signed)).toBe(true);
      expect(validateDigest(signed)).toBe(true);
    });

    test("given digest is called, return a digested VC", async () => {
      const digested = await vc.digest();
      expect(digested.issuer).toMatchInlineSnapshot(`
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
      expect(digested.credentialSubject).toMatchInlineSnapshot(`
        {
          "name": "John Doe",
        }
      `);
      expect(digested.renderMethod).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.com",
            "templateName": "example",
            "type": "OpenAttestationEmbeddedRenderer",
          },
        ]
      `);
      expect(digested.credentialStatus).toMatchInlineSnapshot(`
        {
          "id": "https://oscp.example.com",
          "type": "OpenAttestationOcspResponder",
        }
      `);
      expect(isOADigestedOAVerifiableCredential(digested)).toBe(true);
      expect(isOASignedOAVerifiableCredential(digested)).toBe(false);
    });
  });

  describe("given multiple VCs", () => {
    const vc = new VcBuilder([
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

    test("given sign is called, return a list of signed VCs", async () => {
      const signed = await vc.sign({ signer: SAMPLE_SIGNING_KEYS });
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
      expect(isOASignedOAVerifiableCredential(signed[0])).toBe(true);
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
      expect(isOASignedOAVerifiableCredential(signed[1])).toBe(true);
      expect(validateDigest(signed[1])).toBe(true);
    });

    test("given digest is called, return a list of digested VCs", async () => {
      const digested = await vc.digest();
      expect(digested[0].issuer).toMatchInlineSnapshot(`
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
      expect(digested[0].credentialSubject).toMatchInlineSnapshot(`
        {
          "name": "John Doe",
        }
      `);
      expect(digested[0].renderMethod).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.com",
            "templateName": "example",
            "type": "OpenAttestationEmbeddedRenderer",
          },
        ]
      `);
      expect(isOADigestedOAVerifiableCredential(digested[0])).toBe(true);
      expect(isOASignedOAVerifiableCredential(digested[0])).toBe(false);

      expect(digested[1].issuer).toMatchInlineSnapshot(`
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
      expect(digested[1].credentialSubject).toMatchInlineSnapshot(`
        {
          "name": "Jane Foster",
        }
      `);
      expect(digested[1].renderMethod).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.com",
            "templateName": "example",
            "type": "OpenAttestationEmbeddedRenderer",
          },
        ]
      `);
      expect(isOADigestedOAVerifiableCredential(digested[1])).toBe(true);
      expect(isOASignedOAVerifiableCredential(digested[1])).toBe(false);
    });
  });

  test("given additional properties in constructor payload, should not be added into the VC", async () => {
    const signed = await new VcBuilder({
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
      .sign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed).not.toHaveProperty("anotherProperty");
  });

  test("given svg rendering method, should be added into the VC", async () => {
    const signed = await new VcBuilder({
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
      .sign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed.renderMethod).toMatchInlineSnapshot(`
      [
        {
          "id": "<svg>{{ name }}</svg>",
          "type": "SvgRenderingTemplate2023",
        },
      ]
    `);
  });

  test("given no rendering method, should reflect in the output VC", async () => {
    const signed = await new VcBuilder({
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
      .sign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed.renderMethod).toMatchInlineSnapshot(`undefined`);
  });

  test("given attachment is added, should be added into the VC", async () => {
    const signed = await new VcBuilder({
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
      .sign({ signer: SAMPLE_SIGNING_KEYS });

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

  test("given revocation store revocation is added, should be added into credential status of the VC", async () => {
    const signed = await new VcBuilder({
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
      .sign({ signer: SAMPLE_SIGNING_KEYS });

    expect(signed.credentialStatus).toMatchInlineSnapshot(`
      {
        "id": "0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89",
        "type": "OpenAttestationRevocationStore",
      }
    `);
  });

  test("given digest is first called, should not be able to sign the digested VC with the standalone sign fn", async () => {
    const digested = await new VcBuilder({
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
      .digest();

    let error;
    await expect(async () => {
      try {
        await signVc(
          digested as unknown as ProoflessOAVerifiableCredential,
          "Secp256k1VerificationKey2018",
          SAMPLE_SIGNING_KEYS
        );
      } catch (e) {
        error = e;
        throw e;
      }
    }).rejects.toThrowErrorMatchingInlineSnapshot(`
      "Input VC does not conform to Open Attestation v4.0 Data Model: 
       {
        "_errors": [],
        "proof": {
          "_errors": [
            "VC has to be unsigned"
          ]
        }
      }"
    `);
    expect(error).toBeInstanceOf(VcBuilderErrors.DataModelValidationError);
  });

  test("given re-setting of values, should throw", async () => {
    const builder = await new VcBuilder({
      credentialSubject: { name: "John Doe" },
      name: "Diploma",
    });

    const vcWithRenderMethod = builder.embeddedRenderer({
      rendererUrl: "https://example.com",
      templateName: "example",
    });

    expect(() =>
      builder.embeddedRenderer({
        rendererUrl: "https://another.com",
        templateName: "another",
      })
    ).toThrowError(VcBuilderErrors.ShouldNotModifyAfterSettingError);

    const vcWithNoRevocation = vcWithRenderMethod.noRevocation();
    expect(() => vcWithRenderMethod.oscpRevocation({ oscpUrl: "https://oscp.example.com" })).toThrowError(
      VcBuilderErrors.ShouldNotModifyAfterSettingError
    );

    vcWithNoRevocation.dnsTxtIssuance({
      identityProofDomain: "example.com",
      issuerId: "did:example:123",
      issuerName: "Example University",
    });

    expect(() =>
      vcWithNoRevocation.dnsTxtIssuance({
        identityProofDomain: "another.com",
        issuerId: "did:example:123",
        issuerName: "Example University",
      })
    ).toThrowError(VcBuilderErrors.ShouldNotModifyAfterSettingError);
  });

  describe("given invalid props", () => {
    test("given an invalid attachment, should throw", () => {
      let error;
      expect(() => {
        try {
          new VcBuilder({
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
      }).toThrowError(VcBuilderErrors.PropsValidationError);
      expect(error).toBeInstanceOf(VcBuilderErrors.PropsValidationError);
    });

    test("given an invalid identity identifier, should throw", () => {
      const builder = new VcBuilder({
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
      expect(error).toBeInstanceOf(VcBuilderErrors.PropsValidationError);
    });

    test("given an invalid ethereum address for revocation store, should throw", () => {
      const builder = new VcBuilder({
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
      expect(error).toBeInstanceOf(VcBuilderErrors.PropsValidationError);
    });
  });
});
