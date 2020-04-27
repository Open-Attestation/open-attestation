declare const _exports: {
    "version": string;
    "@context": string[];
    "reference": string;
    "name": string;
    "validFrom": string;
    "template": {
        "name": string;
        "type": string;
        "url": string;
    };
    "issuer": {
        "id": string;
        "name": string;
        "identityProof": {
            "type": string;
            "location": string;
        };
    };
    "proof": {
        "type": string;
        "targetHash": string;
        "merkleRoot": string;
    };
    "recipient": {
        "name": string;
    };
    "unknownKey": string;
    "evidence": {
        "type": string;
        "filename": string;
        "mimeType": string;
        "data": string;
    }[];
    "privacy": {
        "obfuscatedData": never[];
    };
};
export = _exports;
