import { AttachmentType, OpenAttestationDocument } from "../__generated__/schemaV2";
import {
  OpenAttestationVerifiableCredential,
  Salt,
  SchemaId,
  SignatureAlgorithm,
  WrappedDocument
} from "../shared/@types/document";
import { getData } from "../shared/utils";
import { Evidence, Method, MIMEType, OaProofType } from "../__generated__/schemaV3";
import { v4 as uuid } from "uuid";
import { encodeSalt } from "./wrap";

const error = (error: string): any => {
  throw new Error(error);
};

const transformAttachmentType = (attachmentType: AttachmentType): MIMEType => {
  switch (attachmentType) {
    case AttachmentType.ApplicationPDF:
      return MIMEType.ApplicationPDF;
    case AttachmentType.ImageJPEG:
      return MIMEType.ImageJPEG;
    case AttachmentType.ImagePNG:
      return MIMEType.ImagePNG;
    default:
      throw new Error("");
  }
};

const deepMap = (value: any, path: string): Salt[] => {
  if (Array.isArray(value)) {
    return value.flatMap((v, index) => deepMap(v, `${path}[${index}]`));
  }
  // Since null values are allowed but typeof null === "object", the "&& value" is used to skip this
  if (typeof value === "object" && value) {
    return Object.keys(value).flatMap(key => deepMap(value[key], path ? `${path}.${key}` : key));
  }
  if (typeof value === "string") {
    const [salt] = value.split(":");
    return [{ value: salt, path }];
  }
  throw new Error(`Unexpected value '${value}' in '${path}'`);
};

export const mapWrappedDocumentToVerifiableCredential = (
  wrappedDocument: WrappedDocument<OpenAttestationDocument>,
  options?: { contexts?: string[]; issuerId: string }
): OpenAttestationVerifiableCredential => {
  const { issuers, $template, attachments, ...rest } = getData(wrappedDocument);
  if (issuers.length > 1)
    throw new Error(
      "Can't transform your wrapped document into an open-attestation verifiable credential: multiple issuers is not supported"
    );
  const issuer = issuers[0];
  if (!issuer.identityProof)
    throw new Error(
      "Can't transform your wrapped document into an open-attestation verifiable credential: identityProof is required for issuer"
    );

  if (typeof $template === "string")
    throw new Error(
      "Can't transform your wrapped document into an open-attestation verifiable credential: $template must not be a string"
    );

  /**
   * TODO this is not correct
   * the path returned must match the targeted path (can be done by using a transformation function)
   * can we really map from v2 to v3 ? we need to add data in the document which will make it actually not valid regarding the current implementation
   */
  const salts = deepMap(wrappedDocument.data, "");

  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://nebulis.github.io/tmp-jsonld/OpenAttestation.v3.jsonld",
      ...(options?.contexts ?? [])
    ],
    version: SchemaId.v3,
    issuer: {
      identityProof: issuer.identityProof,
      name: issuer.name,
      id:
        options?.issuerId ??
        issuer.id ??
        error(
          "Can't transform your wrapped document into an open-attestation verifiable credential: issuer id is required"
        )
    },
    type: "VerifiableCredential",
    credentialSubject: rest,
    issuanceDate: new Date().toISOString(),
    evidence:
      attachments?.map(
        (attachment): Evidence => {
          return {
            data: attachment.data,
            fileName: attachment.filename,
            mimeType: transformAttachmentType(attachment.type),
            type: "DocumentVerification2018"
          };
        }
      ) ?? [],
    template: $template,
    oaProof: {
      method: issuer.tokenRegistry ? Method.TokenRegistry : Method.DocumentStore,
      type: OaProofType.OpenAttestationProofMethod,
      value:
        issuer.tokenRegistry ??
        issuer.documentStore ??
        issuer.certificateStore ??
        error(
          "Can't transform your wrapped document into an open-attestation verifiable credential: identityProof is required for issuer"
        )
    },
    proof: {
      targetHash: wrappedDocument.signature.targetHash,
      merkleRoot: wrappedDocument.signature.merkleRoot,
      proofs: wrappedDocument.signature.proof,
      privacy: {
        obfuscated: wrappedDocument.privacy?.obfuscatedData ?? []
      },
      type: SignatureAlgorithm.OpenAttestationMerkleProofSignature2018,
      salts: encodeSalt(salts)
    }
  };
};
