import { hashArray, toBuffer, hashToBuffer, combineHashBuffers } from "../../utils";

function getNextLayer(elements: Buffer[]) {
  return elements.reduce((layer: Buffer[], element, index, arr) => {
    if (index % 2 === 0) {
      // only calculate hash for even indexes
      layer.push(combineHashBuffers(element, arr[index + 1]));
    }
    return layer;
  }, []);
}

/**
 * This function produces the hashes and the merkle tree
 * If there are no elements, return empty array of array
 */
function getLayers(elements: Buffer[]): Buffer[][] {
  if (elements.length === 0) {
    return [[]];
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
 */
function getPair(index: number, layer: any[]) {
  const pairIndex = index % 2 ? index - 1 : index + 1; // if odd return the index before it, else if even return the index after it
  if (pairIndex < layer.length) {
    return layer[pairIndex];
  }
  return null; // this happens when the given index is the last element in a layer with odd number of elements
}

/**
 * Finds all the "uncle" nodes required to prove a given element in the merkle tree
 */
function getProof(index: number, layers: any[]) {
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

export class MerkleTree {
  public elements: Buffer[];

  public layers: Buffer[][];

  public constructor(_elements: any[]) {
    this.elements = hashArray(_elements);

    // check buffers
    if (this.elements.some(e => !(e.length === 32 && Buffer.isBuffer(e)))) {
      throw new Error("elements must be 32 byte buffers");
    }

    this.layers = getLayers(this.elements);
  }

  public getRoot() {
    return this.layers[this.layers.length - 1][0];
  }

  public getProof(_element: any) {
    const element = toBuffer(_element);

    const index = this.elements.findIndex(e => e.equals(element)); // searches for given element in the merkle tree and returns the index
    if (index === -1) {
      throw new Error("Element not found");
    }
    return getProof(index, this.layers);
  }
}

/**
 * Function that runs through the supplied hashes to arrive at the supplied merkle root hash
 * @param _proof The list of uncle hashes required to arrive at the supplied merkle root
 * @param _root The merkle root
 * @param _element The leaf node that is being verified
 */
export const checkProof = function(_proof: any[], _root: any, _element: any) {
  const proof = _proof.map(step => hashToBuffer(step));
  const root = hashToBuffer(_root);
  const element = hashToBuffer(_element);
  const proofRoot = proof.reduce((hash, pair) => combineHashBuffers(hash, pair), element);

  return root.equals(proofRoot);
};
