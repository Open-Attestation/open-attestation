import { hashToBuffer, isStringArray } from "../shared/utils";
import { MerkleTree } from "../shared/merkle";
import { ContextUrl } from "../shared/@types/document";
import { WrappedDocument } from "./types";
import { digestCredential } from "../4.0/digest";
import { WrapDocumentOptionV4 } from "../shared/@types/wrap";
import { OpenAttestationDocument, ProofPurpose } from "../__generated__/schema.4.0";
import { encodeSalt, salt } from "./salt";
import { interpretContexts, inputVcModel } from "./validate";

export const wrapDocument = async <T extends OpenAttestationDocument>(
  credential: T,
  options: WrapDocumentOptionV4 // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<WrappedDocument<T>> => {
  const document = { ...credential };

  /* 1. Data model validation */
  const result = await inputVcModel.safeParseAsync(document);
  if (!result.success)
    throw new Error(
      `Input document does not conform to Verifiable Credentials v2.0 Data Model: ${JSON.stringify(
        result.error.issues
      )}`
    );

  /* 2. Ensure provided @context are interpretable (e.g. valid @context URL, all types are mapped, etc.) */
  await interpretContexts(document);

  /* 3. Context validation */
  // Ensure that required contexts are present and in the correct order
  // type: [Base, OA, ...]
  const contexts = new Set<string>([ContextUrl["v2_vc"], ContextUrl["v4_alpha"]]);
  if (typeof document["@context"] === "string") {
    contexts.add(document["@context"]);
  } else if (isStringArray(document["@context"])) {
    document["@context"].forEach((context) => contexts.add(context));
  }
  document["@context"] = Array.from(contexts); // Since JavaScript Sets preserve insertion order and duplicated inserts do not affect the order, we can do this

  /* 4. Type validation */
  // Ensure that required types are present and in the correct order
  // type: ["VerifiableCredential", "OpenAttestationCredential", ...]
  const types = new Set(["VerifiableCredential", "OpenAttestationCredential"]);
  if (typeof document["type"] === "string") {
    types.add(document["type"]);
  } else if (isStringArray(document["type"])) {
    document["type"].forEach((type) => types.add(type));
  }
  document["type"] = Array.from(types); // Since JavaScript Sets preserve insertion order and duplicated inserts do not affect the order, we can do this

  /* 5.  OA wrapping */
  const salts = salt(document);
  const digest = digestCredential(document, salts, []);

  const batchBuffers = [digest].map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));

  const verifiableCredential: WrappedDocument<T> = {
    ...document,
    proof: {
      type: "OpenAttestationMerkleProofSignature2018",
      proofPurpose: ProofPurpose.AssertionMethod,
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

export const wrapDocuments = async <T extends OpenAttestationDocument>(
  documents: T[],
  options: WrapDocumentOptionV4
): Promise<WrappedDocument<T>[]> => {
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
