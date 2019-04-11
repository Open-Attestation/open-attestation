import { keccak256 } from "ethereumjs-util";
import * as utils from "./utils";

describe("Util Functions", () => {
  describe("hashArray", () => {
    test("should work", () => {
      const res = utils.hashArray(["a", "b", "1", 5]);

      const expectedHashResults = [
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc",
        "9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2",
        "a78c7e6cf27e778ce55aaa2a786943f1578bc76edcb296abc95981c786bb89c1",
        "ceebf77a833b30520287ddd9478ff51abbdffa30aa90a8d655dba0e8a79ce0c1"
      ];

      expect(res.map(p => p.toString("hex"))).toEqual(expectedHashResults);
    });
  });

  describe("bufSortJoin", () => {
    test("should work", () => {
      const res = utils.bufSortJoin(Buffer.from("c"), Buffer.from("b"), Buffer.from("a"));
      const expectedResults = "616263";
      expect(res.toString("hex")).toEqual(expectedResults);
    });
  });

  describe("hashToBuffer", () => {
    test("should work", () => {
      expect(utils.hashToBuffer("foo")).toEqual(Buffer.from("foo", "hex"));
    });

    test("should do nothing if the input is a hash", () => {
      const originalBuffer = Buffer.from("foo", "utf8");
      expect(utils.hashToBuffer(originalBuffer)).toEqual(originalBuffer);
    });
  });

  describe("toBuffer", () => {
    test("should work", () => {
      expect(utils.toBuffer("foo").toString("hex")).toEqual(
        "837fb5aa99ab7d0392fa43e61f529f072a693fd38032cd4a039793a9f9b4ea42"
      );
    });

    test("should do nothing if the input is a hash", () => {
      const originalBuffer = keccak256(Buffer.from("foo", "utf8"));
      expect(utils.toBuffer(originalBuffer)).toEqual(originalBuffer);
    });
  });

  describe("sha256", () => {
    test("should hash content without salt", () => {
      expect(utils.sha256("password123")).toEqual(
        "sha256$ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
      );
    });

    test("should hash content with salt", () => {
      expect(utils.sha256("password", "123")).toEqual(
        "sha256$ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
      );
    });
  });

  describe("randomSalt", () => {
    test("should generate default salt", () => {
      expect(utils.randomSalt().length).toBe(20);
    });

    test("should generate salt with given entropy (in bytes)", () => {
      expect(utils.randomSalt(256).length).toBe(512);
    });

    test("should not collide LOL", () => {
      expect(utils.randomSalt()).not.toBe(utils.randomSalt());
    });
  });

  describe("combineHashBuffers", () => {
    test("should combine two hashes (in buffer format) and return result as a string", () => {
      expect(
        utils
          .combineHashBuffers(
            utils.hashToBuffer("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"),
            utils.hashToBuffer("9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2")
          )
          .toString("hex")
      ).toBe("6a4fe9cb57c9f79964c0408f25d70a73b3448bc6e975d0a905f0f8694764954b");
    });

    test("should return original hash if only one is given", () => {
      expect(
        utils
          .combineHashBuffers(utils.hashToBuffer("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"))
          .toString("hex")
      ).toBe("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc");
      expect(
        utils
          .combineHashBuffers(
            undefined,
            utils.hashToBuffer("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc")
          )
          .toString("hex")
      ).toBe("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc");
    });
  });

  describe("combineHashString", () => {
    test("should combine two hashes (in string format) and return result as a string", () => {
      expect(
        utils.combineHashString(
          "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc",
          "9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2"
        )
      ).toBe("6a4fe9cb57c9f79964c0408f25d70a73b3448bc6e975d0a905f0f8694764954b");
    });

    test("should return original hash if only one is given", () => {
      expect(utils.combineHashString("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc")).toBe(
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
      );
      expect(
        utils.combineHashString(undefined, "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc")
      ).toBe("660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc");
    });
  });
});
