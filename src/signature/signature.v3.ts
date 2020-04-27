import { OpenAttestationDocument } from "../__generated__/schemaV3";
import { bufSortJoin, hashToBuffer, toBuffer } from "../utils";
import { v4 as uuid } from "uuid";
import { MerkleTree } from "./merkle";
import { Salt, VerifiableCredential } from "../@types/document";
import { cloneDeep, get, sortBy, unset } from "lodash";
import { keccak256 } from "js-sha3";

const deepMap = (value: any, path: string): Salt[] => {
  if (Array.isArray(value)) {
    return value.flatMap((v, index) => deepMap(v, `${path}[${index}]`));
  }
  if (typeof value === "object") {
    return Object.keys(value).flatMap(key => deepMap(value[key], path ? `${path}.${key}` : key));
  }
  if (typeof value === "string") {
    return [{ type: "string", value: uuid(), path }];
  }
  throw new Error(`unexpected element  ${value} => ${path}`);
};
const salt = (data: any) => deepMap(data, "");

const digestDocument = (
  document: VerifiableCredential<OpenAttestationDocument>,
  salts: Salt[],
  obfuscatedData: string[]
) => {
  // Prepare array of hashes from filtered data
  // const hashedDataArray = document.proof.signature.privacy.obfuscatedData;

  // console.log(JSON.stringify(salts, null, 2));
  // Prepare array of hashes from visible data
  const hashedUnhashedDataArray = salts
    .filter(salt => get(document, salt.path))
    .map(salt => {
      // console.log(`[${salt.path}] = ${get(document, salt.path)}`);
      return keccak256(JSON.stringify(`${salt.value}:${salt.type}:${get(document, salt.path)}`));
    });

  // Combine both array and sort them to ensure determinism
  const combinedHashes = obfuscatedData.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};

export const wrapV3 = <T extends OpenAttestationDocument>(document: any): VerifiableCredential<T> => {
  const salts = salt(document);
  const digest = digestDocument(document, salts, []);

  const batchBuffers = [digest].map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));

  return {
    ...document,
    proof: {
      ...document.proof,
      signature: {
        type: "SHA3MerkleProof",
        targetHash: digest,
        proof: merkleProof,
        merkleRoot,
        salts,
        privacy: {
          obfuscatedData: []
        }
      }
    }
  };
};
export const wrapsV3 = <T extends OpenAttestationDocument>(documents: any[]): VerifiableCredential<T>[] => {
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
        ...document.proof,
        signature: {
          type: "SHA3MerkleProof",
          targetHash: digest,
          proof: merkleProof,
          merkleRoot,
          salts: salts[index],
          privacy: {
            obfuscatedData: []
          }
        }
      }
    };
  });
};

export const verifyV3 = <T extends VerifiableCredential<OpenAttestationDocument>>(
  document: T
): document is VerifiableCredential<T> => {
  const signature = document.proof.signature;
  if (!signature) {
    return false;
  }

  // Checks target hash
  const bla = {
    ...document,
    proof: {
      ...document.proof,
      sinature: undefined
    }
  };
  const digest = digestDocument(bla, document.proof.signature.salts, document.proof.signature.privacy.obfuscatedData);
  const targetHash = document.proof.signature.targetHash;
  if (digest !== targetHash) return false;

  // Calculates merkle root from target hash and proof, then compare to merkle root in document
  const merkleRoot = document.proof.signature.merkleRoot;
  const proof: string[] = document.proof.signature.proof;
  const calculatedMerkleRoot = proof.reduce((prev, current) => {
    const prevAsBuffer = hashToBuffer(prev);
    const currAsBuffer = hashToBuffer(current);
    const combineAsBuffer = bufSortJoin(prevAsBuffer, currAsBuffer);
    return keccak256(combineAsBuffer);
  }, digest);

  return calculatedMerkleRoot === merkleRoot;
};

const obfuscateData = (_data: VerifiableCredential<OpenAttestationDocument>, fields: string[] | string) => {
  const data = cloneDeep(_data); // Prevents alteration of original data
  const fieldsToRemove = Array.isArray(fields) ? fields : [fields];
  const salts = _data.proof.signature.salts;

  // Obfuscate data by hashing them with the key
  const obfuscatedData = fieldsToRemove
    .filter(field => get(data, field))
    .map(field => {
      const value = get(data, field);
      const salt = salts.find(s => s.path === field);
      if (!salt) {
        throw new Error(`Salt not found for ${field}`);
      }
      return toBuffer(`${salt.value}:${salt.type}:${value}`).toString("hex");
    });

  // Return remaining data
  fieldsToRemove.forEach(path => {
    unset(data, path);
  });

  return {
    data,
    obfuscatedData
  };
};

export const obfuscateV3 = (
  document: VerifiableCredential<OpenAttestationDocument>,
  fields: string[] | string
): VerifiableCredential<OpenAttestationDocument> => {
  const { data, obfuscatedData } = obfuscateData(document, fields);

  const currentObfuscatedData = document.proof.signature.privacy.obfuscatedData;
  const newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
  return {
    ...data,
    proof: {
      ...data.proof,
      signature: {
        ...data.proof.signature,
        privacy: {
          ...data.proof.signature.privacy,
          obfuscatedData: newObfuscatedData
        }
      }
    }
  };
};
