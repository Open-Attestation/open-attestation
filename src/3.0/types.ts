// types generated by quicktype during postinstall phase
import { OpenAttestationDocument as OpenAttestationDocumentV3 } from "../__generated__/schema.3.0";
import { OpenAttestationHexString, ProofPurpose, SchemaId, SignatureAlgorithm } from "../shared/@types/document";
import { Array as RunTypesArray, Record as RunTypesRecord, Static, String } from "runtypes";

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export interface Salt {
  value: string;
  path: string;
}
/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export const ObfuscationMetadata = RunTypesRecord({
  obfuscated: RunTypesArray(OpenAttestationHexString),
});
/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export type ObfuscationMetadata = Static<typeof ObfuscationMetadata>;

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export const VerifiableCredentialWrappedProof = RunTypesRecord({
  type: SignatureAlgorithm,
  targetHash: String,
  merkleRoot: String,
  proofs: RunTypesArray(String),
  salts: String,
  privacy: ObfuscationMetadata,
  proofPurpose: ProofPurpose,
});
/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export type VerifiableCredentialWrappedProof = Static<typeof VerifiableCredentialWrappedProof>;
/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export const VerifiableCredentialWrappedProofStrict = VerifiableCredentialWrappedProof.And(
  RunTypesRecord({
    targetHash: OpenAttestationHexString,
    merkleRoot: OpenAttestationHexString,
    proofs: RunTypesArray(OpenAttestationHexString),
  })
);
/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export type VerifiableCredentialWrappedProofStrict = Static<typeof VerifiableCredentialWrappedProofStrict>;

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export const VerifiableCredentialSignedProof = VerifiableCredentialWrappedProof.And(
  RunTypesRecord({
    key: String,
    signature: String,
  })
);
/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export type VerifiableCredentialSignedProof = Static<typeof VerifiableCredentialSignedProof>;

// TODO rename to something else that is not proof to allow for did-signed documents
// Also it makes sense to use `proof` to denote a document that has been issued
/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export type WrappedDocument<T extends OpenAttestationDocumentV3 = OpenAttestationDocumentV3> = T & {
  version: SchemaId.v3;
  schema?: string;
  proof: VerifiableCredentialWrappedProof;
};

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export type SignedWrappedDocument<T extends OpenAttestationDocumentV3 = OpenAttestationDocumentV3> =
  WrappedDocument<T> & {
    proof: VerifiableCredentialSignedProof;
  };

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/alpha)
 */
export * from "../__generated__/schema.3.0";
