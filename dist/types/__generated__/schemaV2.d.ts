export interface OpenAttestationDocument {
    $template?: TemplateObject | string;
    attachments?: Attachment[];
    /**
     * URL of the stored tt document
     */
    documentUrl?: string;
    /**
     * Internal reference, usually serial number, of this document
     */
    id?: string;
    issuers: Issuer[];
    recipient?: Recipient;
}
export interface TemplateObject {
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
    url?: string;
}
/**
 * Type of renderer template
 */
export declare enum TemplateType {
    EmbeddedRenderer = "EMBEDDED_RENDERER"
}
export interface Attachment {
    /**
     * Base64 encoding of attachment
     */
    data: string;
    /**
     * Name of attachment, with appropriate extensions
     */
    filename: string;
    /**
     * Type of attachment
     */
    type: AttachmentType;
}
/**
 * Type of attachment
 */
export declare enum AttachmentType {
    ApplicationPDF = "application/pdf",
    ImageJPEG = "image/jpeg",
    ImagePNG = "image/png"
}
export interface Issuer {
    identityProof?: IdentityProof;
    /**
     * Issuer's name
     */
    name: string;
    /**
     * Smart contract address of token registry
     */
    tokenRegistry?: string;
    /**
     * Smart contract address of document store
     */
    documentStore?: string;
    /**
     * Smart contract address of certificate store. Same as documentStore
     */
    certificateStore?: string;
}
export interface IdentityProof {
    /**
     * Url of the website referencing to document store
     */
    location: string;
    type: IdentityProofType;
}
export declare enum IdentityProofType {
    DNSTxt = "DNS-TXT"
}
export interface Recipient {
    /**
     * Recipient's name
     */
    name?: string;
}
