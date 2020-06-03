import { hashToBuffer } from "../shared/utils";
import { v4 as uuid } from "uuid";
import { MerkleTree } from "../shared/merkle";
import {
  OpenAttestationVerifiableCredential,
  OpenAttestationVerifiableCredentialWithoutProof,
  Salt,
  SignatureAlgorithm
} from "../shared/@types/document";
import { digestDocument } from "../v3/digest";

const deepMap = (value: any, path: string): Salt[] => {
  if (Array.isArray(value)) {
    return value.flatMap((v, index) => deepMap(v, `${path}[${index}]`));
  }
  if (typeof value === "object") {
    return Object.keys(value).flatMap(key => deepMap(value[key], path ? `${path}.${key}` : key));
  }
  if (typeof value === "string") {
    return [{ value: uuid(), path }];
  }
  throw new Error(`Unexpected value '${value}' in '${path}'`);
};

export const salt = (data: any) => deepMap(data, "");

/**
 * Wrap a single OpenAttestation document in v3 format.

 * @param document an unwrapped OpenAttestation document
 */
export const wrap = <T extends OpenAttestationVerifiableCredentialWithoutProof>(
  document: T
): OpenAttestationVerifiableCredential<T> => {
  // To ensure that base @context exists, but this also means some of our validateW3C errors may be unreachable
  if (!document["@context"]) {
    document["@context"] = ["https://www.w3.org/2018/credentials/v1"];
  }

  // Since our wrapper adds in OA-specific properties, we should push our OA context. This is also to pass W3C VC test suite.
  if (
    Array.isArray(document["@context"]) &&
    !document["@context"].includes("https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld")
  ) {
    document["@context"].push("https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld");
  }

  const salts = salt(document);
  const digest = digestDocument(document, salts, []);

  const batchBuffers = [digest].map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));

  return {
    ...document,
    proof: {
      type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
      targetHash: digest,
      proofs: merkleProof,
      merkleRoot,
      salts,
      privacy: {
        obfuscated: []
      }
    }
  };
};

/**
 * Wrap multiple OpenAttestation documents in v3 format.

 * @param documents an array of unwrapped OpenAttestation documents
 */
export const wraps = <T extends OpenAttestationVerifiableCredentialWithoutProof>(
  documents: T[]
): OpenAttestationVerifiableCredential<T>[] => {
  const salts = documents.map(document => {
    return salt(document);
  });
  const digests = documents.map((document, index) => {
    return digestDocument(document, salts[index], []);
  });

  const batchBuffers = digests.map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");

  return documents.map((document, index) => {
    const digest = digests[index];
    const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));

    return {
      ...document,
      proof: {
        type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
        targetHash: digest,
        proofs: merkleProof,
        merkleRoot,
        salts: salts[index],
        privacy: {
          obfuscated: []
        }
      }
    };
  });
};
