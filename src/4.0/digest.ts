import { hashToBuffer } from "../shared/utils/hashing";
import { MerkleTree } from "../shared/merkle";
import { ContextUrl, ContextType, UnableToInterpretContextError, interpretContexts } from "./context";
import { OAVerifiableCredential, Digested, W3cVerifiableCredential } from "./types";
import { genTargetHash } from "./hash";
import { encodeSalt, salt } from "./salt";
import { ZodError } from "zod";

export const digestVc = async <T extends OAVerifiableCredential | W3cVerifiableCredential>(
  vc: T
): Promise<Digested<T>> => {
  /* 1a. Try OpenAttestation VC validation, since most user will be issuing oa v4 */
  const oav4context = await OAVerifiableCredential.pick({ "@context": true }).passthrough().safeParseAsync(vc); // Superficial check on user intention
  let validatedRawDocument: W3cVerifiableCredential | undefined;
  if (oav4context.success) {
    const oav4 = await OAVerifiableCredential.safeParseAsync(vc);
    if (!oav4.success) {
      throw new DataModelValidationError("Open Attestation v4.0", oav4.error);
    }
    validatedRawDocument = oav4.data;
  }

  /* 1b. Only if OA VC validation fail do we continue with W3C VC data model validation */
  if (!validatedRawDocument) {
    const w3cVc = await W3cVerifiableCredential.safeParseAsync(vc);
    if (!w3cVc.success) {
      throw new DataModelValidationError("Verifiable Credentials v2.0", w3cVc.error);
    }
    validatedRawDocument = w3cVc.data;
  }

  /* 2. Ensure provided @context are interpretable (e.g. valid @context URL, all types are mapped, etc.) */
  await interpretContexts(validatedRawDocument);

  /* 3. Context validation */
  // Ensure that required contexts are present and in the correct order
  // type: [Base, OA, ...]
  const REQUIRED_CONTEXTS = [ContextUrl.w3c_vc_v2, ContextUrl.oa_vc_v4] as const;
  const contexts = new Set<string>(REQUIRED_CONTEXTS);
  if (typeof validatedRawDocument["@context"] === "string") {
    contexts.add(validatedRawDocument["@context"]);
  } else if (isStringArray(validatedRawDocument["@context"])) {
    validatedRawDocument["@context"].forEach((context) => contexts.add(context));
  }
  REQUIRED_CONTEXTS.forEach((c) => contexts.delete(c));
  const finalContexts: OAVerifiableCredential["@context"] = [...REQUIRED_CONTEXTS, ...Array.from(contexts)];

  /* 4. Type validation */
  // Ensure that required types are present and in the correct order
  // type: ["VerifiableCredential", "OpenAttestationCredential", ...]
  const REQUIRED_TYPES = [ContextType.BaseContext, ContextType.OAV4Context] as const;
  const types = new Set<string>([ContextType.BaseContext, ContextType.OAV4Context]);
  if (typeof validatedRawDocument["type"] === "string") {
    types.add(validatedRawDocument["type"]);
  } else if (isStringArray(validatedRawDocument["type"])) {
    types.forEach((type) => types.add(type));
  }
  REQUIRED_TYPES.forEach((t) => types.delete(t));
  const finalTypes: OAVerifiableCredential["type"] = [...REQUIRED_TYPES, ...Array.from(types)];

  const documentReadyForWrapping = {
    ...validatedRawDocument,
    ...extractAndAssertAsOAVerifiableCredentialProps(validatedRawDocument, [
      "issuer",
      "credentialStatus",
      "credentialSubject",
    ]),
    "@context": finalContexts,
    type: finalTypes,
  } satisfies W3cVerifiableCredential;

  /* 5. OA wrapping */
  const salts = salt(documentReadyForWrapping);
  const targetHash = genTargetHash(documentReadyForWrapping, salts, []);

  const batchBuffers = [targetHash].map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree.getProof(hashToBuffer(targetHash)).map((buffer) => buffer.toString("hex"));

  return {
    ...documentReadyForWrapping,
    proof: {
      type: "OpenAttestationHashProof2018",
      proofPurpose: "assertionMethod",
      targetHash,
      proofs: merkleProof,
      merkleRoot,
      salts: encodeSalt(salts),
      privacy: {
        obfuscated: [] as string[], // FIXME: Not sure why casting required here
      },
    },
  } as Digested<T>;
};

export const digestVcs = async <T extends OAVerifiableCredential | W3cVerifiableCredential>(
  // NoExtraProperties prevents the user from passing in a document with extra properties, which is more aligned to our validation strategy of strict
  documents: T[]
): Promise<Digested<T>[]> => {
  // create individual verifiable credential
  const verifiableCredentials = await Promise.all(documents.map((document) => digestVc(document)));

  // get all the target hashes to compute the merkle tree and the merkle root
  const merkleTree = new MerkleTree(
    verifiableCredentials.map((verifiableCredential) => verifiableCredential.proof.targetHash).map(hashToBuffer)
  );
  const merkleRoot = merkleTree.getRoot().toString("hex");

  // for each document, update the merkle root and add the proofs needed
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
};

/** Extract a set of properties from w3cVerifiableCredential but only include the ones
 * that are defined in the original document. For example, if we extract
 * "a" and "b" from { b: "something" } we should only get { b: "something" } NOT
 * { a: undefined, b: "something" }. We also assert that the extracted properties
 * are of V4OpenAttestationDocument type.
 **/
function extractAndAssertAsOAVerifiableCredentialProps<K extends keyof W3cVerifiableCredential>(
  original: W3cVerifiableCredential,
  keys: K[]
) {
  const temp: Record<string, unknown> = {};
  Object.entries(original).forEach(([k, v]) => {
    if (keys.includes(k as K)) temp[k] = v;
  });
  return temp as { [key in K]: OAVerifiableCredential[key] };
}

class DataModelValidationError extends Error {
  constructor(dataModel: "Open Attestation v4.0" | "Verifiable Credentials v2.0", public error: ZodError) {
    super(`Input document does not conform to ${dataModel} Data Model: \n ${JSON.stringify(error.format(), null, 2)}`);
    Object.setPrototypeOf(this, DataModelValidationError.prototype);
  }
}

export const wrapVcErrors = {
  DataModelValidationError,
  UnableToInterpretContextError,
};

function isStringArray(input: unknown): input is string[] {
  return Array.isArray(input) && input.every((i) => typeof i === "string");
}
