import z from "zod";
import { ContextUrl, ContextType } from "./context";

const baseType = "VerifiableCredential";

// Custom URI validation function
const URI_REGEX =
  /^(?=.)(?!https?:\/(?:$|[^/]))(?!https?:\/\/\/)(?!https?:[^/])(?:[a-zA-Z][a-zA-Z\d+-\.]*:(?:(?:\/\/(?:[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:]*@)?(?:\[(?:(?:(?:[\dA-Fa-f]{1,4}:){6}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|::(?:[\dA-Fa-f]{1,4}:){5}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){4}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,1}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){3}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,2}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){2}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,3}[\dA-Fa-f]{1,4})?::[\dA-Fa-f]{1,4}:(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,4}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,5}[\dA-Fa-f]{1,4})?::[\dA-Fa-f]{1,4}|(?:(?:[\dA-Fa-f]{1,4}:){0,6}[\dA-Fa-f]{1,4})?::)|v[\dA-Fa-f]+\.[\w-\.~!\$&'\(\)\*\+,;=:]+)\]|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])|[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=]{1,255})(?::\d*)?(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)|\/(?:[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]+(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)?|[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]+(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*|(?:\/\/\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)))(?:\?[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@\/\?]*(?=#|$))?(?:#[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@\/\?]*)?$/;
const ZodUri = z.string().regex(URI_REGEX, { message: "Invalid URI" });

const W3cVcDataModel = z.object({
  "@context": z.union([
    z.record(z.any()),
    z.string(),
    // If array: First item must be baseContext, while remaining items can be string or object
    z.tuple([z.literal(ContextUrl.v2_vc)]).rest(z.union([z.string(), z.record(z.any())])),
  ]),

  // [Optional] If string: Must match uri pattern
  id: ZodUri.optional(),

  type: z.union([
    z.string(),
    // If array: Must have VerifiableCredential, while remaining items can be any string
    z.array(z.string()).refine((types) => types.includes(baseType), { message: `Type must include ${baseType}` }),
  ]),

  credentialSchema: z
    .union([
      // If object: Must have id match uri pattern and type defined
      z.object({
        id: ZodUri,
        type: z.string(),
      }),
      // If array: Every object must have id match uri pattern and type defined
      z.array(
        z.object({
          id: ZodUri,
          type: z.string(),
        })
      ),
    ])
    .optional(),

  issuer: z.union([
    // If string: Must match uri pattern
    ZodUri,
    // If object: Must have id match uri pattern
    z.object({
      id: ZodUri,
    }),
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
      id: ZodUri.optional(),
      // Must have type defined
      type: z.string(),
    })
    .optional(),

  termsOfUse: z
    .union([
      // If object: Must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
      z.object({
        id: ZodUri.optional(),
        type: z.string(),
      }),
      // If array: Every object must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
      z.array(
        z.object({
          id: ZodUri.optional(),
          type: z.string(),
        })
      ),
    ])
    .optional(),

  evidence: z
    .union([
      // If object: Must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
      z.object({
        id: ZodUri.optional(),
        type: z.string(),
      }),
      // If array: Every object must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
      z.array(
        z.object({
          id: ZodUri.optional(),
          type: z.string(),
        })
      ),
    ])
    .optional(),

  proof: z
    .union([
      // If object: Must have type defined
      z.object({
        type: z.string(),
      }),
      // If array: Every object must have type defined
      z.array(
        z.object({
          type: z.string(),
        })
      ),
    ])
    .optional(),
});

const IdentityProofType = z.union([z.literal("DNS-TXT"), z.literal("DNS-DID"), z.literal("DID")]);
type IdentityProofType = z.infer<typeof IdentityProofType>;

const Salt = z.object({ value: z.string(), path: z.string() });
type Salt = z.infer<typeof Salt>;

// Custom hex string validation function
const HEX_STRING_REGEX = /^(0x)?[0-9a-fA-F]{40}$/;
const ZodHexString = z.string().regex(HEX_STRING_REGEX, { message: "Invalid Hex String" });

const V4RawDocument = W3cVcDataModel.extend({
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
    id: ZodUri,
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
type VC = z.infer<typeof W3cVcDataModel>;
type V4RawDocument = z.infer<typeof V4RawDocument>;

const WrappedProof = z.object({
  type: z.literal("OpenAttestationMerkleProofSignature2018"),
  proofPurpose: z.literal("assertionMethod"),
  targetHash: ZodHexString,
  proofs: z.array(ZodHexString),
  merkleRoot: ZodHexString,
  salts: z.string(),
  privacy: z.object({ obfuscated: z.array(ZodHexString) }),
});

const WrappedSignedProof = WrappedProof.and(
  z.object({
    key: z.string(),
    signature: z.string(),
  })
);

const V4WrappedDocument = V4RawDocument.extend({
  proof: WrappedProof,
});

const V4SignedDocument = V4RawDocument.extend({
  proof: WrappedSignedProof,
});

type V4WrappedDocument<
  T extends V4RawDocument = V4RawDocument,
  U extends z.infer<typeof V4WrappedDocument> = Override<
    T,
    {
      proof: z.infer<typeof WrappedProof>;
    }
  >
> = U;

type V4SignedDocument<
  T extends V4RawDocument = V4RawDocument,
  U extends z.infer<typeof V4SignedDocument> = Override<
    T,
    {
      proof: z.infer<typeof WrappedSignedProof>;
    }
  >
> = U;

// a & b does not override a props with b props
type Override<T extends Record<string, unknown>, U extends Record<string, unknown>> = Omit<T, keyof U> & U;

export { VC, V4RawDocument, V4WrappedDocument, V4SignedDocument, Salt, W3cVcDataModel };
