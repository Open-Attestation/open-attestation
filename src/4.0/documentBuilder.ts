import { wrapDocument, wrapDocuments, wrapDocumentErrors } from "./wrap";
import { signDocument, signDocumentErrors } from "./sign";
import {
  DecentralisedEmbeddedRenderer,
  Override,
  SvgRenderer,
  V4Document,
  V4SignedWrappedDocument,
  V4WrappedDocument,
} from "./types";

import { ZodError, z } from "zod";

const EmbeddedRendererProps = z.object({
  rendererUrl: DecentralisedEmbeddedRenderer.shape.id,
  templateName: DecentralisedEmbeddedRenderer.shape.templateName,
});

const SvgRendererProps = z.object({
  urlOrEmbeddedSvg: SvgRenderer.shape.id,
});

const DnsTextIssuanceProps = z.object({
  issuerId: V4Document.shape.issuer.shape.id,
  issuerName: V4Document.shape.issuer.shape.name,
  identityProofDomain: V4Document.shape.issuer.shape.identityProof.shape.identifier,
});

class PropsValidationError extends Error {
  constructor(public error: ZodError) {
    super(`Invalid props: \n ${JSON.stringify(error.format(), null, 2)}`);
    Object.setPrototypeOf(this, PropsValidationError.prototype);
  }
}

class ShouldNotModifyAfterSettingError extends Error {
  constructor() {
    super("Modifying what was already set can lead to unexpected behaviour, please consider creating a new instance");
    Object.setPrototypeOf(this, ShouldNotModifyAfterSettingError.prototype);
  }
}

type DocumentProps = {
  /** Human readable name of the document */
  name: string;
  /** Main content of the document */
  content: Record<string, unknown>;
  /** Attachments that will be rendered out of the box with decentralised renderer components */
  attachments?: V4Document["attachments"];
};

/**
 * A builder to simplify the creation of OAv4 document(s)
 * This builder assumes that All documents share the same issuer AND renderMethod
 * If this builder cannot satisfy your use case, please use the underlying wrap and sign functions directly
 */
export class DocumentBuilder<Props extends DocumentProps | DocumentProps[]> {
  private documentMainProps: DocumentProps | DocumentProps[];
  private renderMethod: V4Document["renderMethod"];
  private issuer: V4Document["issuer"] | undefined;

  constructor(props: Props) {
    this.documentMainProps = props;
  }

  private wrap = async (): Promise<WrappedReturn<Props>> => {
    const data = this.documentMainProps;
    const issuer = this.issuer;

    // this should never happen
    if (!issuer) throw new Error("Issuer is required");
    if (Array.isArray(data)) {
      const toWrap = data.map(
        ({ name, content, attachments }) =>
          ({
            "@context": [
              "https://www.w3.org/ns/credentials/v2",
              "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
            ],
            type: ["VerifiableCredential", "OpenAttestationCredential"],
            issuer,
            name,
            credentialSubject: content,
            renderMethod: this.renderMethod,
            ...(attachments && { attachments }),
          } satisfies V4Document)
      );

      return wrapDocuments(toWrap) as unknown as WrappedReturn<Props>;
    }

    // this should never happen
    if (!data) throw new Error("CredentialSubject is required");

    const { name, content, attachments } = data;
    return wrapDocument({
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://schemata.openattestation.com/com/openattestation/4.0/alpha-context.json",
      ],
      type: ["VerifiableCredential", "OpenAttestationCredential"],
      issuer,
      name,
      credentialSubject: content,
      renderMethod: this.renderMethod,
      ...(attachments && { attachments }),
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

    dnsTxtIssuance: (props: {
      /** A unique ID of the issuer that MUST BE in a URI */
      issuerId: string;
      /** Human readable name of the issuer */
      issuerName: string;
      /** Domain where DNS TXT record proof is located */
      identityProofDomain: string;
    }) => {
      if (this.issuer) throw new ShouldNotModifyAfterSettingError();

      const parsedResults = DnsTextIssuanceProps.safeParse(props);
      if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);
      const { issuerId, issuerName, identityProofDomain } = parsedResults.data;

      this.issuer = {
        id: issuerId,
        name: issuerName,
        type: "OpenAttestationIssuer",
        identityProof: {
          identityProofType: "DNS-TXT",
          identifier: identityProofDomain,
        },
      };

      return {
        /**
         * wrap and signs the entire batch AT ONE GO, there is no internal batching
         * logic so please use with caution, especially for large batches
         */
        wrapAndSign: this.sign,
        /**
         * there are instances where you want to take control of the signing process
         * for example you might want to sign in smaller batches
         */
        justWrapWithoutSigning: this.wrap,
      };
    },
  };

  public embeddedRenderer = (props: {
    /** URL where the renderer is hosted  */
    rendererUrl: string;
    /** Template identifier to "select" the correct template on the renderer */
    templateName: string;
  }) => {
    if (this.renderMethod) throw new ShouldNotModifyAfterSettingError();

    const parsedResults = EmbeddedRendererProps.safeParse(props);
    if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);
    const { rendererUrl, templateName } = parsedResults.data;

    this.renderMethod = [
      {
        id: rendererUrl,
        type: "OpenAttestationEmbeddedRenderer",
        templateName,
      },
    ];

    return this.ISSUANCE_METHODS;
  };

  public svgRenderer = (props: { urlOrEmbeddedSvg: string }) => {
    if (this.renderMethod) throw new ShouldNotModifyAfterSettingError();

    const parsedResults = SvgRendererProps.safeParse(props);
    if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);
    const { urlOrEmbeddedSvg } = parsedResults.data;

    this.renderMethod = [
      {
        id: urlOrEmbeddedSvg,
        type: "SvgRenderingTemplate2023",
      },
    ];

    return this.ISSUANCE_METHODS;
  };
}

type SignedReturn<Data extends DocumentProps | DocumentProps[]> = Data extends Array<DocumentProps>
  ? Override<
      V4SignedWrappedDocument,
      {
        name: Data[number]["name"];
        credentialSubject: Data[number]["content"];
      }
    >[]
  : Data extends DocumentProps
  ? Override<
      V4SignedWrappedDocument,
      {
        name: Data["name"];
        credentialSubject: Data["content"];
      }
    >
  : never;

type WrappedReturn<Data extends DocumentProps | DocumentProps[]> = Data extends Array<DocumentProps>
  ? Override<
      V4WrappedDocument,
      {
        name: Data[number]["name"];
        credentialSubject: Data[number]["content"];
      }
    >[]
  : Data extends DocumentProps
  ? Override<
      V4WrappedDocument,
      {
        name: Data["name"];
        credentialSubject: Data["content"];
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
