var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { keccak256 } from "js-sha3";
import { SchemaId } from "../@types/document";
import { unsaltData } from "../privacy/salt";
export var getData = function (document) {
    return unsaltData(document.data);
};
/**
 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
 */
export function bufSortJoin() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return Buffer.concat(__spreadArrays(args).sort(Buffer.compare));
}
// If hash is not a buffer, convert it to buffer (without hashing it)
export function hashToBuffer(hash) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/23155
    return Buffer.isBuffer(hash) && hash.length === 32 ? hash : Buffer.from(hash, "hex");
}
// If element is not a buffer, stringify it and then hash it to be a buffer
export function toBuffer(element) {
    return Buffer.isBuffer(element) && element.length === 32 ? element : hashToBuffer(keccak256(JSON.stringify(element)));
}
/**
 * Turns array of data into sorted array of hashes
 */
export function hashArray(arr) {
    return arr.map(function (i) { return toBuffer(i); }).sort(Buffer.compare);
}
/**
 * Returns the keccak hash of two buffers after concatenating them and sorting them
 * If either hash is not given, the input is returned
 */
export function combineHashBuffers(first, second) {
    if (!second) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return first; // it should always be valued if second is not
    }
    if (!first) {
        return second;
    }
    return hashToBuffer(keccak256(bufSortJoin(first, second)));
}
/**
 * Returns the keccak hash of two string after concatenating them and sorting them
 * If either hash is not given, the input is returned
 * @param first A string to be hashed (without 0x)
 * @param second A string to be hashed (without 0x)
 * @returns Resulting string after the hash is combined (without 0x)
 */
export function combineHashString(first, second) {
    return first && second
        ? combineHashBuffers(hashToBuffer(first), hashToBuffer(second)).toString("hex")
        : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (first || second); // this should always return a value right ? :)
}
export var isWrappedV3Document = function (document) {
    return document && document.version === SchemaId.v3;
};
export var isWrappedV2Document = function (document) {
    return !isWrappedV3Document(document);
};
export function getIssuerAddress(document) {
    if (isWrappedV2Document(document)) {
        var data = getData(document);
        return data.issuers.map(function (issuer) { return issuer.certificateStore || issuer.documentStore || issuer.tokenRegistry; });
    }
    else if (isWrappedV3Document(document)) {
        return document.proof.value;
    }
    throw new Error("");
}
// make it available for consumers
export { keccak256 } from "js-sha3";
