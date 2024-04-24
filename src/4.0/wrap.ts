import { hashToBuffer, isStringArray } from "../shared/utils";
import { MerkleTree } from "../shared/merkle";
import { ContextType, ContextUrl } from "../shared/@types/document";
import { OpenAttestationVC, VC, WrappedOpenAttestationVC } from "./types";
import { digestCredential } from "../4.0/digest";
import { encodeSalt, salt } from "./salt";
import { interpretContexts, vcDataModel } from "./validate";

export const wrapDocument = async <T extends OpenAttestationVC>(
  credential: T
): Promise<WrappedOpenAttestationVC<T>> => {
  /* 1a. W3C VC data model validation */
  const result = await vcDataModel.safeParseAsync(credential);
  if (!result.success)
    throw new Error(
      `Input document does not conform to Verifiable Credentials v2.0 Data Model: ${JSON.stringify(
        result.error.issues
      )}`
    );
  const rawDocument = result.data;

  /* 1b. Narrow down to OpenAttestation VC validation */
  const oav4context = await OpenAttestationVC.shape["@context"].safeParseAsync(rawDocument["@context"]); // Superficial check on user intention
  if (oav4context.success) {
    const oav4 = await OpenAttestationVC.safeParseAsync(rawDocument);
    if (!oav4.success) {
      throw new Error(
        `Input document does not conform to OpenAttestation v4.0 Data Model: ${JSON.stringify(oav4.error.issues)}`
      );
    }
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
  const finalContexts: OpenAttestationVC["@context"] = [...REQUIRED_CONTEXTS, ...Array.from(contexts)];

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
  const finalTypes: OpenAttestationVC["type"] = [...REQUIRED_TYPES, ...Array.from(types)];

  const documentReadyForWrapping = {
    ...rawDocument,
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

  const verifiableCredential: WrappedOpenAttestationVC = {
    ...documentReadyForWrapping,
    type: [ContextType.BaseContext, ContextType.V4AlphaContext], // FIXME: Follow finalContexts
    issuer: rawDocument["issuer"] as OpenAttestationVC["issuer"], // Assume valid by asserting types
    ...(rawDocument["credentialStatus"]
      ? { credentialStatus: rawDocument["credentialStatus"] as OpenAttestationVC["credentialStatus"] }
      : {}),
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

  return verifiableCredential;
};

export const wrapDocuments = async <T extends OpenAttestationVC>(
  documents: T[]
): Promise<WrappedOpenAttestationVC<T>[]> => {
  // create individual verifiable credential
  const verifiableCredentials = await Promise.all(documents.map((document) => wrapDocument(document, options)));

  // get all the target hashes to compute the merkle tree and the merkle root
  const merkleTree = new MerkleTree(
    verifiableCredentials.map((verifiableCredential) => verifiableCredential.proof.targetHash).map(hashToBuffer)
  );
  const merkleRoot = merkleTree.getRoot().toString("hex");

  // for each document, update the merkle root and add the proofs needed
  return verifiableCredentials.map((verifiableCredential) => {
    const digest = verifiableCredential.proof.targetHash;
    const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));

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
