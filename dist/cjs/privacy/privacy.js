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
var flatten_1 = require("../serialize/flatten");
var utils_1 = require("../utils");
exports.obfuscateData = function (_data, fields) {
    var data = lodash_1.cloneDeep(_data); // Prevents alteration of original data
    var fieldsToRemove = Array.isArray(fields) ? fields : [fields];
    // Obfuscate data by hashing them with the key
    var dataToObfuscate = flatten_1.flatten(lodash_1.pick(data, fieldsToRemove));
    var obfuscatedData = Object.keys(dataToObfuscate).map(function (k) {
        var obj = {};
        obj[k] = dataToObfuscate[k];
        return utils_1.toBuffer(obj).toString("hex");
    });
    // Return remaining data
    fieldsToRemove.forEach(function (path) {
        lodash_1.unset(data, path);
    });
    return {
        data: data,
        obfuscatedData: obfuscatedData
    };
};
// TODO to improve user experience and provide better feedback on what's wrong for non typescript user we might consider performing validation on the object provided
exports.obfuscateDocument = function (document, fields) {
    var _a, _b, _c;
    var existingData = document.data;
    var _d = exports.obfuscateData(existingData, fields), data = _d.data, obfuscatedData = _d.obfuscatedData;
    var currentObfuscatedData = (_c = (_b = (_a = document) === null || _a === void 0 ? void 0 : _a.privacy) === null || _b === void 0 ? void 0 : _b.obfuscatedData, (_c !== null && _c !== void 0 ? _c : []));
    var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
    return __assign(__assign({}, document), { data: data, privacy: __assign(__assign({}, document.privacy), { obfuscatedData: newObfuscatedData }) });
};
