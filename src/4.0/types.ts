import z from "zod";

import { W3cVerifiableCredential, Uri } from "./validate/dataModel";
import { ContextUrl, ContextType } from "../shared/@types/document";

const IdentityProofType = z.union([z.literal("DNS-TXT"), z.literal("DNS-DID"), z.literal("DID")]);
const Salt = z.object({ value: z.string(), path: z.string() });

// Custom hex string validation function
const HEX_STRING_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
const HexString = z.string().regex(HEX_STRING_REGEX, { message: "Invalid Hex String" });

export const V4Document = W3cVerifiableCredential.extend({
  "@context": z

    // Must be an array that starts with [baseContext, v4Context, ...]
    .tuple([z.literal(ContextUrl.v2_vc), z.literal(ContextUrl.v4_alpha)])
    // Remaining items can be string or object
    .rest(z.union([z.string(), z.record(z.any())])),

  type: z
    // Must be an array that starts with [VerifiableCredential, OpenAttestationCredential, ...]
    .tuple([z.literal(ContextType.BaseContext), z.literal(ContextType.V4AlphaContext)])
    // Remaining items can be string
    .rest(z.string()),

  issuer: z.object({
    // Must have id match uri pattern
    id: Uri,
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

const WrappedProof = z.object({
  type: z.literal("OpenAttestationMerkleProofSignature2018"),
  proofPurpose: z.literal("assertionMethod"),
  targetHash: HexString,
  proofs: z.array(HexString),
  merkleRoot: HexString,
  salts: z.string(),
  privacy: z.object({ obfuscated: z.array(HexString) }),
});
const WrappedDocumentExtrasShape = { proof: WrappedProof } as const;
export const V4WrappedDocument = V4Document.extend(WrappedDocumentExtrasShape);

const SignedWrappedProof = WrappedProof.and(
  z.object({
    key: z.string(),
    signature: z.string(),
  })
);
const SignedWrappedDocumentExtrasShape = { proof: SignedWrappedProof } as const;
export const V4SignedWrappedDocument = V4Document.extend(SignedWrappedDocumentExtrasShape);

export type VC = z.infer<typeof W3cVerifiableCredential>;

// AssertStricterOrEqual is used to ensure that we have zod extended from the base type while
// still being assignable to the base type. For example, if we accidentally extend and
// replaced '@context' to a boolean, this would fail the assertion.
export type V4Document = AssertStricterOrEqual<VC, z.infer<typeof V4Document>>;

export type V4WrappedDocument<T extends V4Document = V4Document> = Override<
  T,
  Pick<z.infer<typeof V4WrappedDocument>, keyof typeof WrappedDocumentExtrasShape>
>;

export type V4SignedWrappedDocument<T extends V4Document = V4Document> = Override<
  T,
  Pick<z.infer<typeof V4SignedWrappedDocument>, keyof typeof SignedWrappedDocumentExtrasShape>
>;

type IdentityProofType = z.infer<typeof IdentityProofType>;

export type Salt = z.infer<typeof Salt>;

/** Overrides properties in the Target (a & b does not override a props with b props) */
type Override<Target extends Record<string, unknown>, OverrideWith extends Record<string, unknown>> = Omit<
  Target,
  keyof OverrideWith
> &
  OverrideWith;

/** Used to assert that StricterType is a stricter or equal version of LooserType, and most importantly, that
 *  StricterType is STILL assignable to LooserType. */
type AssertStricterOrEqual<LooserType, StricterType> = StricterType extends LooserType ? StricterType : never;
