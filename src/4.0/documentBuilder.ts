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

const SingleDocumentProps = z.object({
  name: V4Document.shape.name.unwrap(),
  content: z.record(z.unknown()),
  attachments: V4Document.shape.attachments,
});

const DocumentProps = z.union([SingleDocumentProps, z.array(SingleDocumentProps)]);

const OscpRevocationProps = z.object({
  oscpUrl: V4Document.shape.credentialStatus.unwrap().shape.id,
});

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

type State = {
  documentMainProps: DocumentProps | DocumentProps[];
  renderMethod: V4Document["renderMethod"];
  issuer: V4Document["issuer"] | undefined;
  credentialStatus: V4Document["credentialStatus"];
};

/**
 * A builder to simplify the creation of OAv4 document(s)
 * This builder assumes that All documents share the same issuer, renderMethod and credentialStatus
 * If this builder cannot satisfy your use case, please use the underlying wrap and sign functions directly
 */
export class DocumentBuilder<Props extends DocumentProps | DocumentProps[]> {
  private getState: () => State;
  private setState: <Key extends keyof State>(key: Key, value: Pick<State, Key>[Key]) => void;
  constructor(props: Props) {
    const parsedResults = DocumentProps.safeParse(props);
    if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);

    // state is defined here as opposed to the instance so that any modification
    // has to go through the setState function
    const state: State = {
      documentMainProps: parsedResults.data,
      renderMethod: undefined,
      issuer: undefined,
      credentialStatus: undefined,
    };

    // for immutability
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
            renderMethod,
            ...(attachments && { attachments }),
            ...(credentialStatus && { credentialStatus }),
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
      renderMethod,
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

    dnsTxtIssuance: (props: {
      /** A unique ID of the issuer that MUST BE in a URI */
      issuerId: string;
      /** Human readable name of the issuer */
      issuerName: string;
      /** Domain where DNS TXT record proof is located */
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
  } satisfies Record<`${string}Issuance`, (...args: any[]) => any>;

  private REVOCATION_METHODS = {
    /**
     * The document(s) can never be revoked
     */
    noRevocation: () => {
      this.setState("credentialStatus", undefined);

      return this.ISSUANCE_METHODS;
    },
    /**
     * The document(s) can be revoked using an OCSP responder
     */
    oscpRevocation: (props: { oscpUrl: string }) => {
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
     * The document(s) can be revoked using via a document store (smart contract)
     */
    documentStoreRevocation: () => {
      // TODO: implement this
      throw new Error("Not implemented");
    },
  } satisfies Record<`${string}Revocation`, (...args: any[]) => typeof this.ISSUANCE_METHODS>;

  public embeddedRenderer = (props: {
    /** URL where the renderer is hosted  */
    rendererUrl: string;
    /** Template identifier to "select" the correct template on the renderer */
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

  public svgRenderer = (props: { urlOrEmbeddedSvg: string }) => {
    const parsedResults = SvgRendererProps.safeParse(props);
    if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);
    const { urlOrEmbeddedSvg } = parsedResults.data;

    const renderMethod = [
      {
        id: urlOrEmbeddedSvg,
        type: "SvgRenderingTemplate2023",
      },
    ] satisfies V4Document["renderMethod"];
    this.setState("renderMethod", renderMethod);

    return this.REVOCATION_METHODS;
  };
}

type SignedReturn<Props extends DocumentProps | DocumentProps[]> = Props extends Array<DocumentProps>
  ? Override<
      V4SignedWrappedDocument,
      {
        name: Props[number]["name"];
        credentialSubject: Props[number]["content"];
      }
    >[]
  : Props extends DocumentProps
  ? Override<
      V4SignedWrappedDocument,
      {
        name: Props["name"];
        credentialSubject: Props["content"];
      }
    >
  : never;

type WrappedReturn<Props extends DocumentProps | DocumentProps[]> = Props extends Array<DocumentProps>
  ? Override<
      V4WrappedDocument,
      {
        name: Props[number]["name"];
        credentialSubject: Props[number]["content"];
      }
    >[]
  : Props extends DocumentProps
  ? Override<
      V4WrappedDocument,
      {
        name: Props["name"];
        credentialSubject: Props["content"];
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
