import { ethers } from "ethers";
import { Record, Static, String } from "runtypes";

export enum SUPPORTED_SIGNING_ALGORITHM {
  Secp256k1VerificationKey2018 = "Secp256k1VerificationKey2018",
}
export interface SigningOptions {
  signAsString?: boolean;
  signer?: ethers.Signer;
}
export const SigningKey = Record({
  private: String,
  public: String,
});

export type SigningKey = Static<typeof SigningKey>;

export type SigningFunction = (
  message: string,
  key: SigningKey | ethers.Signer,
  options?: SigningOptions,
) => Promise<string>;
