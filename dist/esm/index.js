var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { digestDocument } from "./digest";
import { getSchema, validateSchema as validate } from "./schema";
import { verify, wrap } from "./signature";
import { SchemaId } from "./@types/document";
import { saltData } from "./privacy/salt";
import * as utils from "./utils";
import * as v2 from "./__generated__/schemaV2";
import * as v3 from "./__generated__/schemaV3";
import { obfuscateV3, validateV3, verifyV3, wrapsV3, wrapV3 } from "./signature/signature.v3";
import { obfuscateDocument } from "./privacy";
var defaultVersion = SchemaId.v2;
var createDocument = function (data, option) {
    var _a, _b, _c;
    var documentSchema = {
        version: (_b = (_a = option) === null || _a === void 0 ? void 0 : _a.version, (_b !== null && _b !== void 0 ? _b : defaultVersion)),
        data: saltData(data)
    };
    if ((_c = option) === null || _c === void 0 ? void 0 : _c.externalSchemaId) {
        documentSchema.schema = option.externalSchemaId;
    }
    return documentSchema;
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
var isSchemaValidationError = function (error) {
    return !!error.validationErrors;
};
export function wrapDocument(data, options) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var wrappedDocument, errors_1, document, errors;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(((_a = options) === null || _a === void 0 ? void 0 : _a.version) === SchemaId.v3)) return [3 /*break*/, 2];
                    wrappedDocument = options.externalSchemaId
                        ? wrapV3(__assign({ schema: options.externalSchemaId, version: SchemaId.v3 }, data))
                        : wrapV3(__assign({ version: SchemaId.v3 }, data));
                    errors_1 = validate(wrappedDocument, getSchema(SchemaId.v3));
                    if (errors_1.length > 0) {
                        console.log(errors_1);
                        throw new SchemaValidationError("Invalid document", errors_1, wrappedDocument);
                    }
                    return [4 /*yield*/, validateV3(wrappedDocument)];
                case 1:
                    _d.sent();
                    return [2 /*return*/, wrappedDocument];
                case 2:
                    document = createDocument(data, options);
                    errors = validate(document, getSchema((_c = (_b = options) === null || _b === void 0 ? void 0 : _b.version, (_c !== null && _c !== void 0 ? _c : defaultVersion))));
                    if (errors.length > 0) {
                        throw new SchemaValidationError("Invalid document", errors, document);
                    }
                    return [2 /*return*/, wrap(document, [digestDocument(document)])];
            }
        });
    });
}
export function wrapDocuments(dataArray, options) {
    var _a;
    if (((_a = options) === null || _a === void 0 ? void 0 : _a.version) === SchemaId.v3) {
        var documents_1 = dataArray.map(function (data) {
            return options.externalSchemaId
                ? __assign({ schema: options.externalSchemaId, version: SchemaId.v3 }, data) : __assign({ version: SchemaId.v3 }, data);
        });
        var wrappedDocument = wrapsV3(documents_1);
        wrappedDocument.forEach(function (document) {
            var _a, _b;
            var errors = validate(document, getSchema((_b = (_a = options) === null || _a === void 0 ? void 0 : _a.version, (_b !== null && _b !== void 0 ? _b : defaultVersion))));
            if (errors.length > 0) {
                throw new SchemaValidationError("Invalid document", errors, document);
            }
        });
        return wrappedDocument;
    }
    var documents = dataArray.map(function (data) { return createDocument(data, options); });
    documents.forEach(function (document) {
        var _a, _b;
        var errors = validate(document, getSchema((_b = (_a = options) === null || _a === void 0 ? void 0 : _a.version, (_b !== null && _b !== void 0 ? _b : defaultVersion))));
        if (errors.length > 0) {
            throw new SchemaValidationError("Invalid document", errors, document);
        }
    });
    var batchHashes = documents.map(digestDocument);
    return documents.map(function (doc) { return wrap(doc, batchHashes); });
}
export var validateSchema = function (document) {
    var _a;
    return validate(document, getSchema("" + (((_a = document) === null || _a === void 0 ? void 0 : _a.version) || SchemaId.v2))).length === 0;
};
export function verifySignature(document) {
    return document.version === SchemaId.v3 ? verifyV3(document) : verify(document);
}
export function obfuscate(document, fields) {
    return document.version === SchemaId.v3 ? obfuscateV3(document, fields) : obfuscateDocument(document, fields);
}
export { digestDocument } from "./digest";
export { checkProof, MerkleTree } from "./signature";
export { obfuscateDocument } from "./privacy";
export { sign } from "./sign";
export { utils, isSchemaValidationError };
export * from "./@types/document";
export * from "./schema/3.0/w3c";
export { getData } from "./utils"; // keep it to avoid breaking change, moved from privacy to utils
export { v2 };
export { v3 };
