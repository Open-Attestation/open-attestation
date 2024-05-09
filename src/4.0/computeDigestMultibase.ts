import { Sha256 } from "@aws-crypto/sha256-universal";
import { base58 } from "ethers/lib/utils";

/**
 * Computes a SHA-256 digest of the provided data and encodes it in Base58 with a 'z' prefix,
 * conforming to the Multibase encoding standard. This function is intended for generating
 * a multibase-encoded multihash, specifically using SHA-2 with 256-bits of output.
 * The multibase value is fixed as 'z' to match the specifications.
 *
 * @param {ArrayBuffer|string} data - The data to hash. This can be either a string or an ArrayBuffer.
 * @returns {Promise<string>} A promise that resolves to the Base58 encoded SHA-256 hash of the input data,
 *                            prefixed with 'z' as per the Multibase specification.
 */
export async function computeDigestMultibase(data: ArrayBuffer | string): Promise<string> {
  const sha256 = new Sha256();
  sha256.update(data);
  const sha256Digest = await sha256.digest();
  // manually prefix with 'z' as per https://w3c-ccg.github.io/multibase/#mh-registry
  return `z${base58.encode(sha256Digest)}`;
}
