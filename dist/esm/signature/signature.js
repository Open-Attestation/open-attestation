var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { get } from "lodash";
import { keccak256 } from "js-sha3";
import { digestDocument } from "../digest";
import { MerkleTree } from "./merkle";
import { hashToBuffer, bufSortJoin } from "../utils";
export var wrap = function (document, batch) {
    var digest = digestDocument(document);
    if (batch && !batch.includes(digest)) {
        throw new Error("Document is not in batch");
    }
    var batchBuffers = (batch || [digest]).map(hashToBuffer);
    var merkleTree = new MerkleTree(batchBuffers);
    var merkleRoot = merkleTree.getRoot().toString("hex");
    var merkleProof = merkleTree.getProof(hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
    var signature = {
        type: "SHA3MerkleProof",
        targetHash: digest,
        proof: merkleProof,
        merkleRoot: merkleRoot
    };
    return __assign(__assign({}, document), { signature: signature });
};
export var verify = function (document) {
    var signature = get(document, "signature");
    if (!signature) {
        return false;
    }
    // Checks target hash
    var digest = digestDocument(document);
    var targetHash = get(document, "signature.targetHash");
    if (digest !== targetHash)
        return false;
    // Calculates merkle root from target hash and proof, then compare to merkle root in document
    var merkleRoot = get(document, "signature.merkleRoot");
    var proof = get(document, "signature.proof", []);
    var calculatedMerkleRoot = proof.reduce(function (prev, current) {
        var prevAsBuffer = hashToBuffer(prev);
        var currAsBuffer = hashToBuffer(current);
        var combineAsBuffer = bufSortJoin(prevAsBuffer, currAsBuffer);
        return keccak256(combineAsBuffer);
    }, digest);
    return calculatedMerkleRoot === merkleRoot;
};
