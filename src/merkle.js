const { sha3 } = require("ethereumjs-util");
const { hashArray, bufSortJoin, toBuffer, hashToBuffer } = require("./utils");

/**
 * Returns the keccak hash of two buffers after concatenating them and sorting them
 * If either hash is not given, the input is returned
 * @param {Buffer} first A buffer to be hashed
 * @param {Buffer} second A buffer to be hashed
 */
function combinedHash(first, second) {
  if (!second) {
    return first;
  }
  if (!first) {
    return second;
  }
  return sha3(bufSortJoin(first, second));
}

function getNextLayer(elements) {
  return elements.reduce((layer, element, index, arr) => {
    if (index % 2 === 0) {
      // only calculate hash for even indexes
      layer.push(combinedHash(element, arr[index + 1]));
    }
    return layer;
  }, []);
}

/**
 * This function procduces the hashes and the merkle tree
 * If there are no elements, return empty array of array
 *
 * @param {*} elements
 */
function getLayers(elements) {
  if (elements.length === 0) {
    return [[""]];
  }
  const layers = [];
  layers.push(elements);
  while (layers[layers.length - 1].length > 1) {
    layers.push(getNextLayer(layers[layers.length - 1]));
  }
  return layers;
}

/**
 * This function takes a given index and determines if it is the first or second element in a pair, then returns the first element of the pair
 * If the given index is the last element in a layer with an odd number of elements, then null is returned
 * E.g 1:
 *
 * layer = [ A, B, C, D ],
 * if index = 2, then return A
 * if index = 3, then return C
 *
 * E.g 2:
 *
 * layer = [ A, B, C, D, E]
 * if index = 5, then return null
 * if index = 4, then return C
 *
 * @param {*} index
 * @param {*} layer
 */
function getPair(index, layer) {
  const pairIndex = index % 2 ? index - 1 : index + 1; // if odd return the index before it, else if even return the index after it
  if (pairIndex < layer.length) {
    return layer[pairIndex];
  }
  return null; // this happens when the given index is the last element in a layer with odd number of elements
}

/**
 * Finds all the "uncle" nodes required to prove a given element in the merkle tree
 *
 * @param {*} index
 * @param {*} layers
 */
function getProof(index, layers) {
  let i = index;
  const proof = layers.reduce((current, layer) => {
    const pair = getPair(i, layer);
    if (pair) {
      current.push(pair);
    }
    i = Math.floor(i / 2); // finds the index of the parent of the current node
    return current;
  }, []);
  return proof;
}

function getBufIndex(element, array) {
  for (let i = 0; i < array.length; i += 1) {
    if (element.equals(array[i])) {
      return i;
    }
  }
  return -1;
}

function MerkleTree(_elements) {
  const elements = hashArray(_elements);

  if (!(this instanceof MerkleTree)) {
    return new MerkleTree(elements);
  }

  this.elements = elements;

  // check buffers
  if (this.elements.some(e => !(e.length === 32 && Buffer.isBuffer(e)))) {
    throw new Error("elements must be 32 byte buffers");
  }

  this.layers = getLayers(this.elements);
}

MerkleTree.prototype.getRoot = function _getRoot() {
  return this.layers[this.layers.length - 1][0];
};

MerkleTree.prototype.getProof = function _getProof(_element) {
  const element = toBuffer(_element);

  const index = getBufIndex(element, this.elements); // searches for given element in the merkle tree and returns the index
  if (index === -1) {
    throw new Error("Element not found");
  }
  return getProof(index, this.layers);
};

/**
 * Function that runs through the supplied hashes to arrive at the supplied merkle root hash
 * @param {*} _proof The list of uncle hashes required to arrive at the supplied merkle root
 * @param {*} _root The merkle root
 * @param {*} _element The leaf node that is being verified
 */
const checkProof = function(_proof, _root, _element) {
  const proof = _proof.map(step => hashToBuffer(step));
  const root = hashToBuffer(_root);
  const element = hashToBuffer(_element);
  const proofRoot = proof.reduce(
    (hash, pair) => combinedHash(hash, pair),
    element
  );

  return root.equals(proofRoot);
};

module.exports = {
  MerkleTree,
  checkProof
};
