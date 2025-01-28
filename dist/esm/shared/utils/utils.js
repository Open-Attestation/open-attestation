var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { keccak256 } from "js-sha3";
import { unsaltData } from "../../2.0/salt";
import { isWrappedV2Document, isWrappedV3Document } from "./guard";
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
    return Buffer.concat(__spreadArray([], args).sort(Buffer.compare));
}
// If hash is not a buffer, convert it to buffer (without hashing it)
export function hashToBuffer(hash) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
export function getIssuerAddress(document) {
    if (isWrappedV2Document(document)) {
        var data = getData(document);
        return data.issuers.map(function (issuer) { return issuer.certificateStore || issuer.documentStore || issuer.tokenRegistry; });
    }
    else if (isWrappedV3Document(document)) {
        return document.openAttestationMetadata.proof.value;
    }
    throw new Error("Unsupported document type: Only can retrieve issuer address from wrapped OpenAttestation v2 & v3 documents.");
}
export var getMerkleRoot = function (document) {
    switch (true) {
        case isWrappedV2Document(document):
            return document.signature.merkleRoot;
        case isWrappedV3Document(document):
            return document.proof.merkleRoot;
        default:
            throw new Error("Unsupported document type: Only can retrieve merkle root from wrapped OpenAttestation v2 & v3 documents.");
    }
};
export var getTargetHash = function (document) {
    switch (true) {
        case isWrappedV2Document(document):
            return document.signature.targetHash;
        case isWrappedV3Document(document):
            return document.proof.targetHash;
        default:
            throw new Error("Unsupported document type: Only can retrieve target hash from wrapped OpenAttestation v2 & v3 documents.");
    }
};
export var isTransferableAsset = function (document) {
    var _a, _b, _c, _d;
    return (!!((_b = (_a = getData(document)) === null || _a === void 0 ? void 0 : _a.issuers[0]) === null || _b === void 0 ? void 0 : _b.tokenRegistry) ||
        ((_d = (_c = document === null || document === void 0 ? void 0 : document.openAttestationMetadata) === null || _c === void 0 ? void 0 : _c.proof) === null || _d === void 0 ? void 0 : _d.method) === "TOKEN_REGISTRY");
};
export var getAssetId = function (document) {
    if (isTransferableAsset(document)) {
        return getTargetHash(document);
    }
    throw new Error("Unsupported document type: Only can retrieve asset id from wrapped OpenAttestation v2 & v3 transferable documents.");
};
var SchemaValidationError = /** @class */ (function (_super) {
    __extends(SchemaValidationError, _super);
    function SchemaValidationError(message, validationErrors, document) {
        var _this = _super.call(this, message) || this;
        _this.validationErrors = validationErrors;
        _this.document = document;
        return _this;
    }
    return SchemaValidationError;
}(Error));
export { SchemaValidationError };
export var isSchemaValidationError = function (error) {
    return !!error.validationErrors;
};
// make it available for consumers
export { keccak256 } from "js-sha3";
export var isObfuscated = function (document) {
    var _a, _b, _c, _d;
    if (isWrappedV3Document(document)) {
        return !!((_b = (_a = document.proof.privacy) === null || _a === void 0 ? void 0 : _a.obfuscated) === null || _b === void 0 ? void 0 : _b.length);
    }
    if (isWrappedV2Document(document)) {
        return !!((_d = (_c = document.privacy) === null || _c === void 0 ? void 0 : _c.obfuscatedData) === null || _d === void 0 ? void 0 : _d.length);
    }
    throw new Error("Unsupported document type: Can only check if there are obfuscated data from wrapped OpenAttestation v2 & v3 documents.");
};
export var getObfuscatedData = function (document) {
    var _a, _b;
    if (isWrappedV3Document(document)) {
        return (_a = document.proof.privacy) === null || _a === void 0 ? void 0 : _a.obfuscated;
    }
    if (isWrappedV2Document(document)) {
        return ((_b = document.privacy) === null || _b === void 0 ? void 0 : _b.obfuscatedData) || [];
    }
    throw new Error("Unsupported document type: Can only retrieve obfuscated data from wrapped OpenAttestation v2 & v3 documents.");
};
