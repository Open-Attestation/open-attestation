"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var js_sha3_1 = require("js-sha3");
var digest_1 = require("../digest");
var merkle_1 = require("./merkle");
var utils_1 = require("../utils");
exports.wrap = function (document, batch) {
    var digest = digest_1.digestDocument(document);
    if (batch && !batch.includes(digest)) {
        throw new Error("Document is not in batch");
    }
    var batchBuffers = (batch || [digest]).map(utils_1.hashToBuffer);
    var merkleTree = new merkle_1.MerkleTree(batchBuffers);
    var merkleRoot = merkleTree.getRoot().toString("hex");
    var merkleProof = merkleTree.getProof(utils_1.hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
    var signature = {
        type: "SHA3MerkleProof",
        targetHash: digest,
        proof: merkleProof,
        merkleRoot: merkleRoot
    };
    return __assign(__assign({}, document), { signature: signature });
};
exports.verify = function (document) {
    var signature = lodash_1.get(document, "signature");
    if (!signature) {
        return false;
    }
    // Checks target hash
    var digest = digest_1.digestDocument(document);
    var targetHash = lodash_1.get(document, "signature.targetHash");
    if (digest !== targetHash)
        return false;
    // Calculates merkle root from target hash and proof, then compare to merkle root in document
    var merkleRoot = lodash_1.get(document, "signature.merkleRoot");
    var proof = lodash_1.get(document, "signature.proof", []);
    var calculatedMerkleRoot = proof.reduce(function (prev, current) {
        var prevAsBuffer = utils_1.hashToBuffer(prev);
        var currAsBuffer = utils_1.hashToBuffer(current);
        var combineAsBuffer = utils_1.bufSortJoin(prevAsBuffer, currAsBuffer);
        return js_sha3_1.keccak256(combineAsBuffer);
    }, digest);
    return calculatedMerkleRoot === merkleRoot;
};
