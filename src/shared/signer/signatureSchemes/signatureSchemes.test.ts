import { defaultSigners } from ".";

it("supports Secp256k1VerificationKey2018", () => {
  expect(defaultSigners.has("Secp256k1VerificationKey2018")).toBe(true);
});
