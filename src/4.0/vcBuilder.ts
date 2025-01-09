import { digestVc, digestVcs, wrapVcErrors } from "./digest";
import { signVc, signVcErrors } from "./sign";
import {
  Override,
  DecentralisedEmbeddedRenderer,
  SvgRenderer,
  OscpResponderRevocation,
  RevocationStoreRevocation,
  OAVerifiableCredential,
  OASigned,
  UnsignedOADigested,
} from "./types";
import { ContextType, ContextUrl } from "./context";

import { ZodError, z } from "zod";

const SingleVcProps = z.object({
  name: OAVerifiableCredential.shape.name.unwrap(),
  credentialSubject: OAVerifiableCredential.shape.credentialSubject,
});

const VcProps = z.union([SingleVcProps, z.array(SingleVcProps)]);

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
  issuerId: OAVerifiableCredential.shape.issuer.shape.id,
  issuerName: OAVerifiableCredential.shape.issuer.shape.name,
  identityProofDomain: OAVerifiableCredential.shape.issuer.shape.identityProof.shape.identifier,
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

type VcProps = {
  /**
   * Human readable name of the VC.
   *
   * Maps to "name"
   */
  name: string;
  /**
   * Main content of the VC.
   *
   * Maps to "credentialSubject"
   */
  credentialSubject: z.infer<typeof OAVerifiableCredential.shape.credentialSubject>;
};

type State = {
  vcMainProps: VcProps | VcProps[];
  renderMethod: OAVerifiableCredential["renderMethod"];
  issuer: OAVerifiableCredential["issuer"] | undefined;
  credentialStatus: OAVerifiableCredential["credentialStatus"];
};

/**
 * A builder class to facilitate the creation of OpenAttestation v4 VCs.
 * Assumes a shared issuer, render method, and credential status across all VCs in batch mode.
 * For use cases requiring direct control, consider using the lower-level wrap and sign functions.
 */
export class VcBuilder<Props extends VcProps | VcProps[]> {
  private getState: () => State;
  private setState: <Key extends keyof State>(key: Key, value: Pick<State, Key>[Key]) => void;
  constructor(props: Props) {
    const parsedResults = VcProps.safeParse(props);
    if (!parsedResults.success) throw new PropsValidationError(parsedResults.error);

    // define state here rather than in the instance to enforce immutability via setState.
    const state: State = {
      vcMainProps: parsedResults.data,
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

  private digest = async (): Promise<DigestedReturn<Props>> => {
    const { vcMainProps: data, issuer, renderMethod, credentialStatus } = this.getState();

    // this should never happen
    if (!issuer) throw new Error("Issuer is required");
    if (Array.isArray(data)) {
      const toDigest = data.map(
        ({ name, credentialSubject }) =>
          ({
            "@context": [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4],
            type: [ContextType.BaseContext, ContextType.OAV4Context],
            issuer,
            name,
            credentialSubject,
            ...(renderMethod && { renderMethod }),
            ...(credentialStatus && { credentialStatus }),
          } satisfies OAVerifiableCredential)
      );

      return digestVcs(toDigest) as unknown as DigestedReturn<Props>;
    }

    // this should never happen
    if (!data) throw new Error("CredentialSubject is required");

    const { name, credentialSubject } = data;
    return digestVc({
      "@context": [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4],
      type: [ContextType.BaseContext, ContextType.OAV4Context],
      issuer,
      name,
      credentialSubject,
      ...(renderMethod && { renderMethod }),
      ...(credentialStatus && { credentialStatus }),
    }) as unknown as DigestedReturn<Props>;
  };

  private sign = async (props: { signer: Parameters<typeof signVc>[2] }): Promise<SignedReturn<Props>> => {
    const { vcMainProps: data, issuer, renderMethod, credentialStatus } = this.getState();

    // this should never happen
    if (!issuer) throw new Error("Issuer is required");
    if (Array.isArray(data)) {
      return Promise.all(
        data.map(({ name, credentialSubject }) =>
          signVc(
            {
              "@context": [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4],
              type: [ContextType.BaseContext, ContextType.OAV4Context],
              issuer,
              name,
              credentialSubject,
              ...(renderMethod && { renderMethod }),
              ...(credentialStatus && { credentialStatus }),
            } satisfies OAVerifiableCredential,
            "Secp256k1VerificationKey2018",
            props.signer
          )
        )
      ) as unknown as Promise<SignedReturn<Props>>;
    }

    const { name, credentialSubject } = data;
    return signVc(
      {
        "@context": [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4],
        type: [ContextType.BaseContext, ContextType.OAV4Context],
        issuer,
        name,
        credentialSubject,
        ...(renderMethod && { renderMethod }),
        ...(credentialStatus && { credentialStatus }),
      } satisfies OAVerifiableCredential,
      "Secp256k1VerificationKey2018",
      props.signer
    ) as unknown as SignedReturn<Props>;
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
     * The VC will be digitally signed, and identity proof will be provided via a DNS-TXT record.
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
      } satisfies OAVerifiableCredential["issuer"];
      this.setState("issuer", issuer);

      return {
        sign: this.sign,
        digest: this.digest,
      };
    },
  } satisfies Record<`${string}Issuance`, (...args: any[]) => any>;

  // add revocation methods here
  private REVOCATION_METHODS = {
    /**
     * The VC(s) will be issued without the capability for revocation; they remain valid indefinitely.
     */
    noRevocation: () => {
      this.setState("credentialStatus", undefined);

      return this.ISSUANCE_METHODS;
    },
    /**
     * The VC(s) can be revoked using an OCSP responder, allowing for the verification of the revocation status through the specified URL.
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
      } satisfies OAVerifiableCredential["credentialStatus"];
      this.setState("credentialStatus", credentialStatus);

      return this.ISSUANCE_METHODS;
    },
    /**
     * The VC(s) can be revoked using a revocation store, implemented as a smart contract on the Ethereum blockchain.
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
      } satisfies OAVerifiableCredential["credentialStatus"];

      this.setState("credentialStatus", credentialStatus);

      return this.ISSUANCE_METHODS;
    },
  } satisfies Record<`${string}Revocation`, (...args: any[]) => typeof this.ISSUANCE_METHODS>;

  /**
   * Configures the VC to be rendered using OpenAttestation's decentralized React components,
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
     * The identifier for the template used by the renderer to display the VC correctly.
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
    ] satisfies OAVerifiableCredential["renderMethod"];
    this.setState("renderMethod", renderMethod);

    return this.REVOCATION_METHODS;
  };

  /**
   * Renders the VC using an SVG handlebar template, either embedded directly or hosted remotely.
   * The root object of the handlebar template corresponds to the credentialSubject of the VC.
   * For instance, if the VC credentialSubject is { name: "John Doe" },
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
          ] satisfies OAVerifiableCredential["renderMethod"]);
    this.setState("renderMethod", renderMethod);

    return this.REVOCATION_METHODS;
  };

  /**
   * Disables rendering for the VC.
   */
  public noRenderer = () => {
    this.setState("renderMethod", undefined);
    return this.REVOCATION_METHODS;
  };
}

type SignedReturn<Props extends VcProps | VcProps[]> = Props extends Array<VcProps>
  ? Override<
      OASigned,
      {
        name: Props[number]["name"];
        credentialSubject: Props[number]["credentialSubject"];
      }
    >[]
  : Props extends VcProps
  ? Override<
      OASigned,
      {
        name: Props["name"];
        credentialSubject: Props["credentialSubject"];
      }
    >
  : never;

type DigestedReturn<Props extends VcProps | VcProps[]> = Props extends Array<VcProps>
  ? Override<
      UnsignedOADigested,
      {
        name: Props[number]["name"];
        credentialSubject: Props[number]["credentialSubject"];
      }
    >[]
  : Props extends VcProps
  ? Override<
      UnsignedOADigested,
      {
        name: Props["name"];
        credentialSubject: Props["credentialSubject"];
      }
    >
  : never;

const { UnableToInterpretContextError } = wrapVcErrors;
const { CouldNotSignVcError, VcProofNotEmptyError } = signVcErrors;
export const VcBuilderErrors = {
  PropsValidationError,
  ShouldNotModifyAfterSettingError,
  UnableToInterpretContextError,
  CouldNotSignVcError,
  VcProofNotEmptyError,
};
