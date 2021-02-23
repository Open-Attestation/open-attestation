export enum SUPPORTED_SIGNING_ALGORITHM {
  Secp256k1VerificationKey2018 = "Secp256k1VerificationKey2018"
}
export interface SigningOptions {
  signAsString?: boolean;
}

export interface SigningKey {
  private: string;
  public: string;
}

export type SigningFunction = (message: string, key: SigningKey, options?: SigningOptions) => Promise<string>;
