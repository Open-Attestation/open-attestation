import z from "zod";

// import { OpenAttestationDocument as OpenAttestationDocumentV4, ProofPurpose } from "../__generated__/schema.4.0";
import { vcDataModel, zodUri } from "./validate/dataModel";
import { ContextUrl, ContextType, OpenAttestationHexString, SignatureAlgorithm } from "../shared/@types/document";

const IdentityProofType = z.enum(["DNS-TXT", "DNS-DID", "DID"]);
type IdentityProofType = z.infer<typeof IdentityProofType>;

const Salt = z.object({ value: z.string(), path: z.string() });
type Salt = z.infer<typeof Salt>;

// Custom hex string validation function
const HEX_STRING_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
const zodHexString = z.string().regex(HEX_STRING_REGEX, { message: "Invalid Hex String" });

const OpenAttestationVC = vcDataModel.extend({
  "@context": z
    // Must be an array that starts with [baseContext, v4Context, ...]
    .tuple([z.literal(ContextUrl.v2_vc), z.literal(ContextUrl.v4_alpha)])
    // Remaining items can be string or object
    .rest(z.union([z.string(), z.record(z.any())])),

  type: z
    // Must be an array that starts with [VerifiableCredential, OpenAttestationCredential, ...]
    .tuple([z.literal(ContextType.BaseContext as string), z.literal(ContextType.V4AlphaContext as string)])
    // Remaining items can be string
    .rest(z.string()),

  issuer: z.object({
    // Must have id match uri pattern
    id: zodUri,
    type: z.literal("OpenAttestationIssuer"),
    name: z.string(),
    identityProof: z.object({
      identityProofType: IdentityProofType,
      identifier: z.string(),
    }),
  }),

  // [Optional] OCSP Revocation
  credentialStatus: z
    .object({
      // Must have id match url pattern (OCSP endpoint)
      id: z.string().url(),
      type: z.literal("OpenAttestationOcspResponder"),
    })
    .optional(),

  // [Optional] Render Method
  renderMethod: z
    .array(
      z.discriminatedUnion("type", [
        /* OA Decentralised Embedded Renderer */
        z.object({
          // Must have id match url pattern
          id: z.string().url(),
          type: z.literal("OpenAttestationEmbeddedRenderer"),
          templateName: z.string(),
        }),
        /* SVG Renderer (URL or Embedded) */
        z.object({
          // Must have id match url pattern or embeded SVG string
          id: z.union([z.string(), z.string().url()]),
          type: z.literal("SvgRenderingTemplate2023"),
          name: z.string(),
          digestMultibase: z.string(),
        }),
      ])
    )
    .optional(),
});
type VC = z.infer<typeof vcDataModel>;
type OpenAttestationVC = z.infer<typeof OpenAttestationVC>;

const WrappedProof = z.object({
  type: z.literal("OpenAttestationMerkleProofSignature2018"),
  proofPurpose: z.literal("assertionMethod"),
  targetHash: zodHexString,
  proofs: z.array(zodHexString),
  merkleRoot: zodHexString,
  salts: z.string(),
  privacy: z.object({ obfuscated: z.array(zodHexString) }),
});

const WrappedSignedProof = WrappedProof.and(
  z.object({
    key: z.string(),
    signature: z.string(),
  })
);

type WrappedOpenAttestationVC<T extends OpenAttestationVC = OpenAttestationVC> = T & {
  proof: z.infer<typeof WrappedProof>;
};

type WrappedSignedOpenAttestationVC<T extends OpenAttestationVC = OpenAttestationVC> = T & {
  proof: z.infer<typeof WrappedSignedProof>;
};

export { VC, OpenAttestationVC, WrappedOpenAttestationVC, WrappedSignedOpenAttestationVC, Salt };
