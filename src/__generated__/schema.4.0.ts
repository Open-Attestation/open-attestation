export interface OpenAttestationDocument {
    "@context":        any[] | { [key: string]: any } | null | string;
    credentialSchema?: CredentialSchema[] | CredentialSchema;
    credentialStatus?: CredentialStatus;
    credentialSubject: CredentialSubject[] | CredentialSubject;
    evidence?:         Evidence[] | Evidence;
    id?:               string;
    issuer:            IssuerObject | string;
    /**
     * Human readable name of this credential
     */
    name?:         string;
    proof?:        Proof[] | Proof;
    renderMethod?: RenderMethod[];
    termsOfUse?:   TermsOfUse[] | TermsOfUse;
    type:          any[] | null | string;
    /**
     * The date and time when this credential becomes valid
     */
    validFrom?: string;
    /**
     * The date and time when this credential expires
     */
    validUntil?: string;
}

/**
 * A data schema that provide verifiers with enough information to determine whether the
 * provided data conforms to the provided schema(s). More information in
 * https://www.w3.org/TR/vc-data-model-2.0/#data-schemas
 */
export interface CredentialSchema {
    id?:   string;
    type?: any[] | null | string;
}

export interface CredentialStatus {
    /**
     * URI to the status of the credential as explained by
     * https://www.w3.org/TR/vc-data-model/#status
     */
    id?:   string;
    type?: any[] | null | string;
}

/**
 * A verifiable credential contains claims about one or more subjects. More information in
 * https://www.w3.org/TR/vc-data-model-2.0/#credential-subject
 */
export interface CredentialSubject {
    id?:   string;
    type?: any[] | null | string;
    [key: string]: any;
}

export interface Evidence {
    type?: any[] | null | string;
}

export interface IssuerObject {
    /**
     * URI when dereferenced, results in a document containing machine-readable information
     * about the issuer that can be used to verify the information expressed in the credential.
     * More information in https://www.w3.org/TR/vc-data-model/#issuer
     */
    id:             string;
    identityProof?: IdentityProof;
    /**
     * Issuer's name
     */
    name?: string;
    type?: any[] | null | string;
}

export interface IdentityProof {
    /**
     * Identifier to be shown to end user upon verifying the identity
     */
    identifier:        string;
    identityProofType: IdentityProofType;
}

type IdentityProofType = "DNS-DID" | "DNS-TXT" | "DID";

export interface Proof {
    key?:          string;
    merkleRoot?:   string;
    privacy?:      Privacy;
    proofPurpose?: "assertionMethod";
    proofs?:       string[];
    salts?:        string;
    signature?:    string;
    targetHash?:   string;
    type?:         any[] | null | string;
}

export interface Privacy {
    obfuscated?: string[];
}

export interface RenderMethod {
    /**
     * URL of a decentralised renderer to render this document
     */
    id: string;
    /**
     * Template name to be use by template renderer to determine the template to use
     */
    templateName: string;
    type?:        any[] | null | string;
}

export interface TermsOfUse {
    type?: any[] | null | string;
}
