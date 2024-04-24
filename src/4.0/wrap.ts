import { hashToBuffer, isStringArray } from "../shared/utils";
import { MerkleTree } from "../shared/merkle";
import { ContextType, ContextUrl } from "../shared/@types/document";
import { V4RawDocument, VC, V4WrappedDocument, W3cVcDataModel } from "./types";
import { digestCredential } from "../4.0/digest";
import { encodeSalt, salt } from "./salt";
import { interpretContexts } from "./validate";

export const wrapDocument = async <T extends V4RawDocument>(credential: T): Promise<V4WrappedDocument<T>> => {
  /* 1a. try OpenAttestation VC validation, since most user will be issuing oa v4*/
  const oav4context = await V4RawDocument.pick({ "@context": true }).safeParseAsync(credential); // Superficial check on user intention
  let rawDocument: VC | undefined;
  if (oav4context.success) {
    const oav4 = await V4RawDocument.safeParseAsync(rawDocument);
    if (!oav4.success) {
      throw new Error(
        `Input document does not conform to OpenAttestation v4.0 Data Model: ${JSON.stringify(oav4.error.issues)}`
      );
    }
    rawDocument = oav4.data;
  }

  /* 1b. only if OA VC validation fail do we continue with W3C VC data model validation */
  if (!rawDocument) {
    const vc = await W3cVcDataModel.safeParseAsync(credential);
    if (!vc.success)
      throw new Error(
        `Input document does not conform to Verifiable Credentials v2.0 Data Model: ${JSON.stringify(vc.error.issues)}`
      );

    rawDocument = vc.data;
  }

  /* 2. Ensure provided @context are interpretable (e.g. valid @context URL, all types are mapped, etc.) */
  await interpretContexts(rawDocument);

  /* 3. Context validation */
  // Ensure that required contexts are present and in the correct order
  // type: [Base, OA, ...]
  const REQUIRED_CONTEXTS = [ContextUrl.v2_vc, ContextUrl.v4_alpha] as const;
  const contexts = new Set<string>(REQUIRED_CONTEXTS);
  if (typeof rawDocument["@context"] === "string") {
    contexts.add(rawDocument["@context"]);
  } else if (isStringArray(rawDocument["@context"])) {
    rawDocument["@context"].forEach((context) => contexts.add(context));
  }
  REQUIRED_CONTEXTS.forEach((c) => contexts.delete(c));
  const finalContexts: V4RawDocument["@context"] = [...REQUIRED_CONTEXTS, ...Array.from(contexts)];

  /* 4. Type validation */
  // Ensure that required types are present and in the correct order
  // type: ["VerifiableCredential", "OpenAttestationCredential", ...]
  const REQUIRED_TYPES = [ContextType.BaseContext, ContextType.V4AlphaContext] as const;
  const types = new Set<string>([ContextType.BaseContext, ContextType.V4AlphaContext]);
  if (typeof rawDocument["type"] === "string") {
    types.add(rawDocument["type"]);
  } else if (isStringArray(rawDocument["type"])) {
    types.forEach((type) => types.add(type));
  }
  REQUIRED_TYPES.forEach((t) => types.delete(t));
  const finalTypes: V4RawDocument["type"] = [...REQUIRED_TYPES, ...Array.from(types)];

  const documentReadyForWrapping = {
    ...rawDocument,
    ...assertAsOaVcProps(rawDocument, ["issuer", "credentialStatus"]),
    "@context": finalContexts,
    type: finalTypes,
  } satisfies VC;

  /* 5.  OA wrapping */
  const salts = salt(documentReadyForWrapping);
  const digest = digestCredential(documentReadyForWrapping, salts, []);

  const batchBuffers = [digest].map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));
  const verifiableCredential: V4WrappedDocument = {
    ...documentReadyForWrapping,
    proof: {
      type: "OpenAttestationMerkleProofSignature2018",
      proofPurpose: "assertionMethod",
      targetHash: digest,
      proofs: merkleProof,
      merkleRoot,
      salts: encodeSalt(salts),
      privacy: {
        obfuscated: [],
      },
    },
  };

  return verifiableCredential as V4WrappedDocument<T>;
};

function assertAsOaVcProps<K extends keyof VC>(obj: VC, keys: K[]) {
  const temp: Record<string, unknown> = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (keys.includes(k as K)) temp[k] = v;
  });
  return temp as { [key in K]: V4RawDocument[key] };
}
