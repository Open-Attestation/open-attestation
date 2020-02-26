import { WrappedDocument } from "../../@types/document";
import { getData } from "../../utils";
import { OpenAttestationDocument } from "../../__generated__/schemaV3";

interface Salt {
  type: string;
  value: string;
  path: string;
}

const deepMap = (value: any, path: string): Salt[] => {
  if (Array.isArray(value)) {
    return value.flatMap((v, index) => deepMap(v, `${path}[${index}]`));
  }
  if (typeof value === "object") {
    return Object.keys(value).flatMap(key => deepMap(value[key], path ? `${path}.${key}` : key));
  }
  if (typeof value === "string") {
    const [salt, type] = value.split(":");
    return [{ type, value: salt, path }];
  }
  throw new Error(`unexpected element  ${value} => ${path}`);
};
const getSalts = (document: WrappedDocument<OpenAttestationDocument>): Salt[] => {
  return deepMap(document.data, "");
};

/**
 * This function is not production ready and is a simple POC to demonstrate that we are able to transform our document to W3C VC
 * https://www.w3.org/TR/vc-data-model/#types
 */
// make it obvious that this function is not production ready
// eslint-disable-next-line @typescript-eslint/camelcase
export const __unsafe__mapToW3cVc = (document: WrappedDocument<OpenAttestationDocument>): any => {
  const { proof, issuer, attachments, type, validFrom, validUntil, "@context": context, ...rest } = getData(document);
  const salts = getSalts(document);
  return {
    "@context": ["https://www.w3.org/2018/credentials/v1", ...(context ?? [])],
    type: ["VerifiableCredential", ...(type ?? [])].filter(Boolean),
    issuer: {
      id: issuer.id,
      name: issuer.name
    },
    validFrom,
    validUntil,
    credentialSubject: { ...rest },
    evidence: attachments,
    proof: {
      ...proof,
      salts,
      identityProof: issuer.identityProof,
      signature: document.signature
    }
  };
};
