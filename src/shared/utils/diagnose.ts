import { logger } from "ethers";
import { SchemaId } from "../@types/document";
import { validateSchema as validate } from "../validate";
import {
  VerifiableCredentialSignedProof,
  VerifiableCredentialWrappedProof,
  VerifiableCredentialWrappedProofStrict,
} from "../../3.0/types";
import { ArrayProof, Signature, SignatureStrict } from "../../2.0/types";
import { getSchema } from "../ajv";
import { Kind, Mode } from "./@types/diagnose";

type Version = "2.0" | "3.0";

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

/**
 * Tools to give information about the validity of a document. It will return and eventually output the errors found.
 * @param version 2.0 or 3.0
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

  const errors = validate(document, getSchema(version === "3.0" ? SchemaId.v3 : SchemaId.v2), kind);

  if (errors.length > 0) {
    // TODO this can be improved later
    return handleError(
      debug,
      `The document does not match OpenAttestation schema ${version === "3.0" ? "3.0" : "2.0"}`,
      ...errors.map((error) => `${error.instancePath || "document"} - ${error.message}`)
    );
  }

  if (kind === "raw") {
    return [];
  }

  if (version === "3.0") {
    return diagnoseV3({ mode, debug, document, kind });
  } else {
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
    mode === "strict"
      ? VerifiableCredentialWrappedProofStrict.check(document.proof)
      : VerifiableCredentialWrappedProof.check(document.proof);
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
      VerifiableCredentialSignedProof.check(document.proof);
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
