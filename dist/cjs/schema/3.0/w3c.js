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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var deepMap = function (value, path) {
    if (Array.isArray(value)) {
        return value.flatMap(function (v, index) { return deepMap(v, path + "[" + index + "]"); });
    }
    if (typeof value === "object") {
        return Object.keys(value).flatMap(function (key) { return deepMap(value[key], path ? path + "." + key : key); });
    }
    if (typeof value === "string") {
        var _a = value.split(":"), salt = _a[0], type = _a[1];
        return [{ type: type, value: salt, path: path }];
    }
    throw new Error("unexpected element  " + value + " => " + path);
};
var getSalts = function (document) {
    return deepMap(document.data, "");
};
/**
 * This function is not production ready and is a simple POC to demonstrate that we are able to transform our document to W3C VC
 * https://www.w3.org/TR/vc-data-model/#types
 */
// make it obvious that this function is not production ready
// eslint-disable-next-line @typescript-eslint/camelcase
exports.__unsafe__mapToW3cVc = function (document) {
    var _a = utils_1.getData(document), proof = _a.proof, issuer = _a.issuer, evidence = _a.evidence, type = _a.type, validFrom = _a.validFrom, validUntil = _a.validUntil, context = _a["@context"], rest = __rest(_a, ["proof", "issuer", "evidence", "type", "validFrom", "validUntil", "@context"]);
    var salts = getSalts(document);
    return {
        "@context": __spreadArrays(((context !== null && context !== void 0 ? context : []))),
        type: __spreadArrays(["VerifiableCredential"], ((type !== null && type !== void 0 ? type : []))).filter(Boolean),
        issuer: issuer,
        validFrom: validFrom,
        validUntil: validUntil,
        credentialSubject: __assign({}, rest),
        evidence: evidence,
        issuanceDate: new Date().toISOString(),
        proof: __assign(__assign({}, proof), { salts: salts, signature: document.signature })
    };
};
