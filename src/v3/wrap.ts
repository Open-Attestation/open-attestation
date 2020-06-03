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
 * @param document
 */
export const wrap = <T extends OpenAttestationVerifiableCredentialWithoutProof>(
  document: T
): OpenAttestationVerifiableCredential<T> => {
  //ASK LAURENT: Should we have this? To ensure @context exists
  // if (document["@context"] == undefined) {
  //   document["@context"] = ["https://www.w3.org/2018/credentials/v1"];
  // }

  //ASK LAURENT: Push in user defined @contexts?
  // document["@context"].push(
  //   "https://gist.githubusercontent.com/Nebulis/18efab9f8801c886a7dd0f6230efd89d/raw/f9f3107cabd7768f84a36c65d756abd961d19bda/w3c.json.ld",
  // );
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
 * @param documents
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
