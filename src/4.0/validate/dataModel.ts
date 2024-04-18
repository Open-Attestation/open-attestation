import Joi from "joi";
import z from "zod";

import { ContextUrl as baseContext } from "../../shared/@types/document";

const baseType = "VerifiableCredential";

export const joiSchema = Joi.object({
  // "@context": Joi.alternatives()
  //   .try(Joi.object())
  //   .try(Joi.string())
  //   // If array: First item must be baseContext, while remaining items can be string or object
  //   .try(Joi.array().ordered(Joi.string().valid(baseContext["v2_vc"]).required()).items(Joi.string(), Joi.object()))
  //   .required(),
  // [Optional] If string: Must match uri pattern
  // id: Joi.string().uri(),
  // type: Joi.alternatives()
  //   .try(Joi.string())
  //   // If array: Must have VerifiableCredential, while remaining items can be any string
  //   .try(Joi.array().items(Joi.string().valid(baseType).required(), Joi.string()))
  //   .required(),
  // credentialSchema: Joi.alternatives()
  //   // If object: Must have id match uri pattern and type defined
  //   .try(Joi.object({ id: Joi.string().uri().required(), type: Joi.string().required() }))
  //   // If array: Every object must have id match uri pattern and type defined
  //   .try(Joi.array().items({ id: Joi.string().uri().required(), type: Joi.string().required() })),
  // issuer: Joi.alternatives()
  //   // If string: Must match uri pattern
  //   .try(Joi.string().uri())
  //   // If object: Must have id match uri pattern
  //   .try(Joi.object({ id: Joi.string().uri() }).unknown())
  //   .required(),
  // validFrom: Joi.string().isoDate(),
  // validUntil: Joi.string().isoDate(),
  // credentialSubject: Joi.alternatives()
  //   // If object: Cannot be empty (i.e. minimum 1 key)
  //   .try(Joi.object().min(1))
  //   // If array: Every object cannot be empty (i.e. minimum 1 key)
  //   .try(Joi.array().items(Joi.object().min(1)))
  //   .required(),
  // credentialStatus:
  //   // Must have type defined
  //   // If id is present, id must match uri pattern (credentialStatus.id is optional and can be undefined)
  //   Joi.object({ id: Joi.string().uri().optional(), type: Joi.string().required() })
  //     // Allow additional properties
  //     .unknown(),
  // termsOfUse: Joi.alternatives()
  //   // If object: Must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
  //   .try(Joi.object({ id: Joi.string().uri().optional(), type: Joi.string().required() }))
  //   // If array: Every object must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
  //   .try(Joi.array().items({ id: Joi.string().uri().optional(), type: Joi.string().required() })),
  // evidence: Joi.alternatives()
  //   // If object: Must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
  //   .try(Joi.object({ id: Joi.string().uri().optional(), type: Joi.string().required() }))
  //   // If array: Every object must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
  //   .try(Joi.array().items({ id: Joi.string().uri().optional(), type: Joi.string().required() })),
  // proof: Joi.alternatives()
  //   // If object: Must have type defined
  //   .try(Joi.object({ type: Joi.string().required() }))
  //   // If array: Every object must have type defined
  //   .try(Joi.array().items({ type: Joi.string().required() })),
})
  // Allow additional properties
  .unknown();

const URI_REGEX =
  /^(?=.)(?!https?:\/(?:$|[^/]))(?!https?:\/\/\/)(?!https?:[^/])(?:[a-zA-Z][a-zA-Z\d+-\.]*:(?:(?:\/\/(?:[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:]*@)?(?:\[(?:(?:(?:[\dA-Fa-f]{1,4}:){6}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|::(?:[\dA-Fa-f]{1,4}:){5}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){4}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,1}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){3}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,2}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:){2}(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,3}[\dA-Fa-f]{1,4})?::[\dA-Fa-f]{1,4}:(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,4}[\dA-Fa-f]{1,4})?::(?:[\dA-Fa-f]{1,4}:[\dA-Fa-f]{1,4}|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(?:(?:[\dA-Fa-f]{1,4}:){0,5}[\dA-Fa-f]{1,4})?::[\dA-Fa-f]{1,4}|(?:(?:[\dA-Fa-f]{1,4}:){0,6}[\dA-Fa-f]{1,4})?::)|v[\dA-Fa-f]+\.[\w-\.~!\$&'\(\)\*\+,;=:]+)\]|(?:(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(?:0{0,2}\d|0?[1-9]\d|1\d\d|2[0-4]\d|25[0-5])|[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=]{1,255})(?::\d*)?(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)|\/(?:[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]+(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)?|[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]+(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*|(?:\/\/\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*(?:\/[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@]*)*)))(?:\?[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@\/\?]*(?=#|$))?(?:#[\w-\.~%\dA-Fa-f!\$&'\(\)\*\+,;=:@\/\?]*)?$/;
const zodUri = z.string().refine((value: string) => URI_REGEX.test(value), { message: "Invalid URI" });
export const zodSchema = z.object({
  "@context": z.union([
    z.record(z.any()),
    z.string(),
    // If array: First item must be baseContext, while remaining items can be string or object
    z.tuple([z.literal(baseContext.v2_vc)]).rest(z.union([z.string(), z.record(z.any())])),
  ]),

  id: zodUri.optional(),

  type: z.union([
    z.string(),
    // If array: Must have VerifiableCredential, while remaining items can be any string
    z.array(z.string()).refine((types) => types.includes(baseType), { message: `Type must include ${baseType}` }),
  ]),

  credentialSchema: z
    .union([
      // If object: Must have id match uri pattern and type defined
      z.object({
        id: zodUri,
        type: z.string(),
      }),
      // If array: Every object must have id match uri pattern and type defined
      z.array(
        z.object({
          id: zodUri,
          type: z.string(),
        })
      ),
    ])
    .optional(),

  issuer: z.union([
    // If string: Must match uri pattern
    zodUri,
    // If object: Must have id match uri pattern
    z.object({
      id: zodUri,
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

  // Must have type defined
  // If id is present, id must match uri pattern (credentialStatus.id is optional and can be undefined)
  credentialStatus: z
    .object({
      id: zodUri.optional(),
      type: z.string(),
    })
    .optional(),

  termsOfUse: z
    .union([
      // If object: Must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
      z.object({
        id: zodUri.optional(),
        type: z.string(),
      }),
      // If array: Every object must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
      z.array(
        z.object({
          id: zodUri.optional(),
          type: z.string(),
        })
      ),
    ])
    .optional(),

  evidence: z
    .union([
      // If object: Must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
      z.object({
        id: zodUri.optional(),
        type: z.string(),
      }),
      // If array: Every object must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
      z.array(
        z.object({
          id: zodUri.optional(),
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

export const vcSchema = {
  validate: (document: any) => {
    const { error } = joiSchema.validate(document);
    if (error) {
      return { error };
    }

    const result = zodSchema.safeParse(document);
    if (!result.success) {
      return {
        error: { details: result.error },
      };
    }

    return {
      error: undefined,
    };
  },
};
