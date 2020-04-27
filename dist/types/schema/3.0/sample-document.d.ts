export declare const reference: string;
export declare const name: string;
export declare const validFrom: string;
export declare const template: {
    "name": string;
    "type": string;
    "url": string;
};
export declare namespace issuer {
    export const id: string;
    const name_1: string;
    export { name_1 as name };
}
export declare const issuanceDate: string;
export declare namespace credentialSubject {
    const id_1: string;
    export { id_1 as id };
    export const degree: {
        "type": string;
        "name": string;
    };
}
export declare const proof: {
    "type": string;
    "method": string;
    "value": string;
    "identity": {
        "type": string;
        "location": string;
    };
};
export declare namespace recipient {
    const name_2: string;
    export { name_2 as name };
}
export declare const unknownKey: string;
export declare const attachments: {
    "type": string;
    "filename": string;
    "mimeType": string;
    "data": string;
}[];
