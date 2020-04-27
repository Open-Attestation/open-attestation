declare const _exports: {
    "title": string;
    "$id": string;
    "$schema": string;
    "type": string;
    "definitions": {
        "issuer": {
            "type": string;
            "properties": {
                "id": {
                    "type": string;
                    "format": string;
                    "description": string;
                };
                "name": {
                    "type": string;
                    "description": string;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
    };
    "properties": {
        "@context": {
            "type": string;
            "items": {
                "type": string;
                "format": string;
            };
            "description": string;
        };
        "id": {
            "type": string;
            "format": string;
            "description": string;
        };
        "reference": {
            "type": string;
            "description": string;
        };
        "name": {
            "type": string;
            "description": string;
        };
        "issuanceDate": {
            "type": string;
            "description": string;
        };
        "expirationDate": {
            "type": string;
            "description": string;
        };
        "type": {
            "type": string;
            "items": {
                "type": string;
            };
            "description": string;
        };
        "validFrom": {
            "type": string;
            "format": string;
            "description": string;
        };
        "validUntil": {
            "type": string;
            "format": string;
            "description": string;
        };
        "credentialSubject": {
            "oneOf": {
                "type": string;
            }[];
        };
        "issuer": {
            "oneOf": ({
                "$ref": string;
                "type"?: undefined;
            } | {
                "type": string;
                "$ref"?: undefined;
            })[];
        };
        "template": {
            "type": string;
            "properties": {
                "name": {
                    "type": string;
                    "description": string;
                };
                "type": {
                    "type": string;
                    "description": string;
                    "enum": string[];
                };
                "url": {
                    "type": string;
                    "description": string;
                    "pattern": string;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "proof": {
            "type": string;
            "properties": {
                "type": {
                    "type": string;
                    "description": string;
                    "enum": string[];
                };
                "method": {
                    "type": string;
                    "description": string;
                    "enum": string[];
                };
                "value": {
                    "description": string;
                    "type": string;
                };
                "identity": {
                    "type": string;
                    "properties": {
                        "type": {
                            "type": string;
                            "enum": string[];
                        };
                        "location": {
                            "type": string;
                            "description": string;
                        };
                    };
                    "additionalProperties": boolean;
                    "required": string[];
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "recipient": {
            "type": string;
            "properties": {
                "name": {
                    "type": string;
                    "description": string;
                };
            };
            "additionalProperties": boolean;
        };
        "evidence": {
            "type": string;
            "items": {
                "type": string;
                "properties": {
                    "id": {
                        "type": string;
                        "format": string;
                        "description": string;
                    };
                    "filename": {
                        "type": string;
                        "description": string;
                    };
                    "type": {
                        "type": string;
                        "description": string;
                    };
                    "mimeType": {
                        "type": string;
                        "description": string;
                        "enum": string[];
                    };
                    "data": {
                        "type": string;
                        "description": string;
                    };
                };
                "required": string[];
                "additionalProperties": boolean;
            };
        };
    };
    "required": string[];
    "additionalProperties": boolean;
};
export = _exports;
