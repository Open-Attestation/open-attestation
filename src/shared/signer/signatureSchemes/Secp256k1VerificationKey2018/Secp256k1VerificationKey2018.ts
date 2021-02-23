import { Wallet, utils } from "ethers";
import { SigningFunction, SigningKey } from "../../../@types/sign";

export const name = "Secp256k1VerificationKey2018";

export const sign: SigningFunction = async (message: string, key: SigningKey, options = {}) => {
  const wallet = new Wallet(key.private);
  if (!key.public.toLowerCase().includes(wallet.address.toLowerCase()))
    throw new Error(`Private key is wrong for ${key.public}`);
  return wallet.signMessage(options.signAsString ? message : utils.arrayify(message));
};
