import { SigningFunction, SigningOptions, SigningKey } from "../../shared/@types/sign";
import { defaultSigners } from "./signatureSchemes";
import { ethers } from "ethers";

export const signerBuilder =
  (signers: Map<string, SigningFunction>) =>
  (alg: string, message: string, keyOrSigner: SigningKey | ethers.Signer, options?: SigningOptions) => {
    const signer = signers.get(alg);
    if (!signer) throw new Error(`${alg} is not supported as a signing algorithm`);
    return signer(message, keyOrSigner, options);
  };

export const sign = signerBuilder(defaultSigners);

export { defaultSigners };
