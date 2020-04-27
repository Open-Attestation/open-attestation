import { keccak256 } from "js-sha3";
import { hashArray, hashToBuffer, toBuffer } from "../utils";
import { checkProof, MerkleTree } from "./merkle";

describe("merkle", () => {
  const arr = ["item1", "item2", "item3", "item4", "item5"];
  const bufferArr = hashArray(arr);
  const tree = new MerkleTree(bufferArr);

  describe("MerkleTree", () => {
    test("creates a merkle tree", () => {
      expect(tree.getRoot()).not.toBeNull();
      expect(tree.layers.length).toBe(4);
    });

    test("has a proof for an element", () => {
      const proof = tree.getProof(arr[0]);
      expect(proof).not.toBeNull();
    });

    test("throws if item does not exist", () => {
      function proof() {
        return tree.getProof("SOMETHING_ELSE");
      }
      expect(proof).toThrow();
    });

    test("check if proof is valid for all items", () => {
      arr.forEach(i => {
        const hash = keccak256(JSON.stringify(i));
        const proof = tree.getProof(i);
        const checkResults = checkProof(proof, tree.getRoot(), hash);
        expect(checkResults).toBe(true);
      });
    });

    test("creates the tree properly if there is an even number of elements", () => {
      // this happens to create a merkle tree that requires no reordering
      const evenTree = new MerkleTree(["a", "b", "c", "d2"]);

      expect(evenTree.layers[0].length).toEqual(4);
      expect(evenTree.layers[1].length).toEqual(2);
      expect(evenTree.layers[2].length).toEqual(1);

      const layer0 = evenTree.layers[0];
      const layer1 = evenTree.layers[1];
      const layer2 = evenTree.layers[2];

      expect(hashToBuffer(keccak256(Buffer.concat([layer0[0], layer0[1]])))).toEqual(layer1[0]);
      expect(hashToBuffer(keccak256(Buffer.concat([layer0[2], layer0[3]])))).toEqual(layer1[1]);
      expect(hashToBuffer(keccak256(Buffer.concat([layer1[0], layer1[1]])))).toEqual(layer2[0]);
    });

    test("creates the tree properly if there is an odd number of elements", () => {
      const oddTree = new MerkleTree(["a", "b", "c"]);
      const thirdElement = oddTree.elements[2];

      expect(oddTree.layers[0][2]).toEqual(thirdElement);
      expect(oddTree.layers[1][1]).toEqual(thirdElement); // checks that the lone element got promoted to next layer
    });

    test("calculates the hash correctly if the intermediate nodes are not lexicographically sorted", () => {
      const outOfOrderTree = new MerkleTree(["a", "b", "c", "d"]);
      // this happens to create a merkle tree with a second layer of
      // [ <Buffer 6d bf 31 7e 3f 6d 6a b9 ea d8 62 e7 f9 42 39 69 ab f2 76 c2 b4 a1 37 72 21 76 ba 85 dc 07 ed 3e>,
      //   <Buffer 6d 56 59 80 9f 50 5c 16 5b e5 83 58 79 73 1d e9 4c 1d 1a 1e 6a d4 02 25 51 d5 13 17 9b 4d 92 c6> ]
      // which is out of order and should be swapped before hashing

      const secondLayer = outOfOrderTree.layers[1];
      const hash = hashToBuffer(keccak256(Buffer.concat([secondLayer[1], secondLayer[0]])));

      expect(hash).toEqual(outOfOrderTree.layers[2][0]);
    });
  });

  describe("checkProof", () => {
    test("returns true for valid proof", () => {
      const proof = tree.getProof(arr[1]);
      const checkResults = checkProof(proof, tree.getRoot(), toBuffer(arr[1]));
      expect(checkResults).toBe(true);
    });

    test("returns false for invalid proof", () => {
      const proof = tree.getProof(arr[0]);
      const checkResults = checkProof(proof, tree.getRoot(), toBuffer(arr[1]));
      expect(checkResults).toBe(false);
    });
  });
});
