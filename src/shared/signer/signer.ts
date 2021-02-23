import { SigningFunction, SigningOptions, SigningKey } from "../../shared/@types/sign";
import { defaultSigners } from "./signatureSchemes";

export const signerBuilder = (signers: Map<string, SigningFunction>) => (
  alg: string,
  message: string,
  key: SigningKey,
  options?: SigningOptions
) => {
  const signer = signers.get(alg);
  if (!signer) throw new Error(`${alg} is not supported as a signing algorithm`);
  return signer(message, key, options);
};

export const sign = signerBuilder(defaultSigners);

export { defaultSigners };
