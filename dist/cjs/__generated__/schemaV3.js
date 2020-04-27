"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Mime-type of attachment
 */
var MIMEType;
(function (MIMEType) {
    MIMEType["ApplicationPDF"] = "application/pdf";
    MIMEType["ImageJPEG"] = "image/jpeg";
    MIMEType["ImagePNG"] = "image/png";
})(MIMEType = exports.MIMEType || (exports.MIMEType = {}));
var IdentityType;
(function (IdentityType) {
    IdentityType["DNSTxt"] = "DNS-TXT";
    IdentityType["W3CDid"] = "W3C-DID";
})(IdentityType = exports.IdentityType || (exports.IdentityType = {}));
/**
 * Proof open attestation method
 */
var Method;
(function (Method) {
    Method["DocumentStore"] = "DOCUMENT_STORE";
    Method["TokenRegistry"] = "TOKEN_REGISTRY";
})(Method = exports.Method || (exports.Method = {}));
/**
 * Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types
 */
var ProofType;
(function (ProofType) {
    ProofType["OpenAttestationSignature2018"] = "OpenAttestationSignature2018";
})(ProofType = exports.ProofType || (exports.ProofType = {}));
/**
 * Type of renderer template
 */
var TemplateType;
(function (TemplateType) {
    TemplateType["EmbeddedRenderer"] = "EMBEDDED_RENDERER";
})(TemplateType = exports.TemplateType || (exports.TemplateType = {}));
