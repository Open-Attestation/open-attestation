const { isHexString } = require("./regex");

describe("utils/regex", () => {
  describe("isHexString", () => {
    const validHexString = "0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce";
    it("should return true when the input is a hex string", () => {
      expect(isHexString(validHexString)).to.be.true;
    });
    it("should return true when the hex string has uppercases as well", () => {
      expect(isHexString("0xAAAcc")).to.be.true;
    });
    it("should return false when the hex string is a number", () => {
      expect(isHexString(0x123)).to.be.false;
    });
    it("should return false when the input looks like a hex string but has non-hex chars", () => {
      expect(isHexString("0xYzPf")).to.be.false;
    });
    it("should return true when its obviously not a hex string", () => {
      expect(isHexString("asdasd")).to.be.false;
    });
    it("should return true if the valid hex string does not have letters", () => {
      expect(isHexString("0x11111")).to.be.true;
    });
    it("should return true if the valid hex string only has letters", () => {
      expect(isHexString("0xaaaaAAAbb")).to.be.true;
    });
    it("should return true for very long valid hex strings", () => {
      const longHexString = `${validHexString}${validHexString
        .substring(2)
        .repeat(2000)}`;
      expect(isHexString(longHexString)).to.be.true;
    });
  });
});
