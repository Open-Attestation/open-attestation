declare const _exports: {
    "title": string;
    "$id": string;
    "$schema": string;
    "definitions": {
        "identityProof": {
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
            "required": string[];
            "additionalProperties": boolean;
        };
        "issuer": {
            "type": string;
            "properties": {
                "name": {
                    "type": string;
                    "description": string;
                };
                "identityProof": {
                    "$ref": string;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "documentStore": {
            "allOf": ({
                "$ref": string;
                "type"?: undefined;
                "properties"?: undefined;
                "required"?: undefined;
            } | {
                "type": string;
                "properties": {
                    "documentStore": {
                        "type": string;
                        "pattern": string;
                        "description": string;
                    };
                };
                "required": string[];
                "$ref"?: undefined;
            })[];
        };
        "certificateStore": {
            "type": string;
            "properties": {
                "name": {
                    "type": string;
                    "description": string;
                };
                "certificateStore": {
                    "type": string;
                    "pattern": string;
                    "deprecationMessage": string;
                    "description": string;
                };
            };
            "required": string[];
            "additionalProperties": boolean;
        };
        "tokenRegistry": {
            "allOf": ({
                "$ref": string;
                "type"?: undefined;
                "properties"?: undefined;
                "required"?: undefined;
            } | {
                "type": string;
                "properties": {
                    "tokenRegistry": {
                        "type": string;
                        "pattern": string;
                        "description": string;
                    };
                };
                "required": string[];
                "$ref"?: undefined;
            })[];
        };
    };
    "type": string;
    "properties": {
        "id": {
            "type": string;
            "description": string;
        };
        "$template": {
            "oneOf": ({
                "type": string;
                "properties"?: undefined;
                "required"?: undefined;
            } | {
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
                    };
                };
                "required": string[];
            })[];
        };
        "documentUrl": {
            "type": string;
            "description": string;
        };
        "issuers": {
            "type": string;
            "items": {
                "type": string;
                "title": string;
                "oneOf": ({
                    "$ref": string;
                    "allOf"?: undefined;
                } | {
                    "allOf": ({
                        "$ref": string;
                        "not"?: undefined;
                    } | {
                        "not": {
                            "anyOf": {
                                "required": string[];
                            }[];
                        };
                        "$ref"?: undefined;
                    })[];
                    "$ref"?: undefined;
                })[];
            };
            "minItems": number;
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
        "attachments": {
            "type": string;
            "items": {
                "type": string;
                "properties": {
                    "filename": {
                        "type": string;
                        "description": string;
                    };
                    "type": {
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
