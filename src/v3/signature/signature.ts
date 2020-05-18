import { OpenAttestationDocument } from "../../__generated__/schemaV3";
import { bufSortJoin, hashToBuffer, toBuffer } from "../../shared/utils";
import { v4 as uuid } from "uuid";
import { MerkleTree } from "../../shared/merkle";
import { Salt, VerifiableCredential } from "../../shared/@types/document";
import { cloneDeep, get, sortBy, unset } from "lodash";
import { keccak256 } from "js-sha3";
import { compact } from "jsonld";

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
      return keccak256(JSON.stringify(`${salt.value}:${get(document, salt.path)}`));
    });

  // Combine both array and sort them to ensure determinism
  const combinedHashes = obfuscatedData.concat(hashedUnhashedDataArray);
  const sortedHashes = sortBy(combinedHashes);

  // Finally, return the digest of the entire set of data
  return keccak256(JSON.stringify(sortedHashes));
};
const getId = (objectOrString: any) => {
  if (typeof objectOrString === "string") {
    return objectOrString;
  }
  return objectOrString.id;
};
/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */
const dateFullYear = /[0-9]{4}/;
const dateMonth = /(0[1-9]|1[0-2])/;
const dateMDay = /([12]\d|0[1-9]|3[01])/;
const timeHour = /([01][0-9]|2[0-3])/;
const timeMinute = /[0-5][0-9]/;
const timeSecond = /([0-5][0-9]|60)/;
const timeSecFrac = /(\.[0-9]+)?/;
const timeNumOffset = new RegExp("[-+]".concat(timeHour.source, ":").concat(timeMinute.source));
const timeOffset = new RegExp("([zZ]|".concat(timeNumOffset.source, ")"));
const partialTime = new RegExp(
  ""
    .concat(timeHour.source, ":")
    .concat(timeMinute.source, ":")
    .concat(timeSecond.source)
    .concat(timeSecFrac.source)
);
const fullDate = new RegExp(
  ""
    .concat(dateFullYear.source, "-")
    .concat(dateMonth.source, "-")
    .concat(dateMDay.source)
);
const fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
const rfc3339 = new RegExp("".concat(fullDate.source, "[ tT]").concat(fullTime.source));

const isValidRFC3339 = (str: any) => {
  return rfc3339.test(str);
};
export async function validateV3<T extends OpenAttestationDocument>(
  credential: VerifiableCredential<T>
): Promise<void> {
  // ensure first context is 'https://www.w3.org/2018/credentials/v1'
  if (Array.isArray(credential["@context"]) && credential["@context"][0] !== "https://www.w3.org/2018/credentials/v1") {
    throw new Error("https://www.w3.org/2018/credentials/v1 needs to be first in the " + "list of contexts.");
  }
  // TODO how to ensure issuer is a valid RFC 3986 URI
  const issuerId = getId(credential.issuer);
  if (!issuerId.includes(":")) {
    throw new Error(`Property \`issuer\` id must be a a valid RFC 3986 URI`);
  }

  // ensure issuanceDate is a valid RFC3339 date
  if (!isValidRFC3339(credential.issuanceDate)) {
    throw new Error("Property `issuanceDate` must be a a valid RFC 3339 date");
  }
  // ensure expirationDate is a valid RFC3339 date
  if (credential.expirationDate && !isValidRFC3339(credential.expirationDate)) {
    throw new Error("Property `expirationDate` must be a a valid RFC 3339 date");
  }

  await compact(credential, "https://w3id.org/security/v2", {
    expansionMap: info => {
      if (info.unmappedProperty) {
        throw new Error(
          'The property "' + info.unmappedProperty + '" in the input ' + "was not defined in the context."
        );
      }
    }
  });
}

export const wrapV3 = <T extends OpenAttestationDocument>(document: any): VerifiableCredential<T> => {
  document["@context"].push(
    "https://gist.githubusercontent.com/Nebulis/18efab9f8801c886a7dd0f6230efd89d/raw/f9f3107cabd7768f84a36c65d756abd961d19bda/w3c.json.ld"
  );
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
      return toBuffer(`${salt.value}:${value}`).toString("hex");
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
