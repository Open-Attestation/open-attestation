/**
 * Mime-type of attachment
 */
export var MIMEType;
(function (MIMEType) {
    MIMEType["ApplicationPDF"] = "application/pdf";
    MIMEType["ImageJPEG"] = "image/jpeg";
    MIMEType["ImagePNG"] = "image/png";
})(MIMEType || (MIMEType = {}));
export var IdentityType;
(function (IdentityType) {
    IdentityType["DNSTxt"] = "DNS-TXT";
    IdentityType["W3CDid"] = "W3C-DID";
})(IdentityType || (IdentityType = {}));
/**
 * Proof open attestation method
 */
export var Method;
(function (Method) {
    Method["DocumentStore"] = "DOCUMENT_STORE";
    Method["TokenRegistry"] = "TOKEN_REGISTRY";
})(Method || (Method = {}));
/**
 * Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types
 */
export var ProofType;
(function (ProofType) {
    ProofType["OpenAttestationSignature2018"] = "OpenAttestationSignature2018";
})(ProofType || (ProofType = {}));
/**
 * Type of renderer template
 */
export var TemplateType;
(function (TemplateType) {
    TemplateType["EmbeddedRenderer"] = "EMBEDDED_RENDERER";
})(TemplateType || (TemplateType = {}));
