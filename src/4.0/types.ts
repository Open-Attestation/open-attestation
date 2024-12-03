import z from "zod";
import { ContextUrl, ContextType } from "./context";

// Custom URI validation function
const URI_REGEX =
  /^(?=.)(?!https?:\/(?:$|[^/]))(?!https?:\/\/\/)(?!https?:[^/])(?:[a-zA-Z][a-zA-Z\d+-\.]*:(?:(?:\/\/(?:[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:]*@)?(?:\[(?:(?:(?:[\dA-Fa-f]{1,4}:){6}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|::(?:[\dA-Fa-f]{1,4}:){5}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){4}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,1}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){3}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,2}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){2}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,3}[\dA-Fa-f]{1,4})?::[\dA-Fa-f]{1,4}:(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,4}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,5}[\dA-Fa-f]{1,4})?::[\dA-Fa-f]{1,4}|(?:(?:[\dA-Fa-f]{1,4}:){0,6}[\dA-Fa-f]{1,4})?::)|v[\dA-Fa-f]+\.[\w-\.~!\$&'\(\)\*\+,;=:]+)\]|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])|[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=]{1,255})(?::\d*)?(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)|\/(?:[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]+(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)?|[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]+(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*|(?:\/\/\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)))(?:\?[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@\/\?]*(?=#|$))?(?:#[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@\/\?]*)?$/;
const Uri = z.string().regex(URI_REGEX, { message: "Invalid URI" });
const ETHEREUM_ADDRESS_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
const EthereumAddress = z.string().regex(ETHEREUM_ADDRESS_REGEX, { message: "Invalid Ethereum address" });

const _W3cVerifiableCredential = z.object({
  "@context": z.union([
    z.record(z.any()),
    z.string(),
    // If array: First item must be baseContext, while remaining items can be string or object
    z.tuple([z.literal(ContextUrl.w3c_vc_v2)]).rest(z.union([z.string(), z.record(z.any())])),
  ]),

  // [Optional]
  name: z.string().optional(),

  // [Optional] If string: Must match uri pattern
  id: Uri.optional(),

  type: z.union([
    z.string(),
    // If array: Must have VerifiableCredential, while remaining items can be any string
    z.array(z.string()).refine((types) => types.includes(ContextType.BaseContext), {
      message: `Type must include ${ContextType.BaseContext}`,
    }),
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
// W3cVerifiableCredential should always allow extra root properties
export const W3cVerifiableCredential = _W3cVerifiableCredential.passthrough();

const IdentityProofType = z.union([z.literal("DNS-TXT"), z.literal("DNS-DID"), z.literal("DID")]);
const Salt = z.object({ value: z.string(), path: z.string() });

export const DecentralisedEmbeddedRenderer = z.object({
  // Must have id match url pattern
  id: z.string().url().describe("URL of a decentralised renderer to render this VC"),
  type: z.literal("OpenAttestationEmbeddedRenderer"),
  templateName: z.string(),
});

export const SvgRenderer = z.object({
  // Must have id match url pattern or embeded SVG string
  id: z
    .union([z.string(), z.string().url()])
    .describe(
      "A URL that dereferences to an SVG image [SVG] with an associated image/svg+xml media type. Or an embedded SVG image [SVG]"
    ),
  type: z.literal("SvgRenderingTemplate2023"),
  name: z.string().optional(),
  digestMultibase: z
    .string()
    .describe(
      "An optional multibase-encoded multihash of the SVG image. The multibase value MUST be z and the multihash value MUST be SHA-2 with 256-bits of output (0x12)."
    )
    .optional(),
});

export const OscpResponderRevocation = z.object({
  // Must have id match url pattern (OCSP endpoint)
  id: z.string().url().describe("URL of the OCSP responder endpoint"),
  type: z.literal("OpenAttestationOcspResponder"),
});

// [Optional] Attachments
export const Attachment = z.object({
  data: z.string().describe("Base64 encoding of this attachment"),
  filename: z.string().min(1).describe("Name of this attachment, with appropriate extensions"),
  mimeType: z.string().min(1).describe("Media type (or MIME type) of this attachment"),
});

export const RevocationStoreRevocation = z.object({
  id: EthereumAddress.describe("Ethereum address of the revocation store contract"),
  type: z.literal("OpenAttestationRevocationStore"),
});

export const OAVerifiableCredential = _W3cVerifiableCredential
  .extend({
    "@context": z

      // Must be an array that starts with [baseContext, v4Context, ...]
      .tuple([z.literal(ContextUrl.w3c_vc_v2), z.literal(ContextUrl.oa_vc_v4)])
      // Remaining items can be string or object
      .rest(z.union([z.string(), z.record(z.any())])),

    type: z
      // Must be an array that starts with [VerifiableCredential, OpenAttestationCredential, ...]
      .tuple([z.literal(ContextType.BaseContext), z.literal(ContextType.OAV4Context)])
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

    credentialSubject: z
      .object({
        attachments: z.array(Attachment).optional(),
      })
      .passthrough()
      .refine((obj) => Object.keys(obj).length > 0, {
        message: "Must have at least one key",
      }),

    // [Optional] Credential Status
    credentialStatus: z.discriminatedUnion("type", [OscpResponderRevocation, RevocationStoreRevocation]).optional(),

    // [Optional] Render Method
    renderMethod: z.array(z.discriminatedUnion("type", [DecentralisedEmbeddedRenderer, SvgRenderer])).optional(),
  })
  .strict();

const DigestedProof = z.object({
  type: z.literal("OpenAttestationHashProof2018"),
  proofPurpose: z.literal("assertionMethod"),
  targetHash: z.string(),
  proofs: z.array(z.string()),
  merkleRoot: z.string(),
  salts: z.string(),
  privacy: z.object({ obfuscated: z.array(z.string()) }),
});
const DigestedOAVerifiableCredentialExtrasShape = { proof: DigestedProof.passthrough() } as const;
// DigestedOAVerifiableCredential should never allow extra root properties
export const DigestedOAVerifiableCredential = OAVerifiableCredential.extend(
  DigestedOAVerifiableCredentialExtrasShape
).strict();

const SignedProof = DigestedProof.extend({ key: z.string(), signature: z.string() });
const SignedOAVerifiableCredentialExtrasShape = { proof: SignedProof } as const;
// SignedOAVerifiableCredential should never allow extra root properties
export const SignedOAVerifiableCredential = OAVerifiableCredential.extend(
  SignedOAVerifiableCredentialExtrasShape
).strict();

export type W3cVerifiableCredential = z.infer<typeof _W3cVerifiableCredential>;

// AssertStricterOrEqual is used to ensure that we have zod extended from the base type while
// still being assignable to the base type. For example, if we accidentally extend and
// replaced '@context' to a boolean, this would fail the assertion.
export type OAVerifiableCredential = AssertStricterOrEqual<
  W3cVerifiableCredential,
  z.infer<typeof OAVerifiableCredential>
>;

// export type VC<T extends OAVerifiableCredential | W3cVerifiableCredential> = T extends OAVerifiableCredential
//   ? OAVerifiableCredential
//   : T extends W3cVerifiableCredential
//   ? W3cVerifiableCredential
//   : T;

export type Digested<T extends OAVerifiableCredential | W3cVerifiableCredential = OAVerifiableCredential> = Override<
  T,
  Pick<z.infer<typeof DigestedOAVerifiableCredential>, keyof typeof DigestedOAVerifiableCredentialExtrasShape>
>;

export type Signed<T extends OAVerifiableCredential | W3cVerifiableCredential = OAVerifiableCredential> = Override<
  T,
  Pick<z.infer<typeof SignedOAVerifiableCredential>, keyof typeof SignedOAVerifiableCredentialExtrasShape>
>;

type IdentityProofType = z.infer<typeof IdentityProofType>;

export type Salt = z.infer<typeof Salt>;

// Utility types
/** Overrides properties in the Target (a & b does not override a props with b props) */
export type Override<Target extends Record<string, unknown>, OverrideWith extends Record<string, unknown>> = Omit<
  Target,
  keyof OverrideWith
> &
  OverrideWith;

/** Used to assert that StricterType is a stricter or equal version of LooserType, and most importantly, that
 *  StricterType is STILL assignable to LooserType. */
type AssertStricterOrEqual<LooserType, StricterType> = StricterType extends LooserType ? StricterType : never;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type NoExtraProperties<Reference, NewObj> = NewObj extends Reference & infer _ExtraProps ? Reference : NewObj;

export type PartialDeep<T> = T extends string | number | bigint | boolean | null | undefined | symbol | Date
  ? T | undefined
  : T extends Array<infer ArrayType>
  ? Array<PartialDeep<ArrayType>>
  : T extends ReadonlyArray<infer ArrayType>
  ? ReadonlyArray<ArrayType>
  : T extends Set<infer SetType>
  ? Set<PartialDeep<SetType>>
  : T extends ReadonlySet<infer SetType>
  ? ReadonlySet<SetType>
  : T extends Map<infer KeyType, infer ValueType>
  ? Map<PartialDeep<KeyType>, PartialDeep<ValueType>>
  : T extends ReadonlyMap<infer KeyType, infer ValueType>
  ? ReadonlyMap<PartialDeep<KeyType>, PartialDeep<ValueType>>
  : {
      [K in keyof T]?: PartialDeep<T[K]>;
    };

export const isOAVerifiableCredential = (vc: unknown): vc is OAVerifiableCredential => {
  return OAVerifiableCredential.safeParse(vc).success;
};

export const isDigestedOAVerifiableCredential = (vc: unknown): vc is Digested => {
  return DigestedOAVerifiableCredential.safeParse(vc).success;
};

export const isSignedOAVerifiableCredential = (vc: unknown): vc is Signed => {
  return SignedOAVerifiableCredential.safeParse(vc).success;
};
