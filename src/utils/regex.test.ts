import { isHexString } from "./regex";

describe("utils/regex", () => {
  describe("isHexString", () => {
    const validHexString = "0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce";
    test("should return true when the input is a hex string", () => {
      expect(isHexString(validHexString)).toBe(true);
    });
    test("should return true when the hex string has uppercases as well", () => {
      expect(isHexString("0xAAAcc")).toBe(true);
    });
    test("should return false when the hex string is a number", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore make it fail
      expect(isHexString(0x123)).toBe(false);
    });
    test("should return false when the input looks like a hex string but has non-hex chars", () => {
      expect(isHexString("0xYzPf")).toBe(false);
    });
    test("should return true when its obviously not a hex string", () => {
      expect(isHexString("asdasd")).toBe(false);
    });
    test("should return true if the valid hex string does not have letters", () => {
      expect(isHexString("0x11111")).toBe(true);
    });
    test("should return true if the valid hex string only has letters", () => {
      expect(isHexString("0xaaaaAAAbb")).toBe(true);
    });
    test("should return true for very long valid hex strings", () => {
      const longHexString = `${validHexString}${validHexString.substring(2).repeat(2000)}`;
      expect(isHexString(longHexString)).toBe(true);
    });
  });
});
