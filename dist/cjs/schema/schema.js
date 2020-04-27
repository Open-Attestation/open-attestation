"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ajv_1 = __importDefault(require("ajv"));
var logger_1 = require("../logger");
var schema_json_1 = __importDefault(require("./2.0/schema.json"));
var schema_json_2 = __importDefault(require("./3.0/schema.json"));
var utils_1 = require("../utils");
var document_1 = require("../@types/document");
var logger = logger_1.getLogger("validate");
exports.validateSchema = function (document, validator) {
    var _a;
    if (!validator) {
        throw new Error("No schema validator provided");
    }
    var valid = validator(document.version === document_1.SchemaId.v3 ? document : utils_1.getData(document));
    if (!valid) {
        logger.debug("There are errors in the document");
        logger.debug(validator.errors);
        return _a = validator.errors, (_a !== null && _a !== void 0 ? _a : []);
    }
    logger.debug("Document is a valid open attestation document v" + document.version);
    return [];
};
var ajv = new ajv_1.default({ allErrors: true });
ajv.compile(schema_json_1.default);
ajv.compile(schema_json_2.default);
exports.getSchema = function (key) { return ajv.getSchema(key); };
