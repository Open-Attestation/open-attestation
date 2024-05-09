import { wrapDocument, wrapDocuments, wrapDocumentErrors } from "./wrap";
import { signDocument, signDocumentErrors } from "./sign";
import {
  Override,
  DecentralisedEmbeddedRenderer,
  SvgRenderer,
  OscpResponderRevocation,
  RevocationStoreRevocation,
  V4Document,
  V4SignedWrappedDocument,
  V4WrappedDocument,
} from "./types";

import { ZodError, z } from "zod";

const SingleDocumentProps = z.object({
  name: V4Document.shape.name.unwrap(),
  credentialSubject: z.record(z.unknown()),
  attachments: V4Document.shape.attachments,
});

const DocumentProps = z.union([SingleDocumentProps, z.array(SingleDocumentProps)]);

const OscpRevocationProps = z.object({
  oscpUrl: OscpResponderRevocation.shape.id,
});

const RevocationStoreRevocationProps = z.object({
  storeAddress: RevocationStoreRevocation.shape.id,
});

const EmbeddedRendererProps = z.object({
  rendererUrl: DecentralisedEmbeddedRenderer.shape.id,
  templateName: DecentralisedEmbeddedRenderer.shape.templateName,
});

const SvgRendererProps = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("REMOTE"),
    svgUrl: z.string().url(),
    digestMultibase: SvgRenderer.shape.digestMultibase.optional(),
  }),
  z.object({
    type: z.literal("EMBEDDED"),
    svgTemplate: z.string(),
  }),
]);

const DnsTextIssuanceProps = z.object({
  issuerId: V4Document.shape.issuer.shape.id,
  issuerName: V4Document.shape.issuer.shape.name,
  identityProofDomain: V4Document.shape.issuer.shape.identityProof.shape.identifier,
});

/**
 * Validation errors within properties.
 */
class PropsValidationError extends Error {
  constructor(public error: ZodError) {
    super(`Invalid props: \n ${JSON.stringify(error.format(), null, 2)}`);
    Object.setPrototypeOf(this, PropsValidationError.prototype);
  }
}

/**
 * Error to indicate that modifications to set properties are not allowed.
 */
class ShouldNotModifyAfterSettingError extends Error {
  constructor() {
    super("Modifying what was already set can lead to unexpected behaviour, please consider creating a new instance");
    Object.setPrototypeOf(this, ShouldNotModifyAfterSettingError.prototype);
  }
}

type DocumentProps = {
  /**
   * Human readable name of the document.
   *
   * Maps to "name"
   */
  name: string;
  /**
   * Main content of the document.
   *
   * Maps to "credentialSubject"
   */
  credentialSubject: Record<string, unknown>;
  /**
   * Optional attachments that will be rendered out of the box with OpenAttestation's
   * Decentralised Renderer Components
   *
   * Maps to "attachments"
   */
  attachments?: V4Document["attachments"];
};

type State = {
  documentMainProps: DocumentProps | DocumentProps[];
  renderMethod: V4Document["renderMethod"];
  issuer: V4Document["issuer"] | undefined;
  credentialStatus: V4Document["credentialStatus"];
};

/**
 * A builder class to facilitate the creation of OpenAttestation v4 documents.
 * Assumes a shared issuer, render method, and credential status across all documents in batch mode.
 * For use cases requiring direct control, consider using the lower-level wrap and sign functions.
 */
export class DocumentBuilder<Props extends DocumentProps | DocumentProps[]> {
  private getState: () => State;
  private setState: <Key extends keyof State>(key: Key, value: Pick<State, Key>[Key]) => void;
  constructor(props: Props) {
    const parsedResults = DocumentProps.safeParse(props);
    if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);

    // define state here rather than in the instance to enforce immutability via setState.
    const state: State = {
      documentMainProps: parsedResults.data,
      renderMethod: undefined,
      issuer: undefined,
      credentialStatus: undefined,
    };

    const hasBeenSet = new Set<keyof State>();
    this.getState = () => state;
    this.setState = (key, value) => {
      if (hasBeenSet.has(key)) throw new ShouldNotModifyAfterSettingError();
      hasBeenSet.add(key);
      state[key] = value;
    };
  }

  private wrap = async (): Promise<WrappedReturn<Props>> => {
    const { documentMainProps: data, issuer, renderMethod, credentialStatus } = this.getState();

    // this should never happen
    if (!issuer) throw new Error("Issuer is required");
    if (Array.isArray(data)) {
      const toWrap = data.map(
        ({ name, credentialSubject, attachments }) =>
          ({
            "@context": [
              "https://www.w3.org/ns/credentials/v2",
              "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
            ],
            type: ["VerifiableCredential", "OpenAttestationCredential"],
            issuer,
            name,
            credentialSubject,
            ...(renderMethod && { renderMethod }),
            ...(attachments && { attachments }),
            ...(credentialStatus && { credentialStatus }),
          } satisfies V4Document)
      );

      return wrapDocuments(toWrap) as unknown as WrappedReturn<Props>;
    }

    // this should never happen
    if (!data) throw new Error("CredentialSubject is required");

    const { name, credentialSubject, attachments } = data;
    return wrapDocument({
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
      ],
      type: ["VerifiableCredential", "OpenAttestationCredential"],
      issuer,
      name,
      credentialSubject,
      ...(renderMethod && { renderMethod }),
      ...(attachments && { attachments }),
      ...(credentialStatus && { credentialStatus }),
    }) as unknown as WrappedReturn<Props>;
  };

  private sign = async (props: { signer: Parameters<typeof signDocument>[2] }): Promise<SignedReturn<Props>> => {
    const wrapped = await this.wrap();
    if (Array.isArray(wrapped)) {
      return Promise.all(wrapped.map((d) => signDocument(d, "Secp256k1VerificationKey2018", props.signer))) as Promise<
        SignedReturn<Props>
      >;
    }

    return signDocument(wrapped, "Secp256k1VerificationKey2018", props.signer) as Promise<SignedReturn<Props>>;
  };

  // add issuance methods here
  private ISSUANCE_METHODS = {
    // not supported right now
    // blockchainIssuance: (props: {
    //   /** A unique ID of the issuer that MUST BE in a URI */
    //   issuerId: string;
    //   issuerName: string;
    //   /** should be in the form of "did:ethr:0x${string}#controller" */
    //   ethDid: string;
    //   /**  */
    //   identityProofDomain: string;
    // }) => {
    //   this.issuer = {
    //     id: props.issuerId,
    //     name: props.issuerName,
    //     type: "OpenAttestationIssuer",
    //     identityProof: {
    //       identityProofType: "DNS-DID",
    //       identifier: props.ethDid,
    //     },
    //   };
    //   return {
    //     wrap: this.wrap,
    //   };
    // },

    /**
     * The document will be digitally signed, and identity proof will be provided via a DNS-TXT record.
     *
     * Sets "issuer.type" to "OpenAttestationIssuer" and "issuer.identityProof.identityProofType" to "DNS-TXT"
     */
    dnsTxtIssuance: (props: {
      /**
       * The unique identifier for the issuer, which must be formatted as a URI.
       *
       * Maps to "issuer.id"
       */
      issuerId: string;
      /**
       * The issuer's name in a human-readable format.
       *
       * Maps to "issuer.name"
       */
      issuerName: string;
      /**
       * The domain where the DNS TXT record, used for identity proof, is located.
       *
       * Maps to "issuer.identityProof.identifier"
       */
      identityProofDomain: string;
    }) => {
      const parsedResults = DnsTextIssuanceProps.safeParse(props);
      if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);
      const { issuerId, issuerName, identityProofDomain } = parsedResults.data;

      const issuer = {
        id: issuerId,
        name: issuerName,
        type: "OpenAttestationIssuer",
        identityProof: {
          identityProofType: "DNS-TXT",
          identifier: identityProofDomain,
        },
      } satisfies V4Document["issuer"];
      this.setState("issuer", issuer);

      return {
        /**
         * Wraps and signs the entire batch in a single operation. This method does not use internal batching logic,
         * which could lead to too many concurrent remote calls when signing large batches. Use this function with caution in such scenarios.
         */
        wrapAndSign: this.sign,
        /**
         * Provides an option to wrap documents without signing them, allowing for more control over the signing process.
         * This is particularly useful when you need to sign documents in smaller batches or at different stages.
         */
        justWrapWithoutSigning: this.wrap,
      };
    },
  } satisfies Record<`${string}Issuance`, (...args: any[]) => any>;

  // add revocation methods here
  private REVOCATION_METHODS = {
    /**
     * The document(s) will be issued without the capability for revocation; they remain valid indefinitely.
     */
    noRevocation: () => {
      this.setState("credentialStatus", undefined);

      return this.ISSUANCE_METHODS;
    },
    /**
     * The document(s) can be revoked using an OCSP responder, allowing for the verification of the revocation status through the specified URL.
     *
     * Sets "credentialStatus.type" to "OpenAttestationOcspResponder"
     */
    oscpRevocation: (props: {
      /**
       * URL of the OCSP responder.
       *
       * Maps to "credentialStatus.id"
       */
      oscpUrl: string;
    }) => {
      const parsedResults = OscpRevocationProps.safeParse(props);
      if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);
      const { oscpUrl } = parsedResults.data;

      const credentialStatus = {
        id: oscpUrl,
        type: "OpenAttestationOcspResponder",
      } satisfies V4Document["credentialStatus"];
      this.setState("credentialStatus", credentialStatus);

      return this.ISSUANCE_METHODS;
    },
    /**
     * The document(s) can be revoked using a revocation store, implemented as a smart contract on the Ethereum blockchain.
     *
     * Sets "credentialStatus.type" to "OpenAttestationRevocationStore"
     */
    revocationStoreRevocation: (props: {
      /**
       * The Ethereum smart contract address to the revocation store.
       *
       * Maps to "credentialStatus.id"
       */
      storeAddress: string;
    }) => {
      const parsedResults = RevocationStoreRevocationProps.safeParse(props);
      if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);
      const { storeAddress } = parsedResults.data;

      const credentialStatus = {
        id: storeAddress,
        type: "OpenAttestationRevocationStore",
      } satisfies V4Document["credentialStatus"];

      this.setState("credentialStatus", credentialStatus);

      return this.ISSUANCE_METHODS;
    },
  } satisfies Record<`${string}Revocation`, (...args: any[]) => typeof this.ISSUANCE_METHODS>;

  /**
   * Configures the document to be rendered using OpenAttestation's decentralized React components,
   * see (https://github.com/Open-Attestation/decentralized-renderer-react-components).
   *
   * Sets "renderMethod[0].type" to "OpenAttestationEmbeddedRenderer"
   */
  public embeddedRenderer = (props: {
    /**
     * The URL where the decentralized renderer is hosted.
     *
     * Maps to "renderMethod[0].id"
     */
    rendererUrl: string;
    /**
     * The identifier for the template used by the renderer to display the document correctly.
     *
     * Maps to "renderMethod[0].templateName"
     */
    templateName: string;
  }) => {
    const parsedResults = EmbeddedRendererProps.safeParse(props);
    if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);
    const { rendererUrl, templateName } = parsedResults.data;

    const renderMethod = [
      {
        id: rendererUrl,
        type: "OpenAttestationEmbeddedRenderer",
        templateName,
      },
    ] satisfies V4Document["renderMethod"];
    this.setState("renderMethod", renderMethod);

    return this.REVOCATION_METHODS;
  };

  /**
   * Renders the document using an SVG handlebar template, either embedded directly or hosted remotely.
   * The root object of the handlebar template corresponds to the credentialSubject of the document.
   * For instance, if the document credentialSubject is { name: "John Doe" },
   * the handlebar template should reference the name as {{name}} to correctly map data fields.
   *
   * Sets "renderMethod[0].type" to "SvgRenderingTemplate2023"
   */
  public svgRenderer = (
    props:
      | {
          type: "REMOTE";
          /**
           * A URL that dereferences to an SVG handlebar template with an associated image/svg+xml media type.
           *
           * Maps to "renderMethod[0].id"
           */
          svgUrl: string;
          /**
           * An optional multibase-encoded multihash of the SVG image. The multibase value MUST be z and the multihash value MUST be SHA-2 with 256-bits of output (0x12).
           *
           * Maps to "renderMethod[0].digestMultibase"
           */
          digestMultibase?: string;
        }
      | {
          type: "EMBEDDED";
          /**
           * Directly provided SVG handlebar template content.
           *
           * Maps to "renderMethod[0].id"
           */
          svgTemplate: string;
        }
  ) => {
    const parsedResults = SvgRendererProps.safeParse(props);
    if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);

    const renderMethod =
      parsedResults.data.type === "EMBEDDED"
        ? [
            {
              id: parsedResults.data.svgTemplate,
              type: "SvgRenderingTemplate2023" as const,
            },
          ]
        : ([
            {
              id: parsedResults.data.svgUrl,
              type: "SvgRenderingTemplate2023" as const,
              digestMultibase: parsedResults.data.digestMultibase,
            },
          ] satisfies V4Document["renderMethod"]);
    this.setState("renderMethod", renderMethod);

    return this.REVOCATION_METHODS;
  };

  /**
   * Disables rendering for the document.
   */
  public noRenderer = () => {
    this.setState("renderMethod", undefined);
    return this.REVOCATION_METHODS;
  };
}

type SignedReturn<Props extends DocumentProps | DocumentProps[]> = Props extends Array<DocumentProps>
  ? Override<
      V4SignedWrappedDocument,
      {
        name: Props[number]["name"];
        credentialSubject: Props[number]["credentialSubject"];
      }
    >[]
  : Props extends DocumentProps
  ? Override<
      V4SignedWrappedDocument,
      {
        name: Props["name"];
        credentialSubject: Props["credentialSubject"];
      }
    >
  : never;

type WrappedReturn<Props extends DocumentProps | DocumentProps[]> = Props extends Array<DocumentProps>
  ? Override<
      V4WrappedDocument,
      {
        name: Props[number]["name"];
        credentialSubject: Props[number]["credentialSubject"];
      }
    >[]
  : Props extends DocumentProps
  ? Override<
      V4WrappedDocument,
      {
        name: Props["name"];
        credentialSubject: Props["credentialSubject"];
      }
    >
  : never;

const { UnableToInterpretContextError } = wrapDocumentErrors;
const { CouldNotSignDocumentError } = signDocumentErrors;
export const DocumentBuilderErrors = {
  PropsValidationError,
  ShouldNotModifyAfterSettingError,
  UnableToInterpretContextError,
  CouldNotSignDocumentError,
};
