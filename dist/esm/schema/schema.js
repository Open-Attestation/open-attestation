import Ajv from "ajv";
import { getLogger } from "../logger";
import openAttestationSchemav2 from "./2.0/schema.json";
import openAttestationSchemav3 from "./3.0/schema.json";
import { getData } from "../utils";
import { SchemaId } from "../@types/document";
var logger = getLogger("validate");
export var validateSchema = function (document, validator) {
    var _a;
    if (!validator) {
        throw new Error("No schema validator provided");
    }
    var valid = validator(document.version === SchemaId.v3 ? document : getData(document));
    if (!valid) {
        logger.debug("There are errors in the document");
        logger.debug(validator.errors);
        return _a = validator.errors, (_a !== null && _a !== void 0 ? _a : []);
    }
    logger.debug("Document is a valid open attestation document v" + document.version);
    return [];
};
var ajv = new Ajv({ allErrors: true });
ajv.compile(openAttestationSchemav2);
ajv.compile(openAttestationSchemav3);
export var getSchema = function (key) { return ajv.getSchema(key); };
