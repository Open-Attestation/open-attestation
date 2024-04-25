import { logger } from "ethers";
import { ContextUrl, SchemaId } from "../@types/document";
import { validateSchema as validate } from "../validate";
import {
  VerifiableCredentialWrappedProof as WrappedProofV3,
  VerifiableCredentialWrappedProofStrict as WrappedProofStrictV3,
  VerifiableCredentialSignedProof as SignedWrappedProofV3,
} from "../../3.0/types";
import { ArrayProof, Signature, SignatureStrict } from "../../2.0/types";
import { clone, cloneDeepWith } from "lodash";
import { buildAjv, getSchema } from "../ajv";
import { Kind, Mode } from "./@types/diagnose";
import { isStringArray } from "./utils";

type Version = "2.0" | "3.0" | "4.0";

interface DiagnoseError {
  message: string;
}

const handleError = (debug: boolean, ...messages: string[]) => {
  if (debug) {
    for (const message of messages) {
      logger.info(message);
    }
  }
  return messages.map((message) => ({ message }));
};

// remove enum and pattern from the schema
function transformSchema(schema: Record<string, any>): Record<string, any> {
  const excludeKeys = ["enum", "pattern"];
  function omit(value: any) {
    if (value && typeof value === "object") {
      const key = excludeKeys.find((key) => value[key]);
      if (key) {
        const node = clone(value);
        excludeKeys.forEach((key) => {
          delete node[key];
        });
        return node;
      }
    }
  }

  const newSchema = cloneDeepWith(schema, omit);
  // because we remove check on enum (DNS-DID, DNS-TXT, etc.) the identity proof can match multiple sub schema in v2.
  // so here we change oneOf to anyOf, so that if more than one identityProof matches, it still passes
  if (newSchema?.definitions?.identityProof?.oneOf) {
    newSchema.definitions.identityProof.anyOf = newSchema?.definitions?.identityProof?.oneOf;
    delete newSchema?.definitions?.identityProof?.oneOf;
  }
  return newSchema;
}
// custom ajv for loose schema validation
// it will allow invalid format, invalid pattern and invalid enum
const ajv = buildAjv({ transform: transformSchema, validateFormats: false });

/**
 * Tools to give information about the validity of a document. It will return and eventually output the errors found.
 * @param version 2.0, 3.0 or 4.0
 * @param kind raw, wrapped or signed
 * @param debug turn on to output in the console, the errors found
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 * @param document the document to validate
 */
export const diagnose = ({
  version,
  kind,
  document,
  debug = false,
  mode,
}: {
  version: Version;
  kind: Kind;
  document: any;
  debug?: boolean;
  mode: Mode;
}): DiagnoseError[] => {
  if (!document) {
    return handleError(debug, "The document must not be empty");
  }

  if (typeof document !== "object") {
    return handleError(debug, "The document must be an object");
  }

  const versionToSchemaId: Record<Version, SchemaId> = {
    "2.0": SchemaId.v2,
    "3.0": SchemaId.v3,
    "4.0": SchemaId.v4,
  };

  const errors = validate(
    document,
    getSchema(versionToSchemaId[version], mode === "non-strict" ? ajv : undefined),
    kind
  );

  if (errors.length > 0) {
    // TODO this can be improved later
    return handleError(
      debug,
      `The document does not match OpenAttestation schema ${version}`,
      ...errors.map((error) => `${error.instancePath || "document"} - ${error.message}`)
    );
  }

  if (kind === "raw") {
    return [];
  }

  switch (version) {
    case "4.0":
      return diagnoseV4({ mode, debug, document, kind });
    case "3.0":
      return diagnoseV3({ mode, debug, document, kind });
    case "2.0":
    default:
      return diagnoseV2({ mode, debug, document, kind });
  }
};

const diagnoseV2 = ({ kind, document, debug, mode }: { kind: Kind; document: any; debug: boolean; mode: Mode }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    mode === "strict" ? SignatureStrict.check(document.signature) : Signature.check(document.signature);
  } catch (e) {
    if (e instanceof Error) {
      return handleError(debug, e.message);
    } else {
      console.error(e);
    }
  }
  if (kind === "signed") {
    if (!document.proof || !(document.proof.length > 0)) {
      return handleError(debug, `The document does not have a proof`);
    }
    try {
      ArrayProof.check(document.proof);
    } catch (e) {
      if (e instanceof Error) {
        return handleError(debug, e.message);
      } else {
        console.error(e);
      }
    }
  }

  return [];
};

const diagnoseV3 = ({ kind, document, debug, mode }: { kind: Kind; document: any; debug: boolean; mode: Mode }) => {
  if (document.version !== SchemaId.v3) {
    return handleError(
      debug,
      `The document schema version is wrong. Expected ${SchemaId.v3}, received ${document.version}`
    );
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    mode === "strict" ? WrappedProofStrictV3.check(document.proof) : WrappedProofV3.check(document.proof);
  } catch (e) {
    if (e instanceof Error) {
      return handleError(debug, e.message);
    } else {
      console.error(e);
    }
  }

  if (kind === "signed") {
    if (!document.proof) {
      return handleError(debug, `The document does not have a proof`);
    }
    try {
      SignedWrappedProofV3.check(document.proof);
    } catch (e) {
      if (e instanceof Error) {
        return handleError(debug, e.message);
      } else {
        console.error(e);
      }
    }
  }
  return [];
};

const diagnoseV4 = ({
  kind,
  document,
  debug,
  mode,
}: {
  kind: Exclude<Kind, "raw">;
  document: any;
  debug: boolean;
  mode: Mode;
}) => {
  /* Wrapped document checks */
  try {
    // 1. Since OA v4 has deprecated a few properties from v2/v3, check that they are not used
    const deprecatedProperties = ["version", "openAttestationMetadata"];
    const documentProperties = Object.keys(document);
    const deprecatedDocumentProperties = documentProperties.filter((p) => deprecatedProperties.includes(p));

    if (deprecatedDocumentProperties.length > 0) {
      return handleError(
        debug,
        `The document has outdated properties previously used in v2/v3. The following properties are no longer in use in a v4 document: ${deprecatedDocumentProperties}`
      );
    }

    // 2. Ensure that required @contexts are present
    // @context: [Base, OA, ...]
    const contexts = [ContextUrl.v2_vc, ContextUrl.v4_alpha];
    if (isStringArray(document["@context"])) {
      for (let i = 0; i < contexts.length; i++) {
        if (document["@context"][i] !== contexts[i]) {
          return handleError(
            debug,
            `The document @context contains an unexpected value or in the wrong order. Expected "${contexts}" but received "${document["@context"]}"`
          );
        }
      }
    } else {
      return handleError(
        debug,
        `The document @context should be an array of string values. Expected "${contexts}" but received "${document["@context"]}"`
      );
    }

    // 3. Ensure that required types are present
    // type: ["VerifiableCredential", "OpenAttestationCredential", ...]
    const types = ["VerifiableCredential", "OpenAttestationCredential"];
    if (isStringArray(document["type"])) {
      for (let i = 0; i < types.length; i++) {
        if (document["type"][i] !== types[i]) {
          return handleError(
            debug,
            `The document type contains an unexpected value or in the wrong order. Expected "${types}" but received "${document["type"]}"`
          );
        }
      }
    } else {
      return handleError(
        debug,
        `The document type should be an array of string values. Expected "${types}" but received "${document["type"]}"`
      );
    }

    // 4. Check proof object
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (mode === "strict") {
      WrappedProofStrictV4.check(document.proof);
    } else {
      WrappedProofV4.check(document.proof);
    }
  } catch (e) {
    if (e instanceof Error) {
      return handleError(debug, e.message);
    } else {
      console.error(e);
    }
  }

  /* Signed & wrapped document checks */
  if (kind === "signed") {
    if (!document.proof) {
      return handleError(debug, `The document does not have a proof`);
    }
    try {
      SignedWrappedProofV4.check(document.proof);
    } catch (e) {
      if (e instanceof Error) {
        return handleError(debug, e.message);
      } else {
        console.error(e);
      }
    }
  }

  return [];
};
