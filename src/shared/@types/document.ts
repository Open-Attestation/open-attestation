// types generated by quicktype during postinstall phase
import { OpenAttestationDocument as OpenAttestationDocumentV2 } from "../../__generated__/schema.2.0";
import { OpenAttestationDocument as OpenAttestationDocumentV3 } from "../../__generated__/schema.3.0";
import {
  SignedWrappedDocument as SignedWrappedDocumentV2,
  WrappedDocument as WrappedDocumentV2,
} from "../../2.0/types";
import {
  SignedWrappedDocument as SignedWrappedDocumentV3,
  WrappedDocument as WrappedDocumentV3,
} from "../../3.0/types";
import { Literal, Static, String } from "runtypes";
import { isHexString } from "ethers";

export type OpenAttestationDocument = OpenAttestationDocumentV2 | OpenAttestationDocumentV3;
export type WrappedDocument<T extends OpenAttestationDocument> = T extends OpenAttestationDocumentV2
  ? WrappedDocumentV2<T>
  : T extends OpenAttestationDocumentV3
  ? WrappedDocumentV3<T>
  : unknown;
export type SignedWrappedDocument<T extends OpenAttestationDocument> = T extends OpenAttestationDocumentV2
  ? SignedWrappedDocumentV2<T>
  : T extends OpenAttestationDocumentV3
  ? SignedWrappedDocumentV3<T>
  : unknown;

export enum SchemaId {
  v2 = "https://schema.openattestation.com/2.0/schema.json",
  v3 = "https://schema.openattestation.com/3.0/schema.json",
}

export const OpenAttestationHexString = String.withConstraint(
  (value) => isHexString(`0x${value}`, 32) || `${value} has not the expected length of 32 bytes`
);

export const SignatureAlgorithm = Literal("OpenAttestationMerkleProofSignature2018");
export type SignatureAlgorithm = Static<typeof SignatureAlgorithm>;
export const ProofType = Literal("OpenAttestationSignature2018");
export type ProofType = Static<typeof ProofType>;
export const ProofPurpose = Literal("assertionMethod");
export type ProofPurpose = Static<typeof ProofPurpose>;
