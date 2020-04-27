"use strict";
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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var digest_1 = require("./digest");
var schema_1 = require("./schema");
var signature_1 = require("./signature");
var document_1 = require("./@types/document");
var salt_1 = require("./privacy/salt");
var utils = __importStar(require("./utils"));
exports.utils = utils;
var v2 = __importStar(require("./__generated__/schemaV2"));
exports.v2 = v2;
var v3 = __importStar(require("./__generated__/schemaV3"));
exports.v3 = v3;
var signature_v3_1 = require("./signature/signature.v3");
var privacy_1 = require("./privacy");
var defaultVersion = document_1.SchemaId.v2;
var createDocument = function (data, option) {
    var _a, _b, _c;
    var documentSchema = {
        version: (_b = (_a = option) === null || _a === void 0 ? void 0 : _a.version, (_b !== null && _b !== void 0 ? _b : defaultVersion)),
        data: salt_1.saltData(data)
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
exports.isSchemaValidationError = isSchemaValidationError;
function wrapDocument(data, options) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var wrappedDocument, errors_1, document, errors;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(((_a = options) === null || _a === void 0 ? void 0 : _a.version) === document_1.SchemaId.v3)) return [3 /*break*/, 2];
                    wrappedDocument = options.externalSchemaId
                        ? signature_v3_1.wrapV3(__assign({ schema: options.externalSchemaId, version: document_1.SchemaId.v3 }, data))
                        : signature_v3_1.wrapV3(__assign({ version: document_1.SchemaId.v3 }, data));
                    errors_1 = schema_1.validateSchema(wrappedDocument, schema_1.getSchema(document_1.SchemaId.v3));
                    if (errors_1.length > 0) {
                        console.log(errors_1);
                        throw new SchemaValidationError("Invalid document", errors_1, wrappedDocument);
                    }
                    return [4 /*yield*/, signature_v3_1.validateV3(wrappedDocument)];
                case 1:
                    _d.sent();
                    return [2 /*return*/, wrappedDocument];
                case 2:
                    document = createDocument(data, options);
                    errors = schema_1.validateSchema(document, schema_1.getSchema((_c = (_b = options) === null || _b === void 0 ? void 0 : _b.version, (_c !== null && _c !== void 0 ? _c : defaultVersion))));
                    if (errors.length > 0) {
                        throw new SchemaValidationError("Invalid document", errors, document);
                    }
                    return [2 /*return*/, signature_1.wrap(document, [digest_1.digestDocument(document)])];
            }
        });
    });
}
exports.wrapDocument = wrapDocument;
function wrapDocuments(dataArray, options) {
    var _a;
    if (((_a = options) === null || _a === void 0 ? void 0 : _a.version) === document_1.SchemaId.v3) {
        var documents_1 = dataArray.map(function (data) {
            return options.externalSchemaId
                ? __assign({ schema: options.externalSchemaId, version: document_1.SchemaId.v3 }, data) : __assign({ version: document_1.SchemaId.v3 }, data);
        });
        var wrappedDocument = signature_v3_1.wrapsV3(documents_1);
        wrappedDocument.forEach(function (document) {
            var _a, _b;
            var errors = schema_1.validateSchema(document, schema_1.getSchema((_b = (_a = options) === null || _a === void 0 ? void 0 : _a.version, (_b !== null && _b !== void 0 ? _b : defaultVersion))));
            if (errors.length > 0) {
                throw new SchemaValidationError("Invalid document", errors, document);
            }
        });
        return wrappedDocument;
    }
    var documents = dataArray.map(function (data) { return createDocument(data, options); });
    documents.forEach(function (document) {
        var _a, _b;
        var errors = schema_1.validateSchema(document, schema_1.getSchema((_b = (_a = options) === null || _a === void 0 ? void 0 : _a.version, (_b !== null && _b !== void 0 ? _b : defaultVersion))));
        if (errors.length > 0) {
            throw new SchemaValidationError("Invalid document", errors, document);
        }
    });
    var batchHashes = documents.map(digest_1.digestDocument);
    return documents.map(function (doc) { return signature_1.wrap(doc, batchHashes); });
}
exports.wrapDocuments = wrapDocuments;
exports.validateSchema = function (document) {
    var _a;
    return schema_1.validateSchema(document, schema_1.getSchema("" + (((_a = document) === null || _a === void 0 ? void 0 : _a.version) || document_1.SchemaId.v2))).length === 0;
};
function verifySignature(document) {
    return document.version === document_1.SchemaId.v3 ? signature_v3_1.verifyV3(document) : signature_1.verify(document);
}
exports.verifySignature = verifySignature;
function obfuscate(document, fields) {
    return document.version === document_1.SchemaId.v3 ? signature_v3_1.obfuscateV3(document, fields) : privacy_1.obfuscateDocument(document, fields);
}
exports.obfuscate = obfuscate;
var digest_2 = require("./digest");
exports.digestDocument = digest_2.digestDocument;
var signature_2 = require("./signature");
exports.checkProof = signature_2.checkProof;
exports.MerkleTree = signature_2.MerkleTree;
var privacy_2 = require("./privacy");
exports.obfuscateDocument = privacy_2.obfuscateDocument;
var sign_1 = require("./sign");
exports.sign = sign_1.sign;
__export(require("./@types/document"));
__export(require("./schema/3.0/w3c"));
var utils_1 = require("./utils"); // keep it to avoid breaking change, moved from privacy to utils
exports.getData = utils_1.getData;
