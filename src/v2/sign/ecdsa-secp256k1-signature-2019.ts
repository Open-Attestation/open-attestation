import {
  WrappedDocument,
  ProofSigningOptions,
  SignedWrappedDocument,
  ProofPurpose,
  ProofType
} from "../../shared/@types/document";
import { ethers } from "ethers";
const type = ProofType.EcdsaSecp256k1Signature2019;

/**
 * The document must already be wrapped including a signature block and a targetHash.
 * It is the targetHash that will be signed.
 * @param document
 * @param options
 */
export async function sign<T = any>(
  document: WrappedDocument<T>,
  options: ProofSigningOptions
): Promise<SignedWrappedDocument<T>> {
  const { privateKey, verificationMethod } = options;
  const created = new Date().toISOString();
  const proofPurpose = options.proofPurpose || ProofPurpose.AssertionMethod;
  const msg = document.signature.targetHash;
  const signature = await new ethers.Wallet(privateKey).signMessage(msg);
  const proof = { type, created, proofPurpose, verificationMethod, signature };
  return { ...document, proof };
}
