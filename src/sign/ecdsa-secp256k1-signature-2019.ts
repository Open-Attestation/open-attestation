import { WrappedDocument, ProofSigningOptions } from "../@types/document";
import { ethers } from "ethers";
const type = "EcdsaSecp256k1Signature2019";

/**
 * The document must already be wrapped including a signature block and a targetHash.
 * It is the targetHash that will be signed.
 * @param document
 * @param options
 */
export const sign = async (document: WrappedDocument, options: ProofSigningOptions): Promise<WrappedDocument> => {
  const { privateKey, verificationMethod } = options;
  const created = new Date().toISOString();
  const proofPurpose = options.proofPurpose || "assertionMethod";
  const msg = document.signature.targetHash;
  const signature = await new ethers.Wallet(privateKey).signMessage(msg);
  const proof = { type, created, proofPurpose, verificationMethod, signature };
  return { ...document, proof };
};
