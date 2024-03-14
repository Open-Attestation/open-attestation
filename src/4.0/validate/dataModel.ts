import Joi from "joi";

import { ContextUrl as baseContext } from "../../shared/@types/document";

const baseType = "VerifiableCredential";

export const vcSchema = Joi.object({
  "@context": Joi.alternatives()
    .try(Joi.object())
    .try(Joi.string())
    // If array: First item must be baseContext, while remaining items can be string or object
    .try(Joi.array().ordered(Joi.string().valid(baseContext["v2_vc"]).required()).items(Joi.string(), Joi.object()))
    .required(),

  // [Optional] If string: Must match uri pattern
  id: Joi.string().uri(),

  type: Joi.alternatives()
    .try(Joi.string())
    // If array: Must have VerifiableCredential, while remaining items can be any string
    .try(Joi.array().items(Joi.string().valid(baseType).required(), Joi.string()))
    .required(),

  credentialSchema: Joi.alternatives()
    // If object: Must have id match uri pattern and type defined
    .try(Joi.object({ id: Joi.string().uri().required(), type: Joi.string().required() }))
    // If array: Every object must have id match uri pattern and type defined
    .try(Joi.array().items({ id: Joi.string().uri().required(), type: Joi.string().required() })),

  issuer: Joi.alternatives()
    // If string: Must match uri pattern
    .try(Joi.string().uri())
    // If object: Must have id match uri pattern
    .try(Joi.object({ id: Joi.string().uri() }).unknown())
    .required(),

  validFrom: Joi.string().isoDate(),

  validUntil: Joi.string().isoDate(),

  credentialSubject: Joi.alternatives()
    // If object: Cannot be empty (i.e. minimum 1 key)
    .try(Joi.object().min(1))
    // If array: Every object cannot be empty (i.e. minimum 1 key)
    .try(Joi.array().items(Joi.object().min(1)))
    .required(),

  credentialStatus:
    // Must have type defined
    // If id is present, id must match uri pattern (credentialStatus.id is optional and can be undefined)
    Joi.object({ id: Joi.string().uri().optional(), type: Joi.string().required() }),

  termsOfUse: Joi.alternatives()
    // If object: Must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
    .try(Joi.object({ id: Joi.string().uri().optional(), type: Joi.string().required() }))
    // If array: Every object must have type defined. If id is present, id must match uri pattern (termsOfUse.id is optional and can be undefined)
    .try(Joi.array().items({ id: Joi.string().uri().optional(), type: Joi.string().required() })),

  evidence: Joi.alternatives()
    // If object: Must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
    .try(Joi.object({ id: Joi.string().uri().optional(), type: Joi.string().required() }))
    // If array: Every object must have type defined. If id is present, id must match uri pattern (evidence.id is optional and can be undefined)
    .try(Joi.array().items({ id: Joi.string().uri().optional(), type: Joi.string().required() })),

  proof: Joi.alternatives()
    // If object: Must have type defined
    .try(Joi.object({ type: Joi.string().required() }))
    // If array: Every object must have type defined
    .try(Joi.array().items({ type: Joi.string().required() })),
}).unknown(); // Allow additional properties
