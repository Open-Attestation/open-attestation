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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { bufSortJoin, hashToBuffer, toBuffer } from "../utils";
import { v4 as uuid } from "uuid";
import { MerkleTree } from "./merkle";
import { cloneDeep, get, sortBy, unset } from "lodash";
import { keccak256 } from "js-sha3";
import { compact } from "jsonld";
var deepMap = function (value, path) {
    if (Array.isArray(value)) {
        return value.flatMap(function (v, index) { return deepMap(v, path + "[" + index + "]"); });
    }
    if (typeof value === "object") {
        return Object.keys(value).flatMap(function (key) { return deepMap(value[key], path ? path + "." + key : key); });
    }
    if (typeof value === "string") {
        return [{ value: uuid(), path: path }];
    }
    throw new Error("unexpected element  " + value + " => " + path);
};
var salt = function (data) { return deepMap(data, ""); };
var digestDocument = function (document, salts, obfuscatedData) {
    // Prepare array of hashes from filtered data
    // const hashedDataArray = document.proof.signature.privacy.obfuscatedData;
    // console.log(JSON.stringify(salts, null, 2));
    // Prepare array of hashes from visible data
    var hashedUnhashedDataArray = salts
        .filter(function (salt) { return get(document, salt.path); })
        .map(function (salt) {
        // console.log(`[${salt.path}] = ${get(document, salt.path)}`);
        return keccak256(JSON.stringify(salt.value + ":" + get(document, salt.path)));
    });
    // Combine both array and sort them to ensure determinism
    var combinedHashes = obfuscatedData.concat(hashedUnhashedDataArray);
    var sortedHashes = sortBy(combinedHashes);
    // Finally, return the digest of the entire set of data
    return keccak256(JSON.stringify(sortedHashes));
};
var getId = function (objectOrString) {
    if (typeof objectOrString === "string") {
        return objectOrString;
    }
    return objectOrString.id;
};
/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */
var dateFullYear = /[0-9]{4}/;
var dateMonth = /(0[1-9]|1[0-2])/;
var dateMDay = /([12]\d|0[1-9]|3[01])/;
var timeHour = /([01][0-9]|2[0-3])/;
var timeMinute = /[0-5][0-9]/;
var timeSecond = /([0-5][0-9]|60)/;
var timeSecFrac = /(\.[0-9]+)?/;
var timeNumOffset = new RegExp("[-+]".concat(timeHour.source, ":").concat(timeMinute.source));
var timeOffset = new RegExp("([zZ]|".concat(timeNumOffset.source, ")"));
var partialTime = new RegExp(""
    .concat(timeHour.source, ":")
    .concat(timeMinute.source, ":")
    .concat(timeSecond.source)
    .concat(timeSecFrac.source));
var fullDate = new RegExp(""
    .concat(dateFullYear.source, "-")
    .concat(dateMonth.source, "-")
    .concat(dateMDay.source));
var fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
var rfc3339 = new RegExp("".concat(fullDate.source, "[ tT]").concat(fullTime.source));
var isValidRFC3339 = function (str) {
    return rfc3339.test(str);
};
export function validateV3(credential) {
    return __awaiter(this, void 0, void 0, function () {
        var issuerId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // ensure first context is 'https://www.w3.org/2018/credentials/v1'
                    if (Array.isArray(credential["@context"]) && credential["@context"][0] !== "https://www.w3.org/2018/credentials/v1") {
                        throw new Error("https://www.w3.org/2018/credentials/v1 needs to be first in the " + "list of contexts.");
                    }
                    issuerId = getId(credential.issuer);
                    if (!issuerId.includes(":")) {
                        throw new Error("Property `issuer` id must be a a valid RFC 3986 URI");
                    }
                    // ensure issuanceDate is a valid RFC3339 date
                    if (!isValidRFC3339(credential.issuanceDate)) {
                        throw new Error("Property `issuanceDate` must be a a valid RFC 3339 date");
                    }
                    // ensure expirationDate is a valid RFC3339 date
                    if (credential.expirationDate && !isValidRFC3339(credential.expirationDate)) {
                        throw new Error("Property `expirationDate` must be a a valid RFC 3339 date");
                    }
                    return [4 /*yield*/, compact(credential, "https://w3id.org/security/v2", {
                            expansionMap: function (info) {
                                if (info.unmappedProperty) {
                                    console.log(info.unmappedProperty);
                                    throw new Error('The property "' + info.unmappedProperty + '" in the input ' + "was not defined in the context.");
                                }
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export var wrapV3 = function (document) {
    document["@context"].push("https://gist.githubusercontent.com/Nebulis/18efab9f8801c886a7dd0f6230efd89d/raw/f9f3107cabd7768f84a36c65d756abd961d19bda/w3c.json.ld");
    var salts = salt(document);
    var digest = digestDocument(document, salts, []);
    var batchBuffers = [digest].map(hashToBuffer);
    var merkleTree = new MerkleTree(batchBuffers);
    var merkleRoot = merkleTree.getRoot().toString("hex");
    var merkleProof = merkleTree.getProof(hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
    return __assign(__assign({}, document), { proof: __assign(__assign({}, document.proof), { signature: {
                type: "SHA3MerkleProof",
                targetHash: digest,
                proof: merkleProof,
                merkleRoot: merkleRoot,
                salts: salts,
                privacy: {
                    obfuscatedData: []
                }
            } }) });
};
export var wrapsV3 = function (documents) {
    var salts = documents.map(function (document) {
        return salt(document);
    });
    var digests = documents.map(function (document, index) {
        return digestDocument(document, salts[index], []);
    });
    var batchBuffers = digests.map(hashToBuffer);
    var merkleTree = new MerkleTree(batchBuffers);
    var merkleRoot = merkleTree.getRoot().toString("hex");
    return documents.map(function (document, index) {
        var digest = digests[index];
        var merkleProof = merkleTree.getProof(hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
        return __assign(__assign({}, document), { proof: __assign(__assign({}, document.proof), { signature: {
                    type: "SHA3MerkleProof",
                    targetHash: digest,
                    proof: merkleProof,
                    merkleRoot: merkleRoot,
                    salts: salts[index],
                    privacy: {
                        obfuscatedData: []
                    }
                } }) });
    });
};
export var verifyV3 = function (document) {
    var signature = document.proof.signature;
    if (!signature) {
        return false;
    }
    // Checks target hash
    var bla = __assign(__assign({}, document), { proof: __assign(__assign({}, document.proof), { sinature: undefined }) });
    var digest = digestDocument(bla, document.proof.signature.salts, document.proof.signature.privacy.obfuscatedData);
    var targetHash = document.proof.signature.targetHash;
    if (digest !== targetHash)
        return false;
    // Calculates merkle root from target hash and proof, then compare to merkle root in document
    var merkleRoot = document.proof.signature.merkleRoot;
    var proof = document.proof.signature.proof;
    var calculatedMerkleRoot = proof.reduce(function (prev, current) {
        var prevAsBuffer = hashToBuffer(prev);
        var currAsBuffer = hashToBuffer(current);
        var combineAsBuffer = bufSortJoin(prevAsBuffer, currAsBuffer);
        return keccak256(combineAsBuffer);
    }, digest);
    return calculatedMerkleRoot === merkleRoot;
};
var obfuscateData = function (_data, fields) {
    var data = cloneDeep(_data); // Prevents alteration of original data
    var fieldsToRemove = Array.isArray(fields) ? fields : [fields];
    var salts = _data.proof.signature.salts;
    // Obfuscate data by hashing them with the key
    var obfuscatedData = fieldsToRemove
        .filter(function (field) { return get(data, field); })
        .map(function (field) {
        var value = get(data, field);
        var salt = salts.find(function (s) { return s.path === field; });
        if (!salt) {
            throw new Error("Salt not found for " + field);
        }
        return toBuffer(salt.value + ":" + value).toString("hex");
    });
    // Return remaining data
    fieldsToRemove.forEach(function (path) {
        unset(data, path);
    });
    return {
        data: data,
        obfuscatedData: obfuscatedData
    };
};
export var obfuscateV3 = function (document, fields) {
    var _a = obfuscateData(document, fields), data = _a.data, obfuscatedData = _a.obfuscatedData;
    var currentObfuscatedData = document.proof.signature.privacy.obfuscatedData;
    var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
    return __assign(__assign({}, data), { proof: __assign(__assign({}, data.proof), { signature: __assign(__assign({}, data.proof.signature), { privacy: __assign(__assign({}, data.proof.signature.privacy), { obfuscatedData: newObfuscatedData }) }) }) });
};
