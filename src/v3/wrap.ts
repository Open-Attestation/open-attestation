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
import { Base64 } from "js-base64";

const deepMap = (value: any, path: string): Salt[] => {
  if (Array.isArray(value)) {
    return value.flatMap((v, index) => deepMap(v, `${path}[${index}]`));
  }
  // Since null values are allowed but typeof null === "object", the "&& value" is used to skip this
  if (typeof value === "object" && value) {
    return Object.keys(value).flatMap(key => deepMap(value[key], path ? `${path}.${key}` : key));
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
    return [{ value: uuid(), path }];
  }
  throw new Error(`Unexpected value '${value}' in '${path}'`);
};

const illegalCharactersCheck = (data: object) => {
  Object.entries(data).forEach(([key, value]) => {
    if (key.includes(".")) {
      throw new Error("Key names must not have . in them");
    }
    if (key.includes("[") || key.includes("]")) {
      throw new Error("Key names must not have '[' or ']' in them");
    }
    if (value && typeof value === "object") {
      return illegalCharactersCheck(value); // Recursively search if property contains sub-properties
    }
  });
};

export const salt = (data: any) => {
  // Check for illegal characters e.g. '.', '[' or ']'
  illegalCharactersCheck(data);
  return deepMap(data, "");
};

export const encodeSalt = (salts: Salt[]): string => Base64.encode(JSON.stringify(salts));
export const decodeSalt = (salts: string): Salt[] => JSON.parse(Base64.decode(salts));

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
      salts: encodeSalt(salts),
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
        salts: encodeSalt(salts[index]),
        privacy: {
          obfuscated: []
        }
      }
    };
  });
};
