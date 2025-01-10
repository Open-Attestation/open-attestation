import { hashToBuffer } from "../shared/utils/hashing";
import { MerkleTree } from "../shared/merkle";
import { ContextUrl, ContextType, UnableToInterpretContextError, interpretContexts } from "./context";
import {
  ProoflessW3cVerifiableCredential,
  ProoflessOAVerifiableCredential,
  OADigested,
  W3cVerifiableCredential,
} from "./types";
import { genTargetHash } from "./hash";
import { encodeSalt, salt } from "./salt";
import { ZodError } from "zod";

export async function digestVc<T extends ProoflessOAVerifiableCredential>(vc: T): Promise<OADigested<T>>;
export async function digestVc<T extends ProoflessW3cVerifiableCredential>(
  vc: T,
  isUseW3cDataModel: boolean
): Promise<OADigested<T>>;
export async function digestVc<T extends ProoflessW3cVerifiableCredential>(
  vc: T,
  isUseW3cDataModel?: boolean
): Promise<OADigested<T>> {
  // 1. Validate vc against OA or W3C data model
  let validatedUndigestedVc: ProoflessW3cVerifiableCredential | undefined;
  if (!isUseW3cDataModel) {
    const oav4 = await ProoflessOAVerifiableCredential.safeParseAsync(vc);
    if (!oav4.success) {
      throw new DataModelValidationError("Open Attestation v4.0", oav4.error);
    }
    validatedUndigestedVc = oav4.data;
  } else {
    const w3cVc = await ProoflessW3cVerifiableCredential.safeParseAsync(vc);
    if (!w3cVc.success) {
      throw new DataModelValidationError("Verifiable Credentials v2.0", w3cVc.error);
    }
    validatedUndigestedVc = w3cVc.data;
  }

  /* 2. Ensure provided @context are interpretable (e.g. valid @context URL, all types are mapped, etc.) */
  await interpretContexts(validatedUndigestedVc);

  /* 3. Context validation */
  // Ensure that required contexts are present and in the correct order
  // type: [Base, OA, ...]
  const REQUIRED_CONTEXTS = [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4] as const;
  const contexts = new Set<string>(REQUIRED_CONTEXTS);
  if (typeof validatedUndigestedVc["@context"] === "string") {
    contexts.add(validatedUndigestedVc["@context"]);
  } else if (isStringArray(validatedUndigestedVc["@context"])) {
    validatedUndigestedVc["@context"].forEach((context) => contexts.add(context));
  }
  REQUIRED_CONTEXTS.forEach((c) => contexts.delete(c));
  const finalContexts: ProoflessOAVerifiableCredential["@context"] = [...REQUIRED_CONTEXTS, ...Array.from(contexts)];

  /* 4. Type validation */
  // Ensure that required types are present and in the correct order
  // type: ["VerifiableCredential", "OpenAttestationCredential", ...]
  const REQUIRED_TYPES = [ContextType.BaseContext, ContextType.OAV4Context] as const;
  const types = new Set<string>([ContextType.BaseContext, ContextType.OAV4Context]);
  if (typeof validatedUndigestedVc["type"] === "string") {
    types.add(validatedUndigestedVc["type"]);
  } else if (isStringArray(validatedUndigestedVc["type"])) {
    types.forEach((type) => types.add(type));
  }
  REQUIRED_TYPES.forEach((t) => types.delete(t));
  const finalTypes: ProoflessOAVerifiableCredential["type"] = [...REQUIRED_TYPES, ...Array.from(types)];

  const vcReadyForDigesting = {
    ...validatedUndigestedVc,
    ...extractAndAssertAsOAVerifiableCredentialProps(validatedUndigestedVc, [
      "issuer",
      "credentialStatus",
      "credentialSubject",
    ]),
    "@context": finalContexts,
    type: finalTypes,
  } satisfies ProoflessOAVerifiableCredential;

  /* 5. OA wrapping */
  const salts = salt(vcReadyForDigesting);
  const targetHash = genTargetHash(vcReadyForDigesting, salts, []);

  const batchBuffers = [targetHash].map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree.getProof(hashToBuffer(targetHash)).map((buffer) => buffer.toString("hex"));

  const unsignedOADigestedVc: OADigested<W3cVerifiableCredential> = {
    ...vcReadyForDigesting,
    proof: {
      type: "OpenAttestationHashProof2018",
      proofPurpose: "assertionMethod",
      targetHash,
      proofs: merkleProof,
      merkleRoot,
      salts: encodeSalt(salts),
      privacy: {
        obfuscated: [],
      },
    },
  };

  return unsignedOADigestedVc as OADigested<T>;
}

export async function digestVcs<T extends ProoflessOAVerifiableCredential>(vcs: T[]): Promise<OADigested<T>[]>;
export async function digestVcs<T extends ProoflessW3cVerifiableCredential>(
  vcs: T[],
  isUseW3cDataModel: boolean
): Promise<OADigested<T>[]>;
export async function digestVcs<T extends ProoflessW3cVerifiableCredential>(
  vcs: T[],
  isUseW3cDataModel?: boolean
): Promise<OADigested<T>[]> {
  // create individual verifiable credential
  const verifiableCredentials = await Promise.all(vcs.map((vc) => digestVc(vc, isUseW3cDataModel ?? false)));

  // get all the target hashes to compute the merkle tree and the merkle root
  const merkleTree = new MerkleTree(
    verifiableCredentials.map((verifiableCredential) => verifiableCredential.proof.targetHash).map(hashToBuffer)
  );
  const merkleRoot = merkleTree.getRoot().toString("hex");

  // for each VC, update the merkle root and add the proofs needed
  return verifiableCredentials.map((verifiableCredential) => {
    const digest = verifiableCredential.proof.targetHash;
    const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer) => buffer.toString("hex"));

    return {
      ...verifiableCredential,
      proof: {
        ...verifiableCredential.proof,
        proofs: merkleProof,
        merkleRoot,
      },
    };
  });
}

/** Extract a set of properties from w3cVerifiableCredential but only include the ones
 * that are defined in the original VC. For example, if we extract
 * "a" and "b" from { b: "something" } we should only get { b: "something" } NOT
 * { a: undefined, b: "something" }. We also assert that the extracted properties
 * are of OAVerifiableCredential type.
 **/
function extractAndAssertAsOAVerifiableCredentialProps<K extends keyof ProoflessOAVerifiableCredential>(
  original: ProoflessW3cVerifiableCredential,
  keys: K[]
) {
  const temp: Record<string, unknown> = {};
  Object.entries(original).forEach(([k, v]) => {
    if (keys.includes(k as K)) temp[k] = v;
  });
  return temp as { [key in K]: ProoflessOAVerifiableCredential[key] };
}

class DataModelValidationError extends Error {
  constructor(dataModel: "Open Attestation v4.0" | "Verifiable Credentials v2.0", public error: ZodError) {
    super(`Input VC does not conform to ${dataModel} Data Model: \n ${JSON.stringify(error.format(), null, 2)}`);
    Object.setPrototypeOf(this, DataModelValidationError.prototype);
  }
}

export const digestVcErrors = {
  DataModelValidationError,
  UnableToInterpretContextError,
};

function isStringArray(input: unknown): input is string[] {
  return Array.isArray(input) && input.every((i) => typeof i === "string");
}
