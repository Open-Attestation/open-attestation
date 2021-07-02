"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextLoader = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var preloadedContextUrls = [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
];
// Module scoped - subsequent imports and calls to ContextLoader.loadContext will receive the latest updated value of contextMap and isCached
// https://stackoverflow.com/a/48173881/6514532
var contextMap = new Map();
var isCached;
var ContextLoader = /** @class */ (function () {
    function ContextLoader() {
        if (isCached == null) {
            isCached = this.preLoad();
        }
    }
    ContextLoader.prototype.fetchContext = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var repsonse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default(url, { headers: { accept: "application/json" } })];
                    case 1:
                        repsonse = _a.sent();
                        return [2 /*return*/, repsonse.json()];
                }
            });
        });
    };
    // There is ambiguity between the objects fetched from the url
    // they can be of type RemoteDocument or JsonLd
    ContextLoader.prototype.isRemoteDocument = function (obj) {
        return obj.document !== undefined && obj.documentUrl !== undefined;
    };
    ContextLoader.prototype.preLoad = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = preloadedContextUrls.map(function (url) { return __awaiter(_this, void 0, void 0, function () {
                            var jsonLdObj, remoteDocument;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.fetchContext(url)];
                                    case 1:
                                        jsonLdObj = _a.sent();
                                        remoteDocument = {
                                            contextUrl: undefined,
                                            document: jsonLdObj,
                                            documentUrl: url,
                                        };
                                        contextMap.set(url, remoteDocument);
                                        return [2 /*return*/, null];
                                }
                            });
                        }); });
                        // let all promises resolve or reject concurrently
                        // return true when all promises have completed, regardless of outcome
                        return [4 /*yield*/, Promise.allSettled(promises)];
                    case 1:
                        // let all promises resolve or reject concurrently
                        // return true when all promises have completed, regardless of outcome
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ContextLoader.prototype.loadContext = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonLdObj, remoteDocument;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // wait for caching to complete
                    return [4 /*yield*/, isCached];
                    case 1:
                        // wait for caching to complete
                        _a.sent();
                        // if cache has the url, and the value is not null
                        if (contextMap.get(url) != null) {
                            console.trace("preloaded key found: " + url);
                            return [2 /*return*/, contextMap.get(url)];
                        }
                        return [4 /*yield*/, this.fetchContext(url)];
                    case 2:
                        jsonLdObj = _a.sent();
                        if (this.isRemoteDocument(jsonLdObj)) {
                            contextMap.set(url, jsonLdObj);
                        }
                        else {
                            remoteDocument = {
                                contextUrl: undefined,
                                document: jsonLdObj,
                                documentUrl: url,
                            };
                            contextMap.set(url, remoteDocument);
                        }
                        return [2 /*return*/, contextMap.get(url)];
                }
            });
        });
    };
    return ContextLoader;
}());
exports.ContextLoader = ContextLoader;
