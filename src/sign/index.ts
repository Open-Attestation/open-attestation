import { WrappedDocument, ProofSigningOptions } from "../@types/document";
import { sign as EcdsaSecp256k1Signature2019 } from "./EcdsaSecp256k1Signature2019";

export const sign = async (document: WrappedDocument, options: ProofSigningOptions): Promise<WrappedDocument> => {
  switch (options.type) {
    case "EcdsaSecp256k1Signature2019": {
      return await EcdsaSecp256k1Signature2019(document, options);
    }
    default: {
      throw new Error(`Proof type: ${options.type} does not exist.`);
    }
  }
};
