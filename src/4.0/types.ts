import z from "zod";
import { ContextUrl, ContextType } from "../shared/@types/document";

const BASE_TYPE = "VerifiableCredential" as const;

// Custom URI validation function
const URI_REGEX =
  /^(?=.)(?!https?:\/(?:$|[^/]))(?!https?:\/\/\/)(?!https?:[^/])(?:[a-zA-Z][a-zA-Z\d+-\.]*:(?:(?:\/\/(?:[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:]*@)?(?:\[(?:(?:(?:[\dA-Fa-f]{1,4}:){6}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|::(?:[\dA-Fa-f]{1,4}:){5}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){4}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,1}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){3}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,2}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){2}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,3}[\dA-Fa-f]{1,4})?::[\dA-Fa-f]{1,4}:(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,4}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,5}[\dA-Fa-f]{1,4})?::[\dA-Fa-f]{1,4}|(?:(?:[\dA-Fa-f]{1,4}:){0,6}[\dA-Fa-f]{1,4})?::)|v[\dA-Fa-f]+\.[\w-\.~!\$&'\(\)\*\+,;=:]+)\]|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])|[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=]{1,255})(?::\d*)?(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)|\/(?:[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]+(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)?|[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]+(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*|(?:\/\/\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)))(?:\?[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@\/\?]*(?=#|$))?(?:#[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@\/\?]*)?$/;
const Uri = z.string().regex(URI_REGEX, { message: "Invalid URI" });

export const W3cVerifiableCredential = z.object({
  "@context": z.union([
    z.record(z.any()),
    z.string(),
    // If array: First item must be baseContext, while remaining items can be string or object
    z.tuple([z.literal(ContextUrl.v2_vc)]).rest(z.union([z.string(), z.record(z.any())])),
  ]),

  // [Optional]
  name: z.string().optional(),

  // [Optional] If string: Must match uri pattern
  id: Uri.optional(),

  type: z.union([
    z.string(),
    // If array: Must have VerifiableCredential, while remaining items can be any string
    z.array(z.string()).refine((types) => types.includes(BASE_TYPE), { message: `Type must include ${BASE_TYPE}` }),
  ]),

  credentialSchema: z
    .union([
      // If object: Must have id match uri pattern and type defined
      z
        .object({
          id: Uri,
          type: z.string(),
        })
        .passthrough(),
      // If array: Every object must have id match uri pattern and type defined
      z.array(
        z
          .object({
            id: Uri,
            type: z.string(),
          })
          .passthrough()
      ),
    ])
    .optional(),

  issuer: z.union([
    // If string: Must match uri pattern
    Uri,
    // If object: Must have id match uri pattern
    z
      .object({
        id: Uri,
      })
      .passthrough(),
  ]),

  validFrom: z.string().datetime({ offset: true }).optional(),

  validUntil: z.string().datetime({ offset: true }).optional(),

  credentialSubject: z.union([
    // If object: Cannot be empty (i.e. minimum 1 key)
    z.record(z.any()).refine((obj) => Object.keys(obj).length > 0, {
      message: "Must have at least one key",
    }),
    // If array: Every object cannot be empty (i.e. minimum 1 key)
    z.array(
      z.record(z.any()).refine((obj) => Object.keys(obj).length > 0, {
        message: "Must have at least one key",
      })
    ),
  ]),

  credentialStatus: z
    .object({
      // If id is present, id must match uri pattern (credentialStatus.id is optional and can be undefined)
      id: Uri.optional(),
      // Must have type defined
      type: z.string(),
    })
    .passthrough()
    .optional(),

  // [Optional] This is at risk of being removed from the w3c spec
  renderMethod: z.any().optional(),

  termsOfUse: z
    .union([
      // If object: Must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
      z
        .object({
          id: Uri.optional(),
          type: z.string(),
        })
        .passthrough(),
      // If array: Every object must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
      z.array(
        z
          .object({
            id: Uri.optional(),
            type: z.string(),
          })
          .passthrough()
      ),
    ])
    .optional(),

  evidence: z
    .union([
      // If object: Must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
      z
        .object({
          id: Uri.optional(),
          type: z.string(),
        })
        .passthrough(),
      // If array: Every object must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
      z.array(
        z
          .object({
            id: Uri.optional(),
            type: z.string(),
          })
          .passthrough()
      ),
    ])
    .optional(),

  proof: z
    .union([
      // If object: Must have type defined
      z
        .object({
          type: z.string(),
        })
        .passthrough(),
      // If array: Every object must have type defined
      z.array(
        z
          .object({
            type: z.string(),
          })
          .passthrough()
      ),
    ])
    .optional(),
});

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

export type W3cVerifiableCredential = z.infer<typeof W3cVerifiableCredential>;

// AssertStricterOrEqual is used to ensure that we have zod extended from the base type while
// still being assignable to the base type. For example, if we accidentally extend and
// replaced '@context' to a boolean, this would fail the assertion.
export type V4Document = AssertStricterOrEqual<W3cVerifiableCredential, z.infer<typeof V4Document>>;

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
