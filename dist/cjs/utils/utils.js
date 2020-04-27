"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_sha3_1 = require("js-sha3");
var document_1 = require("../@types/document");
var salt_1 = require("../privacy/salt");
exports.getData = function (document) {
    return salt_1.unsaltData(document.data);
};
/**
 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
 */
function bufSortJoin() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Buffer.concat(__spreadArrays(args).sort(Buffer.compare));
}
exports.bufSortJoin = bufSortJoin;
// If hash is not a buffer, convert it to buffer (without hashing it)
function hashToBuffer(hash) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/23155
    return Buffer.isBuffer(hash) && hash.length === 32 ? hash : Buffer.from(hash, "hex");
}
exports.hashToBuffer = hashToBuffer;
// If element is not a buffer, stringify it and then hash it to be a buffer
function toBuffer(element) {
    return Buffer.isBuffer(element) && element.length === 32 ? element : hashToBuffer(js_sha3_1.keccak256(JSON.stringify(element)));
}
exports.toBuffer = toBuffer;
/**
 * Turns array of data into sorted array of hashes
 */
function hashArray(arr) {
    return arr.map(function (i) { return toBuffer(i); }).sort(Buffer.compare);
}
exports.hashArray = hashArray;
/**
 * Returns the keccak hash of two buffers after concatenating them and sorting them
 * If either hash is not given, the input is returned
 */
function combineHashBuffers(first, second) {
    if (!second) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return first; // it should always be valued if second is not
    }
    if (!first) {
        return second;
    }
    return hashToBuffer(js_sha3_1.keccak256(bufSortJoin(first, second)));
}
exports.combineHashBuffers = combineHashBuffers;
/**
 * Returns the keccak hash of two string after concatenating them and sorting them
 * If either hash is not given, the input is returned
 * @param first A string to be hashed (without 0x)
 * @param second A string to be hashed (without 0x)
 * @returns Resulting string after the hash is combined (without 0x)
 */
function combineHashString(first, second) {
    return first && second
        ? combineHashBuffers(hashToBuffer(first), hashToBuffer(second)).toString("hex")
        : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (first || second); // this should always return a value right ? :)
}
exports.combineHashString = combineHashString;
exports.isWrappedV3Document = function (document) {
    return document && document.version === document_1.SchemaId.v3;
};
exports.isWrappedV2Document = function (document) {
    return !exports.isWrappedV3Document(document);
};
function getIssuerAddress(document) {
    if (exports.isWrappedV2Document(document)) {
        var data = exports.getData(document);
        return data.issuers.map(function (issuer) { return issuer.certificateStore || issuer.documentStore || issuer.tokenRegistry; });
    }
    else if (exports.isWrappedV3Document(document)) {
        return document.proof.value;
    }
    throw new Error("");
}
exports.getIssuerAddress = getIssuerAddress;
// make it available for consumers
var js_sha3_2 = require("js-sha3");
exports.keccak256 = js_sha3_2.keccak256;
