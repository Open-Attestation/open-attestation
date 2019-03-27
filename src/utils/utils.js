import { keccak256 } from "ethereumjs-util";
import crypto from "crypto";

/**
 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
 * @param {[Buffer]} args The buffers to concatenate
 */
export function bufSortJoin(...args) {
  return Buffer.concat([...args].sort(Buffer.compare));
}

// If element is not a buffer, stringify it and then hash it to be a buffer
export function toBuffer(element) {
  return Buffer.isBuffer(element) && element.length === 32
    ? element
    : keccak256(JSON.stringify(element));
}

// If hash is not a buffer, convert it to buffer (without hashing it)
export function hashToBuffer(hash) {
  return Buffer.isBuffer(hash) && hash.length === 32
    ? hash
    : Buffer.from(hash, "hex");
}

/**
 * Turns array of data into sorted array of hashes
 * @param {*} arr
 */
export function hashArray(arr) {
  return arr.map(i => toBuffer(i)).sort(Buffer.compare);
}

export function randomSalt(saltLength = 10) {
  return crypto.randomBytes(saltLength).toString("hex");
}

export function sha256(content, salt = "") {
  const hash = crypto.createHash("sha256");
  hash.update(content + salt);

  return `sha256$${hash.digest("hex")}`;
}

/**
 * Returns the keccak hash of two buffers after concatenating them and sorting them
 * If either hash is not given, the input is returned
 * @param {Buffer} first A buffer to be hashed
 * @param {Buffer} second A buffer to be hashed
 */
export function combineHashBuffers(first, second) {
  if (!second) {
    return first;
  }
  if (!first) {
    return second;
  }
  return keccak256(bufSortJoin(first, second));
}

/**
 * Returns the keccak hash of two string after concatenating them and sorting them
 * If either hash is not given, the input is returned
 * @param {string} first A string to be hashed (without 0x)
 * @param {string} second A string to be hashed (without 0x)
 * @returns {string} Resulting string after the hash is combined (without 0x)
 */
export function combineHashString(first, second) {
  return first && second
    ? combineHashBuffers(hashToBuffer(first), hashToBuffer(second)).toString(
        "hex"
      )
    : first || second;
}
