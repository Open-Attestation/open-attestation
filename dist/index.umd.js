(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash'), require('js-sha3'), require('flatley'), require('ajv'), require('debug'), require('validator'), require('uuid'), require('verbal-expressions'), require('jsonld'), require('ethers')) :
	typeof define === 'function' && define.amd ? define(['exports', 'lodash', 'js-sha3', 'flatley', 'ajv', 'debug', 'validator', 'uuid', 'verbal-expressions', 'jsonld', 'ethers'], factory) :
	(global = global || self, factory(global.openAttestation = {}, global.lodash, global.jsSha3, global.flatley, global.ajv, global.debug, global.validator, global.uuid, global.verbalExpressions, global.jsonld, global.ethers));
}(this, (function (exports, lodash, jsSha3, flatley, ajv, debug, validator, uuid, verbalExpressions, jsonld, ethers) { 'use strict';

	lodash = lodash && lodash.hasOwnProperty('default') ? lodash['default'] : lodash;
	jsSha3 = jsSha3 && jsSha3.hasOwnProperty('default') ? jsSha3['default'] : jsSha3;
	flatley = flatley && flatley.hasOwnProperty('default') ? flatley['default'] : flatley;
	ajv = ajv && ajv.hasOwnProperty('default') ? ajv['default'] : ajv;
	debug = debug && debug.hasOwnProperty('default') ? debug['default'] : debug;
	validator = validator && validator.hasOwnProperty('default') ? validator['default'] : validator;
	uuid = uuid && uuid.hasOwnProperty('default') ? uuid['default'] : uuid;
	verbalExpressions = verbalExpressions && verbalExpressions.hasOwnProperty('default') ? verbalExpressions['default'] : verbalExpressions;
	jsonld = jsonld && jsonld.hasOwnProperty('default') ? jsonld['default'] : jsonld;
	ethers = ethers && ethers.hasOwnProperty('default') ? ethers['default'] : ethers;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var flatten = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	var hasPeriodInKey = function (key) {
	    if (key.indexOf(".") >= 0) {
	        throw new Error("Key names must not have . in them");
	    }
	    return false;
	};
	var filters = [{ test: hasPeriodInKey }];
	/**
	 * Calls external flatten library but ensures that global filters are always applied
	 * @param data
	 * @param options
	 */
	exports.flatten = function (data, options) {
	    var _a;
	    var newOptions = options ? lodash.cloneDeep(options) : {};
	    if (newOptions.coercion) {
	        (_a = newOptions.coercion).push.apply(_a, filters);
	    }
	    else {
	        newOptions.coercion = filters;
	    }
	    return flatley.flatten(data, newOptions);
	};
	});

	unwrapExports(flatten);
	var flatten_1 = flatten.flatten;

	var digest = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });



	var isKeyOrValueUndefined = function (value, key) { return value === undefined || key === undefined; };
	exports.flattenHashArray = function (data) {
	    var flattenedData = lodash.omitBy(flatten.flatten(data), isKeyOrValueUndefined);
	    return Object.keys(flattenedData).map(function (k) {
	        var obj = {};
	        obj[k] = flattenedData[k];
	        return jsSha3.keccak256(JSON.stringify(obj));
	    });
	};
	exports.digestDocument = function (document) {
	    // Prepare array of hashes from filtered data
	    var hashedDataArray = lodash.get(document, "privacy.obfuscatedData", []);
	    // Prepare array of hashes from visible data
	    var unhashedData = lodash.get(document, "data");
	    var hashedUnhashedDataArray = exports.flattenHashArray(unhashedData);
	    // Combine both array and sort them to ensure determinism
	    var combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
	    var sortedHashes = lodash.sortBy(combinedHashes);
	    // Finally, return the digest of the entire set of data
	    return jsSha3.keccak256(JSON.stringify(sortedHashes));
	};
	});

	unwrapExports(digest);
	var digest_1 = digest.flattenHashArray;
	var digest_2 = digest.digestDocument;

	var digest$1 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(digest);
	});

	unwrapExports(digest$1);

	var logger_1 = createCommonjsModule(function (module, exports) {
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var debug_1 = __importDefault(debug);
	var logger = debug_1.default("open-attestation");
	exports.getLogger = function (namespace) { return ({
	    trace: logger.extend("trace:" + namespace),
	    debug: logger.extend("debug:" + namespace),
	    info: logger.extend("info:" + namespace),
	    warn: logger.extend("warn:" + namespace),
	    error: logger.extend("error:" + namespace)
	}); };
	});

	unwrapExports(logger_1);
	var logger_2 = logger_1.getLogger;

	var title = "Open Attestation Schema v2";
	var $id = "https://schema.openattestation.com/2.0/schema.json";
	var $schema = "http://json-schema.org/draft-07/schema#";
	var definitions = {
		identityProof: {
			type: "object",
			properties: {
				type: {
					type: "string",
					"enum": [
						"DNS-TXT"
					]
				},
				location: {
					type: "string",
					description: "Url of the website referencing to document store"
				}
			},
			required: [
				"type",
				"location"
			],
			additionalProperties: false
		},
		issuer: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "Issuer's name"
				},
				identityProof: {
					$ref: "#/definitions/identityProof"
				}
			},
			required: [
				"name",
				"identityProof"
			],
			additionalProperties: true
		},
		documentStore: {
			allOf: [
				{
					$ref: "#/definitions/issuer"
				},
				{
					type: "object",
					properties: {
						documentStore: {
							type: "string",
							pattern: "^0x[a-fA-F0-9]{40}$",
							description: "Smart contract address of document store"
						}
					},
					required: [
						"documentStore"
					]
				}
			]
		},
		certificateStore: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "Issuer's name"
				},
				certificateStore: {
					type: "string",
					pattern: "^0x[a-fA-F0-9]{40}$",
					deprecationMessage: "Use documentStore and identityProof instead of this",
					description: "Smart contract address of certificate store. Same as documentStore"
				}
			},
			required: [
				"name",
				"certificateStore"
			],
			additionalProperties: true
		},
		tokenRegistry: {
			allOf: [
				{
					$ref: "#/definitions/issuer"
				},
				{
					type: "object",
					properties: {
						tokenRegistry: {
							type: "string",
							pattern: "^0x[a-fA-F0-9]{40}$",
							description: "Smart contract address of token registry"
						}
					},
					required: [
						"tokenRegistry"
					]
				}
			]
		}
	};
	var type = "object";
	var properties = {
		id: {
			type: "string",
			description: "Internal reference, usually serial number, of this document"
		},
		$template: {
			oneOf: [
				{
					type: "string"
				},
				{
					type: "object",
					properties: {
						name: {
							type: "string",
							description: "Template name to be use by template renderer to determine the template to use"
						},
						type: {
							type: "string",
							description: "Type of renderer template",
							"enum": [
								"EMBEDDED_RENDERER"
							]
						},
						url: {
							type: "string",
							description: "URL of a decentralised renderer to render this document"
						}
					},
					required: [
						"name",
						"type"
					]
				}
			]
		},
		documentUrl: {
			type: "string",
			description: "URL of the stored tt document"
		},
		issuers: {
			type: "array",
			items: {
				type: "object",
				title: "issuer",
				oneOf: [
					{
						$ref: "#/definitions/tokenRegistry"
					},
					{
						$ref: "#/definitions/documentStore"
					},
					{
						$ref: "#/definitions/certificateStore"
					},
					{
						allOf: [
							{
								$ref: "#/definitions/issuer"
							},
							{
								not: {
									anyOf: [
										{
											required: [
												"certificateStore"
											]
										},
										{
											required: [
												"tokenRegistry"
											]
										},
										{
											required: [
												"documentStore"
											]
										}
									]
								}
							}
						]
					}
				]
			},
			minItems: 1
		},
		recipient: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "Recipient's name"
				}
			},
			additionalProperties: true
		},
		attachments: {
			type: "array",
			items: {
				type: "object",
				properties: {
					filename: {
						type: "string",
						description: "Name of attachment, with appropriate extensions"
					},
					type: {
						type: "string",
						description: "Type of attachment",
						"enum": [
							"application/pdf",
							"image/png",
							"image/jpeg"
						]
					},
					data: {
						type: "string",
						description: "Base64 encoding of attachment"
					}
				},
				required: [
					"filename",
					"type",
					"data"
				],
				additionalProperties: false
			}
		}
	};
	var required = [
		"issuers"
	];
	var additionalProperties = true;
	var schema = {
		title: title,
		$id: $id,
		$schema: $schema,
		definitions: definitions,
		type: type,
		properties: properties,
		required: required,
		additionalProperties: additionalProperties
	};

	var schema$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		title: title,
		$id: $id,
		$schema: $schema,
		definitions: definitions,
		type: type,
		properties: properties,
		required: required,
		additionalProperties: additionalProperties,
		'default': schema
	});

	var title$1 = "Open Attestation Schema v3";
	var $id$1 = "https://schema.openattestation.com/3.0/schema.json";
	var $schema$1 = "http://json-schema.org/draft-07/schema#";
	var type$1 = "object";
	var definitions$1 = {
		issuer: {
			type: "object",
			properties: {
				id: {
					type: "string",
					format: "uri",
					description: "URI when dereferenced, results in a document containing machine-readable information about the issuer that can be used to verify the information expressed in the credential. More information in https://www.w3.org/TR/vc-data-model/#issuer"
				},
				name: {
					type: "string",
					description: "Issuer's name"
				}
			},
			required: [
				"id",
				"name"
			],
			additionalProperties: false
		}
	};
	var properties$1 = {
		"@context": {
			type: "array",
			items: {
				type: "string",
				format: "uri"
			},
			description: "List of URI to determine the terminology used in the verifiable credential as explained by https://www.w3.org/TR/vc-data-model/#contexts"
		},
		id: {
			type: "string",
			format: "uri",
			description: "URI to the subject of the credential as explained by https://www.w3.org/TR/vc-data-model/#credential-subject"
		},
		reference: {
			type: "string",
			description: "Internal reference, usually serial number, of this document"
		},
		name: {
			type: "string",
			description: "Human readable name of the credential"
		},
		issuanceDate: {
			type: "string",
			description: "The date and time when a credential becomes valid"
		},
		expirationDate: {
			type: "string",
			description: "The date and time when a credential becomes valid"
		},
		type: {
			type: "array",
			items: {
				type: "string"
			},
			description: "Specific verifiable credential type as explained by https://www.w3.org/TR/vc-data-model/#types"
		},
		validFrom: {
			type: "string",
			format: "date-time",
			description: "Date and time when a credential becomes valid."
		},
		validUntil: {
			type: "string",
			format: "date-time",
			description: "Date and time when a credential becomes valid."
		},
		credentialSubject: {
			oneOf: [
				{
					type: "object"
				},
				{
					type: "array"
				}
			]
		},
		issuer: {
			oneOf: [
				{
					$ref: "#/definitions/issuer"
				},
				{
					type: "string"
				}
			]
		},
		template: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "Template name to be use by template renderer to determine the template to use"
				},
				type: {
					type: "string",
					description: "Type of renderer template",
					"enum": [
						"EMBEDDED_RENDERER"
					]
				},
				url: {
					type: "string",
					description: "URL of a decentralised renderer to render this document",
					pattern: "^(https?)://"
				}
			},
			required: [
				"name",
				"type",
				"url"
			],
			additionalProperties: false
		},
		proof: {
			type: "object",
			properties: {
				type: {
					type: "string",
					description: "Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types",
					"enum": [
						"OpenAttestationSignature2018"
					]
				},
				method: {
					type: "string",
					description: "Proof open attestation method",
					"enum": [
						"TOKEN_REGISTRY",
						"DOCUMENT_STORE"
					]
				},
				value: {
					description: "Proof value for issuer(s)",
					type: "string"
				},
				identity: {
					type: "object",
					properties: {
						type: {
							type: "string",
							"enum": [
								"DNS-TXT",
								"W3C-DID"
							]
						},
						location: {
							type: "string",
							description: "Url of the website referencing to document store OR valid DID as defined by W3C: https://www.w3.org/TR/did-core/"
						}
					},
					additionalProperties: false,
					required: [
						"type",
						"location"
					]
				}
			},
			required: [
				"type",
				"method",
				"value",
				"identity"
			],
			additionalProperties: true
		},
		recipient: {
			type: "object",
			properties: {
				name: {
					type: "string",
					description: "Recipient's name"
				}
			},
			additionalProperties: true
		},
		evidence: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: {
						type: "string",
						format: "uri",
						description: "The id property is optional, but if present, SHOULD contain a URL that points to where more information about this instance of evidence can be found."
					},
					filename: {
						type: "string",
						description: "Name of attachment, with appropriate extensions"
					},
					type: {
						type: "string",
						description: "A valid evidence type as explained by https://www.w3.org/TR/vc-data-model/#types"
					},
					mimeType: {
						type: "string",
						description: "Mime-type of attachment",
						"enum": [
							"application/pdf",
							"image/png",
							"image/jpeg"
						]
					},
					data: {
						type: "string",
						description: "Base64 encoding of attachment"
					}
				},
				required: [
					"filename",
					"mimeType",
					"data",
					"type"
				],
				additionalProperties: false
			}
		}
	};
	var required$1 = [
		"issuer",
		"template",
		"proof",
		"credentialSubject",
		"issuanceDate"
	];
	var additionalProperties$1 = true;
	var schema$2 = {
		title: title$1,
		$id: $id$1,
		$schema: $schema$1,
		type: type$1,
		definitions: definitions$1,
		properties: properties$1,
		required: required$1,
		additionalProperties: additionalProperties$1
	};

	var schema$3 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		title: title$1,
		$id: $id$1,
		$schema: $schema$1,
		type: type$1,
		definitions: definitions$1,
		properties: properties$1,
		required: required$1,
		additionalProperties: additionalProperties$1,
		'default': schema$2
	});

	var document = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	var SchemaId;
	(function (SchemaId) {
	    SchemaId["v2"] = "https://schema.openattestation.com/2.0/schema.json";
	    SchemaId["v3"] = "https://schema.openattestation.com/3.0/schema.json";
	})(SchemaId = exports.SchemaId || (exports.SchemaId = {}));
	var ProofType;
	(function (ProofType) {
	    ProofType["EcdsaSecp256k1Signature2019"] = "EcdsaSecp256k1Signature2019";
	})(ProofType = exports.ProofType || (exports.ProofType = {}));
	var ProofPurpose;
	(function (ProofPurpose) {
	    ProofPurpose["AssertionMethod"] = "assertionMethod";
	})(ProofPurpose = exports.ProofPurpose || (exports.ProofPurpose = {}));
	});

	unwrapExports(document);
	var document_1 = document.SchemaId;
	var document_2 = document.ProofType;
	var document_3 = document.ProofPurpose;

	var salt = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });



	var UUIDV4_LENGTH = 37;
	var PRIMITIVE_TYPES = ["string", "number", "boolean", "undefined"];
	/* eslint-disable no-use-before-define */
	/**
	 * Curried function that takes (iteratee)(value),
	 * if value is a collection then recurse into it
	 * otherwise apply `iteratee` on the primitive value
	 */
	var recursivelyApply = function (iteratee) { return function (value) {
	    if (lodash.includes(PRIMITIVE_TYPES, typeof value) || value === null) {
	        return iteratee(value);
	    }
	    return exports.deepMap(value, iteratee); // eslint-disable-line @typescript-eslint/no-use-before-define
	}; };
	/**
	 * Applies `iteratee` to all fields in objects, goes into arrays as well.
	 * Refer to test for example
	 */
	exports.deepMap = function (collection, iteratee) {
	    if (iteratee === void 0) { iteratee = lodash.identity; }
	    if (collection instanceof Array) {
	        return lodash.map(collection, recursivelyApply(iteratee));
	    }
	    if (typeof collection === "object") {
	        return lodash.mapValues(collection, recursivelyApply(iteratee));
	    }
	    return collection;
	};
	/* eslint-enable no-use-before-define */
	// disabling this because of mutual recursion
	var startsWithUuidV4 = function (input) {
	    if (input && typeof input === "string") {
	        var elements = input.split(":");
	        return validator.isUUID(elements[0], 4);
	    }
	    return false;
	};
	/**
	 * Detects the type of a value and returns a string with type annotation
	 */
	function primitiveToTypedString(value) {
	    switch (typeof value) {
	        case "number":
	        case "string":
	        case "boolean":
	        case "undefined":
	            return typeof value + ":" + String(value);
	        default:
	            if (value === null) {
	                // typeof null is 'object' so we have to check for it
	                return "null:null";
	            }
	            throw new Error("Parsing error, value is not of primitive type: " + value);
	    }
	}
	exports.primitiveToTypedString = primitiveToTypedString;
	/**
	 * Returns an appropriately typed value given a string with type annotations, e.g: "number:5"
	 */
	function typedStringToPrimitive(input) {
	    var _a = input.split(":"), type = _a[0], valueArray = _a.slice(1);
	    var value = valueArray.join(":"); // just in case there are colons in the value
	    switch (type) {
	        case "number":
	            return Number(value);
	        case "string":
	            return String(value);
	        case "boolean":
	            return value === "true";
	        case "null":
	            return null;
	        case "undefined":
	            return undefined;
	        default:
	            throw new Error("Parsing error, type annotation not found in string: " + input);
	    }
	}
	exports.typedStringToPrimitive = typedStringToPrimitive;
	/**
	 * Returns a salted value using a randomly generated uuidv4 string for salt
	 */
	function uuidSalt(value) {
	    var salt = uuid.v4();
	    return salt + ":" + primitiveToTypedString(value);
	}
	exports.uuidSalt = uuidSalt;
	/**
	 * Value salted string in the format "salt:type:value", example: "ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5"
	 * Returns an appropriately typed value when given a salted string with type annotation
	 */
	function unsalt(value) {
	    if (startsWithUuidV4(value)) {
	        var untypedValue = value.substring(UUIDV4_LENGTH).trim();
	        return typedStringToPrimitive(untypedValue);
	    }
	    return value;
	}
	exports.unsalt = unsalt;
	// Use uuid salting method to recursively salt data
	exports.saltData = function (data) { return exports.deepMap(data, uuidSalt); };
	exports.unsaltData = function (data) { return exports.deepMap(data, unsalt); };
	});

	unwrapExports(salt);
	var salt_1 = salt.deepMap;
	var salt_2 = salt.primitiveToTypedString;
	var salt_3 = salt.typedStringToPrimitive;
	var salt_4 = salt.uuidSalt;
	var salt_5 = salt.unsalt;
	var salt_6 = salt.saltData;
	var salt_7 = salt.unsaltData;

	var salt$1 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(salt);
	});

	unwrapExports(salt$1);

	var utils = createCommonjsModule(function (module, exports) {
	var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
	    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	    for (var r = Array(s), k = 0, i = 0; i < il; i++)
	        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
	            r[k] = a[j];
	    return r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	exports.getData = function (document) {
	    return salt$1.unsaltData(document.data);
	};
	/**
	 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
	 */
	function bufSortJoin() {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	    }
	    return Buffer.concat(__spreadArrays(args).sort(Buffer.compare));
	}
	exports.bufSortJoin = bufSortJoin;
	// If hash is not a buffer, convert it to buffer (without hashing it)
	function hashToBuffer(hash) {
	    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/23155
	    return Buffer.isBuffer(hash) && hash.length === 32 ? hash : Buffer.from(hash, "hex");
	}
	exports.hashToBuffer = hashToBuffer;
	// If element is not a buffer, stringify it and then hash it to be a buffer
	function toBuffer(element) {
	    return Buffer.isBuffer(element) && element.length === 32 ? element : hashToBuffer(jsSha3.keccak256(JSON.stringify(element)));
	}
	exports.toBuffer = toBuffer;
	/**
	 * Turns array of data into sorted array of hashes
	 */
	function hashArray(arr) {
	    return arr.map(function (i) { return toBuffer(i); }).sort(Buffer.compare);
	}
	exports.hashArray = hashArray;
	/**
	 * Returns the keccak hash of two buffers after concatenating them and sorting them
	 * If either hash is not given, the input is returned
	 */
	function combineHashBuffers(first, second) {
	    if (!second) {
	        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	        return first; // it should always be valued if second is not
	    }
	    if (!first) {
	        return second;
	    }
	    return hashToBuffer(jsSha3.keccak256(bufSortJoin(first, second)));
	}
	exports.combineHashBuffers = combineHashBuffers;
	/**
	 * Returns the keccak hash of two string after concatenating them and sorting them
	 * If either hash is not given, the input is returned
	 * @param first A string to be hashed (without 0x)
	 * @param second A string to be hashed (without 0x)
	 * @returns Resulting string after the hash is combined (without 0x)
	 */
	function combineHashString(first, second) {
	    return first && second
	        ? combineHashBuffers(hashToBuffer(first), hashToBuffer(second)).toString("hex")
	        : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            (first || second); // this should always return a value right ? :)
	}
	exports.combineHashString = combineHashString;
	exports.isWrappedV3Document = function (document$1) {
	    return document$1 && document$1.version === document.SchemaId.v3;
	};
	exports.isWrappedV2Document = function (document) {
	    return !exports.isWrappedV3Document(document);
	};
	function getIssuerAddress(document) {
	    if (exports.isWrappedV2Document(document)) {
	        var data = exports.getData(document);
	        return data.issuers.map(function (issuer) { return issuer.certificateStore || issuer.documentStore || issuer.tokenRegistry; });
	    }
	    else if (exports.isWrappedV3Document(document)) {
	        return document.proof.value;
	    }
	    throw new Error("");
	}
	exports.getIssuerAddress = getIssuerAddress;
	// make it available for consumers
	var js_sha3_2 = jsSha3;
	exports.keccak256 = js_sha3_2.keccak256;
	});

	unwrapExports(utils);
	var utils_1 = utils.getData;
	var utils_2 = utils.bufSortJoin;
	var utils_3 = utils.hashToBuffer;
	var utils_4 = utils.toBuffer;
	var utils_5 = utils.hashArray;
	var utils_6 = utils.combineHashBuffers;
	var utils_7 = utils.combineHashString;
	var utils_8 = utils.isWrappedV3Document;
	var utils_9 = utils.isWrappedV2Document;
	var utils_10 = utils.getIssuerAddress;
	var utils_11 = utils.keccak256;

	var regex = createCommonjsModule(function (module, exports) {
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var verbal_expressions_1 = __importDefault(verbalExpressions);
	var hexDigits = verbal_expressions_1.default().range("0", "9", "a", "f", "A", "F");
	var hexString = verbal_expressions_1.default()
	    .then("0x")
	    .then(hexDigits)
	    .oneOrMore();
	exports.isHexString = function (input) {
	    var testRegex = verbal_expressions_1.default()
	        .startOfLine()
	        .then(hexString)
	        .endOfLine();
	    return testRegex.test(input);
	};
	});

	unwrapExports(regex);
	var regex_1 = regex.isHexString;

	var utils$1 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(utils);
	__export(regex);
	});

	unwrapExports(utils$1);

	var require$$1 = getCjsExportFromNamespace(schema$1);

	var require$$2 = getCjsExportFromNamespace(schema$3);

	var schema$4 = createCommonjsModule(function (module, exports) {
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var ajv_1 = __importDefault(ajv);

	var schema_json_1 = __importDefault(require$$1);
	var schema_json_2 = __importDefault(require$$2);


	var logger = logger_1.getLogger("validate");
	exports.validateSchema = function (document$1, validator) {
	    var _a;
	    if (!validator) {
	        throw new Error("No schema validator provided");
	    }
	    var valid = validator(document$1.version === document.SchemaId.v3 ? document$1 : utils$1.getData(document$1));
	    if (!valid) {
	        logger.debug("There are errors in the document");
	        logger.debug(validator.errors);
	        return _a = validator.errors, (_a !== null && _a !== void 0 ? _a : []);
	    }
	    logger.debug("Document is a valid open attestation document v" + document$1.version);
	    return [];
	};
	var ajv$1 = new ajv_1.default({ allErrors: true });
	ajv$1.compile(schema_json_1.default);
	ajv$1.compile(schema_json_2.default);
	exports.getSchema = function (key) { return ajv$1.getSchema(key); };
	});

	unwrapExports(schema$4);
	var schema_1 = schema$4.validateSchema;
	var schema_2 = schema$4.getSchema;

	var schema$5 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(schema$4);
	});

	unwrapExports(schema$5);

	var merkle = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	function getNextLayer(elements) {
	    return elements.reduce(function (layer, element, index, arr) {
	        if (index % 2 === 0) {
	            // only calculate hash for even indexes
	            layer.push(utils$1.combineHashBuffers(element, arr[index + 1]));
	        }
	        return layer;
	    }, []);
	}
	/**
	 * This function produces the hashes and the merkle tree
	 * If there are no elements, return empty array of array
	 */
	function getLayers(elements) {
	    if (elements.length === 0) {
	        return [[]];
	    }
	    var layers = [];
	    layers.push(elements);
	    while (layers[layers.length - 1].length > 1) {
	        layers.push(getNextLayer(layers[layers.length - 1]));
	    }
	    return layers;
	}
	/**
	 * This function takes a given index and determines if it is the first or second element in a pair, then returns the first element of the pair
	 * If the given index is the last element in a layer with an odd number of elements, then null is returned
	 * E.g 1:
	 *
	 * layer = [ A, B, C, D ],
	 * if index = 2, then return A
	 * if index = 3, then return C
	 *
	 * E.g 2:
	 *
	 * layer = [ A, B, C, D, E]
	 * if index = 5, then return null
	 * if index = 4, then return C
	 */
	function getPair(index, layer) {
	    var pairIndex = index % 2 ? index - 1 : index + 1; // if odd return the index before it, else if even return the index after it
	    if (pairIndex < layer.length) {
	        return layer[pairIndex];
	    }
	    return null; // this happens when the given index is the last element in a layer with odd number of elements
	}
	/**
	 * Finds all the "uncle" nodes required to prove a given element in the merkle tree
	 */
	function getProof(index, layers) {
	    var i = index;
	    var proof = layers.reduce(function (current, layer) {
	        var pair = getPair(i, layer);
	        if (pair) {
	            current.push(pair);
	        }
	        i = Math.floor(i / 2); // finds the index of the parent of the current node
	        return current;
	    }, []);
	    return proof;
	}
	var MerkleTree = /** @class */ (function () {
	    function MerkleTree(_elements) {
	        this.elements = utils$1.hashArray(_elements);
	        // check buffers
	        if (this.elements.some(function (e) { return !(e.length === 32 && Buffer.isBuffer(e)); })) {
	            throw new Error("elements must be 32 byte buffers");
	        }
	        this.layers = getLayers(this.elements);
	    }
	    MerkleTree.prototype.getRoot = function () {
	        return this.layers[this.layers.length - 1][0];
	    };
	    MerkleTree.prototype.getProof = function (_element) {
	        var element = utils$1.toBuffer(_element);
	        var index = this.elements.findIndex(function (e) { return e.equals(element); }); // searches for given element in the merkle tree and returns the index
	        if (index === -1) {
	            throw new Error("Element not found");
	        }
	        return getProof(index, this.layers);
	    };
	    return MerkleTree;
	}());
	exports.MerkleTree = MerkleTree;
	/**
	 * Function that runs through the supplied hashes to arrive at the supplied merkle root hash
	 * @param _proof The list of uncle hashes required to arrive at the supplied merkle root
	 * @param _root The merkle root
	 * @param _element The leaf node that is being verified
	 */
	exports.checkProof = function (_proof, _root, _element) {
	    var proof = _proof.map(function (step) { return utils$1.hashToBuffer(step); });
	    var root = utils$1.hashToBuffer(_root);
	    var element = utils$1.hashToBuffer(_element);
	    var proofRoot = proof.reduce(function (hash, pair) { return utils$1.combineHashBuffers(hash, pair); }, element);
	    return root.equals(proofRoot);
	};
	});

	unwrapExports(merkle);
	var merkle_1 = merkle.MerkleTree;
	var merkle_2 = merkle.checkProof;

	var merkle$1 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(merkle);
	});

	unwrapExports(merkle$1);

	var signature = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	Object.defineProperty(exports, "__esModule", { value: true });





	exports.wrap = function (document, batch) {
	    var digest = digest$1.digestDocument(document);
	    if (batch && !batch.includes(digest)) {
	        throw new Error("Document is not in batch");
	    }
	    var batchBuffers = (batch || [digest]).map(utils$1.hashToBuffer);
	    var merkleTree = new merkle$1.MerkleTree(batchBuffers);
	    var merkleRoot = merkleTree.getRoot().toString("hex");
	    var merkleProof = merkleTree.getProof(utils$1.hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
	    var signature = {
	        type: "SHA3MerkleProof",
	        targetHash: digest,
	        proof: merkleProof,
	        merkleRoot: merkleRoot
	    };
	    return __assign(__assign({}, document), { signature: signature });
	};
	exports.verify = function (document) {
	    var signature = lodash.get(document, "signature");
	    if (!signature) {
	        return false;
	    }
	    // Checks target hash
	    var digest = digest$1.digestDocument(document);
	    var targetHash = lodash.get(document, "signature.targetHash");
	    if (digest !== targetHash)
	        return false;
	    // Calculates merkle root from target hash and proof, then compare to merkle root in document
	    var merkleRoot = lodash.get(document, "signature.merkleRoot");
	    var proof = lodash.get(document, "signature.proof", []);
	    var calculatedMerkleRoot = proof.reduce(function (prev, current) {
	        var prevAsBuffer = utils$1.hashToBuffer(prev);
	        var currAsBuffer = utils$1.hashToBuffer(current);
	        var combineAsBuffer = utils$1.bufSortJoin(prevAsBuffer, currAsBuffer);
	        return jsSha3.keccak256(combineAsBuffer);
	    }, digest);
	    return calculatedMerkleRoot === merkleRoot;
	};
	});

	unwrapExports(signature);
	var signature_1 = signature.wrap;
	var signature_2 = signature.verify;

	var signature$1 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(signature);
	__export(merkle$1);
	});

	unwrapExports(signature$1);

	var schemaV2 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * Type of renderer template
	 */
	var TemplateType;
	(function (TemplateType) {
	    TemplateType["EmbeddedRenderer"] = "EMBEDDED_RENDERER";
	})(TemplateType = exports.TemplateType || (exports.TemplateType = {}));
	/**
	 * Type of attachment
	 */
	var AttachmentType;
	(function (AttachmentType) {
	    AttachmentType["ApplicationPDF"] = "application/pdf";
	    AttachmentType["ImageJPEG"] = "image/jpeg";
	    AttachmentType["ImagePNG"] = "image/png";
	})(AttachmentType = exports.AttachmentType || (exports.AttachmentType = {}));
	var IdentityProofType;
	(function (IdentityProofType) {
	    IdentityProofType["DNSTxt"] = "DNS-TXT";
	})(IdentityProofType = exports.IdentityProofType || (exports.IdentityProofType = {}));
	});

	unwrapExports(schemaV2);
	var schemaV2_1 = schemaV2.TemplateType;
	var schemaV2_2 = schemaV2.AttachmentType;
	var schemaV2_3 = schemaV2.IdentityProofType;

	var schemaV3 = createCommonjsModule(function (module, exports) {
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
	});

	unwrapExports(schemaV3);
	var schemaV3_1 = schemaV3.MIMEType;
	var schemaV3_2 = schemaV3.IdentityType;
	var schemaV3_3 = schemaV3.Method;
	var schemaV3_4 = schemaV3.ProofType;
	var schemaV3_5 = schemaV3.TemplateType;

	var signature_v3 = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });






	var deepMap = function (value, path) {
	    if (Array.isArray(value)) {
	        return value.flatMap(function (v, index) { return deepMap(v, path + "[" + index + "]"); });
	    }
	    if (typeof value === "object") {
	        return Object.keys(value).flatMap(function (key) { return deepMap(value[key], path ? path + "." + key : key); });
	    }
	    if (typeof value === "string") {
	        return [{ value: uuid.v4(), path: path }];
	    }
	    throw new Error("unexpected element  " + value + " => " + path);
	};
	var salt = function (data) { return deepMap(data, ""); };
	var digestDocument = function (document, salts, obfuscatedData) {
	    // Prepare array of hashes from filtered data
	    // const hashedDataArray = document.proof.signature.privacy.obfuscatedData;
	    // console.log(JSON.stringify(salts, null, 2));
	    // Prepare array of hashes from visible data
	    var hashedUnhashedDataArray = salts
	        .filter(function (salt) { return lodash.get(document, salt.path); })
	        .map(function (salt) {
	        // console.log(`[${salt.path}] = ${get(document, salt.path)}`);
	        return jsSha3.keccak256(JSON.stringify(salt.value + ":" + lodash.get(document, salt.path)));
	    });
	    // Combine both array and sort them to ensure determinism
	    var combinedHashes = obfuscatedData.concat(hashedUnhashedDataArray);
	    var sortedHashes = lodash.sortBy(combinedHashes);
	    // Finally, return the digest of the entire set of data
	    return jsSha3.keccak256(JSON.stringify(sortedHashes));
	};
	var getId = function (objectOrString) {
	    if (typeof objectOrString === "string") {
	        return objectOrString;
	    }
	    return objectOrString.id;
	};
	/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */
	var dateFullYear = /[0-9]{4}/;
	var dateMonth = /(0[1-9]|1[0-2])/;
	var dateMDay = /([12]\d|0[1-9]|3[01])/;
	var timeHour = /([01][0-9]|2[0-3])/;
	var timeMinute = /[0-5][0-9]/;
	var timeSecond = /([0-5][0-9]|60)/;
	var timeSecFrac = /(\.[0-9]+)?/;
	var timeNumOffset = new RegExp("[-+]".concat(timeHour.source, ":").concat(timeMinute.source));
	var timeOffset = new RegExp("([zZ]|".concat(timeNumOffset.source, ")"));
	var partialTime = new RegExp(""
	    .concat(timeHour.source, ":")
	    .concat(timeMinute.source, ":")
	    .concat(timeSecond.source)
	    .concat(timeSecFrac.source));
	var fullDate = new RegExp(""
	    .concat(dateFullYear.source, "-")
	    .concat(dateMonth.source, "-")
	    .concat(dateMDay.source));
	var fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
	var rfc3339 = new RegExp("".concat(fullDate.source, "[ tT]").concat(fullTime.source));
	var isValidRFC3339 = function (str) {
	    return rfc3339.test(str);
	};
	function validateV3(credential) {
	    return __awaiter(this, void 0, void 0, function () {
	        var issuerId;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    // ensure first context is 'https://www.w3.org/2018/credentials/v1'
	                    if (Array.isArray(credential["@context"]) && credential["@context"][0] !== "https://www.w3.org/2018/credentials/v1") {
	                        throw new Error("https://www.w3.org/2018/credentials/v1 needs to be first in the " + "list of contexts.");
	                    }
	                    issuerId = getId(credential.issuer);
	                    if (!issuerId.includes(":")) {
	                        throw new Error("Property `issuer` id must be a a valid RFC 3986 URI");
	                    }
	                    // ensure issuanceDate is a valid RFC3339 date
	                    if (!isValidRFC3339(credential.issuanceDate)) {
	                        throw new Error("Property `issuanceDate` must be a a valid RFC 3339 date");
	                    }
	                    // ensure expirationDate is a valid RFC3339 date
	                    if (credential.expirationDate && !isValidRFC3339(credential.expirationDate)) {
	                        throw new Error("Property `expirationDate` must be a a valid RFC 3339 date");
	                    }
	                    return [4 /*yield*/, jsonld.compact(credential, "https://w3id.org/security/v2", {
	                            expansionMap: function (info) {
	                                if (info.unmappedProperty) {
	                                    console.log(info.unmappedProperty);
	                                    throw new Error('The property "' + info.unmappedProperty + '" in the input ' + "was not defined in the context.");
	                                }
	                            }
	                        })];
	                case 1:
	                    _a.sent();
	                    return [2 /*return*/];
	            }
	        });
	    });
	}
	exports.validateV3 = validateV3;
	exports.wrapV3 = function (document) {
	    document["@context"].push("https://gist.githubusercontent.com/Nebulis/18efab9f8801c886a7dd0f6230efd89d/raw/f9f3107cabd7768f84a36c65d756abd961d19bda/w3c.json.ld");
	    var salts = salt(document);
	    var digest = digestDocument(document, salts, []);
	    var batchBuffers = [digest].map(utils$1.hashToBuffer);
	    var merkleTree = new merkle$1.MerkleTree(batchBuffers);
	    var merkleRoot = merkleTree.getRoot().toString("hex");
	    var merkleProof = merkleTree.getProof(utils$1.hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
	    return __assign(__assign({}, document), { proof: __assign(__assign({}, document.proof), { signature: {
	                type: "SHA3MerkleProof",
	                targetHash: digest,
	                proof: merkleProof,
	                merkleRoot: merkleRoot,
	                salts: salts,
	                privacy: {
	                    obfuscatedData: []
	                }
	            } }) });
	};
	exports.wrapsV3 = function (documents) {
	    var salts = documents.map(function (document) {
	        return salt(document);
	    });
	    var digests = documents.map(function (document, index) {
	        return digestDocument(document, salts[index], []);
	    });
	    var batchBuffers = digests.map(utils$1.hashToBuffer);
	    var merkleTree = new merkle$1.MerkleTree(batchBuffers);
	    var merkleRoot = merkleTree.getRoot().toString("hex");
	    return documents.map(function (document, index) {
	        var digest = digests[index];
	        var merkleProof = merkleTree.getProof(utils$1.hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
	        return __assign(__assign({}, document), { proof: __assign(__assign({}, document.proof), { signature: {
	                    type: "SHA3MerkleProof",
	                    targetHash: digest,
	                    proof: merkleProof,
	                    merkleRoot: merkleRoot,
	                    salts: salts[index],
	                    privacy: {
	                        obfuscatedData: []
	                    }
	                } }) });
	    });
	};
	exports.verifyV3 = function (document) {
	    var signature = document.proof.signature;
	    if (!signature) {
	        return false;
	    }
	    // Checks target hash
	    var bla = __assign(__assign({}, document), { proof: __assign(__assign({}, document.proof), { sinature: undefined }) });
	    var digest = digestDocument(bla, document.proof.signature.salts, document.proof.signature.privacy.obfuscatedData);
	    var targetHash = document.proof.signature.targetHash;
	    if (digest !== targetHash)
	        return false;
	    // Calculates merkle root from target hash and proof, then compare to merkle root in document
	    var merkleRoot = document.proof.signature.merkleRoot;
	    var proof = document.proof.signature.proof;
	    var calculatedMerkleRoot = proof.reduce(function (prev, current) {
	        var prevAsBuffer = utils$1.hashToBuffer(prev);
	        var currAsBuffer = utils$1.hashToBuffer(current);
	        var combineAsBuffer = utils$1.bufSortJoin(prevAsBuffer, currAsBuffer);
	        return jsSha3.keccak256(combineAsBuffer);
	    }, digest);
	    return calculatedMerkleRoot === merkleRoot;
	};
	var obfuscateData = function (_data, fields) {
	    var data = lodash.cloneDeep(_data); // Prevents alteration of original data
	    var fieldsToRemove = Array.isArray(fields) ? fields : [fields];
	    var salts = _data.proof.signature.salts;
	    // Obfuscate data by hashing them with the key
	    var obfuscatedData = fieldsToRemove
	        .filter(function (field) { return lodash.get(data, field); })
	        .map(function (field) {
	        var value = lodash.get(data, field);
	        var salt = salts.find(function (s) { return s.path === field; });
	        if (!salt) {
	            throw new Error("Salt not found for " + field);
	        }
	        return utils$1.toBuffer(salt.value + ":" + value).toString("hex");
	    });
	    // Return remaining data
	    fieldsToRemove.forEach(function (path) {
	        lodash.unset(data, path);
	    });
	    return {
	        data: data,
	        obfuscatedData: obfuscatedData
	    };
	};
	exports.obfuscateV3 = function (document, fields) {
	    var _a = obfuscateData(document, fields), data = _a.data, obfuscatedData = _a.obfuscatedData;
	    var currentObfuscatedData = document.proof.signature.privacy.obfuscatedData;
	    var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
	    return __assign(__assign({}, data), { proof: __assign(__assign({}, data.proof), { signature: __assign(__assign({}, data.proof.signature), { privacy: __assign(__assign({}, data.proof.signature.privacy), { obfuscatedData: newObfuscatedData }) }) }) });
	};
	});

	unwrapExports(signature_v3);
	var signature_v3_1 = signature_v3.validateV3;
	var signature_v3_2 = signature_v3.wrapV3;
	var signature_v3_3 = signature_v3.wrapsV3;
	var signature_v3_4 = signature_v3.verifyV3;
	var signature_v3_5 = signature_v3.obfuscateV3;

	var privacy = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	Object.defineProperty(exports, "__esModule", { value: true });



	exports.obfuscateData = function (_data, fields) {
	    var data = lodash.cloneDeep(_data); // Prevents alteration of original data
	    var fieldsToRemove = Array.isArray(fields) ? fields : [fields];
	    // Obfuscate data by hashing them with the key
	    var dataToObfuscate = flatten.flatten(lodash.pick(data, fieldsToRemove));
	    var obfuscatedData = Object.keys(dataToObfuscate).map(function (k) {
	        var obj = {};
	        obj[k] = dataToObfuscate[k];
	        return utils$1.toBuffer(obj).toString("hex");
	    });
	    // Return remaining data
	    fieldsToRemove.forEach(function (path) {
	        lodash.unset(data, path);
	    });
	    return {
	        data: data,
	        obfuscatedData: obfuscatedData
	    };
	};
	// TODO to improve user experience and provide better feedback on what's wrong for non typescript user we might consider performing validation on the object provided
	exports.obfuscateDocument = function (document, fields) {
	    var _a, _b, _c;
	    var existingData = document.data;
	    var _d = exports.obfuscateData(existingData, fields), data = _d.data, obfuscatedData = _d.obfuscatedData;
	    var currentObfuscatedData = (_c = (_b = (_a = document) === null || _a === void 0 ? void 0 : _a.privacy) === null || _b === void 0 ? void 0 : _b.obfuscatedData, (_c !== null && _c !== void 0 ? _c : []));
	    var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
	    return __assign(__assign({}, document), { data: data, privacy: __assign(__assign({}, document.privacy), { obfuscatedData: newObfuscatedData }) });
	};
	});

	unwrapExports(privacy);
	var privacy_1 = privacy.obfuscateData;
	var privacy_2 = privacy.obfuscateDocument;

	var privacy$1 = createCommonjsModule(function (module, exports) {
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	__export(privacy);
	});

	unwrapExports(privacy$1);

	var ecdsaSecp256k1Signature2019 = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });


	var type = document.ProofType.EcdsaSecp256k1Signature2019;
	/**
	 * The document must already be wrapped including a signature block and a targetHash.
	 * It is the targetHash that will be signed.
	 * @param document
	 * @param options
	 */
	function sign(document$1, options) {
	    return __awaiter(this, void 0, void 0, function () {
	        var privateKey, verificationMethod, created, proofPurpose, msg, signature, proof;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    privateKey = options.privateKey, verificationMethod = options.verificationMethod;
	                    created = new Date().toISOString();
	                    proofPurpose = options.proofPurpose || document.ProofPurpose.AssertionMethod;
	                    msg = document$1.signature.targetHash;
	                    return [4 /*yield*/, new ethers.ethers.Wallet(privateKey).signMessage(msg)];
	                case 1:
	                    signature = _a.sent();
	                    proof = { type: type, created: created, proofPurpose: proofPurpose, verificationMethod: verificationMethod, signature: signature };
	                    return [2 /*return*/, __assign(__assign({}, document$1), { proof: proof })];
	            }
	        });
	    });
	}
	exports.sign = sign;
	});

	unwrapExports(ecdsaSecp256k1Signature2019);
	var ecdsaSecp256k1Signature2019_1 = ecdsaSecp256k1Signature2019.sign;

	var sign_1 = createCommonjsModule(function (module, exports) {
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });

	function sign(document, options) {
	    return __awaiter(this, void 0, void 0, function () {
	        var _a;
	        return __generator(this, function (_b) {
	            switch (_b.label) {
	                case 0:
	                    if (!document.signature.targetHash)
	                        throw new Error("Document does not contain signature.targetHash.");
	                    _a = options.type;
	                    switch (_a) {
	                        case "EcdsaSecp256k1Signature2019": return [3 /*break*/, 1];
	                    }
	                    return [3 /*break*/, 3];
	                case 1: return [4 /*yield*/, ecdsaSecp256k1Signature2019.sign(document, options)];
	                case 2: return [2 /*return*/, _b.sent()];
	                case 3:
	                    {
	                        throw new Error("Proof type: " + options.type + " does not exist.");
	                    }
	                case 4: return [2 /*return*/];
	            }
	        });
	    });
	}
	exports.sign = sign;
	});

	unwrapExports(sign_1);
	var sign_2 = sign_1.sign;

	var w3c = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __rest = (commonjsGlobal && commonjsGlobal.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};
	var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
	    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	    for (var r = Array(s), k = 0, i = 0; i < il; i++)
	        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
	            r[k] = a[j];
	    return r;
	};
	Object.defineProperty(exports, "__esModule", { value: true });

	var deepMap = function (value, path) {
	    if (Array.isArray(value)) {
	        return value.flatMap(function (v, index) { return deepMap(v, path + "[" + index + "]"); });
	    }
	    if (typeof value === "object") {
	        return Object.keys(value).flatMap(function (key) { return deepMap(value[key], path ? path + "." + key : key); });
	    }
	    if (typeof value === "string") {
	        var _a = value.split(":"), salt = _a[0], type = _a[1];
	        return [{ type: type, value: salt, path: path }];
	    }
	    throw new Error("unexpected element  " + value + " => " + path);
	};
	var getSalts = function (document) {
	    return deepMap(document.data, "");
	};
	/**
	 * This function is not production ready and is a simple POC to demonstrate that we are able to transform our document to W3C VC
	 * https://www.w3.org/TR/vc-data-model/#types
	 */
	// make it obvious that this function is not production ready
	// eslint-disable-next-line @typescript-eslint/camelcase
	exports.__unsafe__mapToW3cVc = function (document) {
	    var _a = utils$1.getData(document), proof = _a.proof, issuer = _a.issuer, evidence = _a.evidence, type = _a.type, validFrom = _a.validFrom, validUntil = _a.validUntil, context = _a["@context"], rest = __rest(_a, ["proof", "issuer", "evidence", "type", "validFrom", "validUntil", "@context"]);
	    var salts = getSalts(document);
	    return {
	        "@context": __spreadArrays(((context !== null && context !== void 0 ? context : []))),
	        type: __spreadArrays(["VerifiableCredential"], ((type !== null && type !== void 0 ? type : []))).filter(Boolean),
	        issuer: issuer,
	        validFrom: validFrom,
	        validUntil: validUntil,
	        credentialSubject: __assign({}, rest),
	        evidence: evidence,
	        issuanceDate: new Date().toISOString(),
	        proof: __assign(__assign({}, proof), { salts: salts, signature: document.signature })
	    };
	};
	});

	unwrapExports(w3c);
	var w3c_1 = w3c.__unsafe__mapToW3cVc;

	var cjs = createCommonjsModule(function (module, exports) {
	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var __importStar = (commonjsGlobal && commonjsGlobal.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	    result["default"] = mod;
	    return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });





	var utils = __importStar(utils$1);
	exports.utils = utils;
	var v2 = __importStar(schemaV2);
	exports.v2 = v2;
	var v3 = __importStar(schemaV3);
	exports.v3 = v3;


	var defaultVersion = document.SchemaId.v2;
	var createDocument = function (data, option) {
	    var _a, _b, _c;
	    var documentSchema = {
	        version: (_b = (_a = option) === null || _a === void 0 ? void 0 : _a.version, (_b !== null && _b !== void 0 ? _b : defaultVersion)),
	        data: salt$1.saltData(data)
	    };
	    if ((_c = option) === null || _c === void 0 ? void 0 : _c.externalSchemaId) {
	        documentSchema.schema = option.externalSchemaId;
	    }
	    return documentSchema;
	};
	var SchemaValidationError = /** @class */ (function (_super) {
	    __extends(SchemaValidationError, _super);
	    function SchemaValidationError(message, validationErrors, document) {
	        var _this = _super.call(this, message) || this;
	        _this.validationErrors = validationErrors;
	        _this.document = document;
	        return _this;
	    }
	    return SchemaValidationError;
	}(Error));
	var isSchemaValidationError = function (error) {
	    return !!error.validationErrors;
	};
	exports.isSchemaValidationError = isSchemaValidationError;
	function wrapDocument(data, options) {
	    var _a, _b, _c;
	    return __awaiter(this, void 0, void 0, function () {
	        var wrappedDocument, errors_1, document$1, errors;
	        return __generator(this, function (_d) {
	            switch (_d.label) {
	                case 0:
	                    if (!(((_a = options) === null || _a === void 0 ? void 0 : _a.version) === document.SchemaId.v3)) return [3 /*break*/, 2];
	                    wrappedDocument = options.externalSchemaId
	                        ? signature_v3.wrapV3(__assign({ schema: options.externalSchemaId, version: document.SchemaId.v3 }, data))
	                        : signature_v3.wrapV3(__assign({ version: document.SchemaId.v3 }, data));
	                    errors_1 = schema$5.validateSchema(wrappedDocument, schema$5.getSchema(document.SchemaId.v3));
	                    if (errors_1.length > 0) {
	                        console.log(errors_1);
	                        throw new SchemaValidationError("Invalid document", errors_1, wrappedDocument);
	                    }
	                    return [4 /*yield*/, signature_v3.validateV3(wrappedDocument)];
	                case 1:
	                    _d.sent();
	                    return [2 /*return*/, wrappedDocument];
	                case 2:
	                    document$1 = createDocument(data, options);
	                    errors = schema$5.validateSchema(document$1, schema$5.getSchema((_c = (_b = options) === null || _b === void 0 ? void 0 : _b.version, (_c !== null && _c !== void 0 ? _c : defaultVersion))));
	                    if (errors.length > 0) {
	                        throw new SchemaValidationError("Invalid document", errors, document$1);
	                    }
	                    return [2 /*return*/, signature$1.wrap(document$1, [digest$1.digestDocument(document$1)])];
	            }
	        });
	    });
	}
	exports.wrapDocument = wrapDocument;
	function wrapDocuments(dataArray, options) {
	    var _a;
	    if (((_a = options) === null || _a === void 0 ? void 0 : _a.version) === document.SchemaId.v3) {
	        var documents_1 = dataArray.map(function (data) {
	            return options.externalSchemaId
	                ? __assign({ schema: options.externalSchemaId, version: document.SchemaId.v3 }, data) : __assign({ version: document.SchemaId.v3 }, data);
	        });
	        var wrappedDocument = signature_v3.wrapsV3(documents_1);
	        wrappedDocument.forEach(function (document) {
	            var _a, _b;
	            var errors = schema$5.validateSchema(document, schema$5.getSchema((_b = (_a = options) === null || _a === void 0 ? void 0 : _a.version, (_b !== null && _b !== void 0 ? _b : defaultVersion))));
	            if (errors.length > 0) {
	                throw new SchemaValidationError("Invalid document", errors, document);
	            }
	        });
	        return wrappedDocument;
	    }
	    var documents = dataArray.map(function (data) { return createDocument(data, options); });
	    documents.forEach(function (document) {
	        var _a, _b;
	        var errors = schema$5.validateSchema(document, schema$5.getSchema((_b = (_a = options) === null || _a === void 0 ? void 0 : _a.version, (_b !== null && _b !== void 0 ? _b : defaultVersion))));
	        if (errors.length > 0) {
	            throw new SchemaValidationError("Invalid document", errors, document);
	        }
	    });
	    var batchHashes = documents.map(digest$1.digestDocument);
	    return documents.map(function (doc) { return signature$1.wrap(doc, batchHashes); });
	}
	exports.wrapDocuments = wrapDocuments;
	exports.validateSchema = function (document$1) {
	    var _a;
	    return schema$5.validateSchema(document$1, schema$5.getSchema("" + (((_a = document$1) === null || _a === void 0 ? void 0 : _a.version) || document.SchemaId.v2))).length === 0;
	};
	function verifySignature(document$1) {
	    return document$1.version === document.SchemaId.v3 ? signature_v3.verifyV3(document$1) : signature$1.verify(document$1);
	}
	exports.verifySignature = verifySignature;
	function obfuscate(document$1, fields) {
	    return document$1.version === document.SchemaId.v3 ? signature_v3.obfuscateV3(document$1, fields) : privacy$1.obfuscateDocument(document$1, fields);
	}
	exports.obfuscate = obfuscate;
	var digest_2 = digest$1;
	exports.digestDocument = digest_2.digestDocument;
	var signature_2 = signature$1;
	exports.checkProof = signature_2.checkProof;
	exports.MerkleTree = signature_2.MerkleTree;
	var privacy_2 = privacy$1;
	exports.obfuscateDocument = privacy_2.obfuscateDocument;

	exports.sign = sign_1.sign;
	__export(document);
	__export(w3c);
	var utils_1 = utils$1; // keep it to avoid breaking change, moved from privacy to utils
	exports.getData = utils_1.getData;
	});

	var index = unwrapExports(cjs);
	var cjs_1 = cjs.utils;
	var cjs_2 = cjs.v2;
	var cjs_3 = cjs.v3;
	var cjs_4 = cjs.isSchemaValidationError;
	var cjs_5 = cjs.wrapDocument;
	var cjs_6 = cjs.wrapDocuments;
	var cjs_7 = cjs.validateSchema;
	var cjs_8 = cjs.verifySignature;
	var cjs_9 = cjs.obfuscate;
	var cjs_10 = cjs.digestDocument;
	var cjs_11 = cjs.checkProof;
	var cjs_12 = cjs.MerkleTree;
	var cjs_13 = cjs.obfuscateDocument;
	var cjs_14 = cjs.sign;
	var cjs_15 = cjs.getData;

	exports.MerkleTree = cjs_12;
	exports.checkProof = cjs_11;
	exports.default = index;
	exports.digestDocument = cjs_10;
	exports.getData = cjs_15;
	exports.isSchemaValidationError = cjs_4;
	exports.obfuscate = cjs_9;
	exports.obfuscateDocument = cjs_13;
	exports.sign = cjs_14;
	exports.utils = cjs_1;
	exports.v2 = cjs_2;
	exports.v3 = cjs_3;
	exports.validateSchema = cjs_7;
	exports.verifySignature = cjs_8;
	exports.wrapDocument = cjs_5;
	exports.wrapDocuments = cjs_6;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
