const { sha3 } = require("ethereumjs-util");
const crypto = require("crypto");

/**
 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
 * @param {[Buffer]} args The buffers to concatenate
 */
function bufSortJoin(...args) {
  return Buffer.concat([...args].sort(Buffer.compare));
}

// If element is not a buffer, stringify it and then hash it to be a buffer
function toBuffer(element) {
  return Buffer.isBuffer(element) && element.length === 32
    ? element
    : sha3(JSON.stringify(element));
}

// If hash is not a buffer, convert it to buffer (without hashing it)
function hashToBuffer(hash) {
  return Buffer.isBuffer(hash) && hash.length === 32
    ? hash
    : Buffer.from(hash, "hex");
}

/**
 * Turns array of data into sorted array of hashes
 * @param {*} arr
 */
function hashArray(arr) {
  return arr.map(i => toBuffer(i)).sort(Buffer.compare);
}

function randomSalt(saltLength = 10) {
  return crypto.randomBytes(saltLength).toString("hex");
}

function sha256(content, salt = "") {
  const hash = crypto.createHash("sha256");
  hash.update(content + salt);

  return `sha256$${hash.digest("hex")}`;
}

module.exports = {
  hashArray,
  bufSortJoin,
  toBuffer,
  hashToBuffer,
  sha256,
  randomSalt
};
