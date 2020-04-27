export interface OpenAttestationDocument {
    /**
     * List of URI to determine the terminology used in the verifiable credential as explained
     * by https://www.w3.org/TR/vc-data-model/#contexts
     */
    "@context"?: string[];
    credentialSubject: any[] | {
        [key: string]: any;
    };
    evidence?: Evidence[];
    /**
     * The date and time when a credential becomes valid
     */
    expirationDate?: string;
    /**
     * URI to the subject of the credential as explained by
     * https://www.w3.org/TR/vc-data-model/#credential-subject
     */
    id?: string;
    /**
     * The date and time when a credential becomes valid
     */
    issuanceDate: string;
    issuer: Issuer | string;
    /**
     * Human readable name of the credential
     */
    name?: string;
    proof: Proof;
    recipient?: Recipient;
    /**
     * Internal reference, usually serial number, of this document
     */
    reference?: string;
    template: Template;
    /**
     * Specific verifiable credential type as explained by
     * https://www.w3.org/TR/vc-data-model/#types
     */
    type?: string[];
    /**
     * Date and time when a credential becomes valid.
     */
    validFrom?: string;
    /**
     * Date and time when a credential becomes valid.
     */
    validUntil?: string;
}
export interface Evidence {
    /**
     * Base64 encoding of attachment
     */
    data: string;
    /**
     * Name of attachment, with appropriate extensions
     */
    filename: string;
    /**
     * The id property is optional, but if present, SHOULD contain a URL that points to where
     * more information about this instance of evidence can be found.
     */
    id?: string;
    /**
     * Mime-type of attachment
     */
    mimeType: MIMEType;
    /**
     * A valid evidence type as explained by https://www.w3.org/TR/vc-data-model/#types
     */
    type: string;
}
/**
 * Mime-type of attachment
 */
export declare enum MIMEType {
    ApplicationPDF = "application/pdf",
    ImageJPEG = "image/jpeg",
    ImagePNG = "image/png"
}
export interface Issuer {
    /**
     * URI when dereferenced, results in a document containing machine-readable information
     * about the issuer that can be used to verify the information expressed in the credential.
     * More information in https://www.w3.org/TR/vc-data-model/#issuer
     */
    id: string;
    /**
     * Issuer's name
     */
    name: string;
}
export interface Proof {
    identity: Identity;
    /**
     * Proof open attestation method
     */
    method: Method;
    /**
     * Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types
     */
    type: ProofType;
    /**
     * Proof value for issuer(s)
     */
    value: string;
}
export interface Identity {
    /**
     * Url of the website referencing to document store OR valid DID as defined by W3C:
     * https://www.w3.org/TR/did-core/
     */
    location: string;
    type: IdentityType;
}
export declare enum IdentityType {
    DNSTxt = "DNS-TXT",
    W3CDid = "W3C-DID"
}
/**
 * Proof open attestation method
 */
export declare enum Method {
    DocumentStore = "DOCUMENT_STORE",
    TokenRegistry = "TOKEN_REGISTRY"
}
/**
 * Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types
 */
export declare enum ProofType {
    OpenAttestationSignature2018 = "OpenAttestationSignature2018"
}
export interface Recipient {
    /**
     * Recipient's name
     */
    name?: string;
}
export interface Template {
    /**
     * Template name to be use by template renderer to determine the template to use
     */
    name: string;
    /**
     * Type of renderer template
     */
    type: TemplateType;
    /**
     * URL of a decentralised renderer to render this document
     */
    url: string;
}
/**
 * Type of renderer template
 */
export declare enum TemplateType {
    EmbeddedRenderer = "EMBEDDED_RENDERER"
}
