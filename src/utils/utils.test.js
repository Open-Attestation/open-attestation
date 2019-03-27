const { keccak256 } = require("ethereumjs-util");
const utils = require("./utils");

describe("Util Functions", () => {
  describe("hashArray", () => {
    it("should work", () => {
      const res = utils.hashArray(["a", "b", "1", 5]);

      const expectedHashResults = [
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc",
        "9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2",
        "a78c7e6cf27e778ce55aaa2a786943f1578bc76edcb296abc95981c786bb89c1",
        "ceebf77a833b30520287ddd9478ff51abbdffa30aa90a8d655dba0e8a79ce0c1"
      ];

      expect(res.map(p => p.hexSlice())).to.deep.equal(expectedHashResults);
    });
  });

  describe("bufSortJoin", () => {
    it("should work", () => {
      const res = utils.bufSortJoin(
        Buffer.from("c"),
        Buffer.from("b"),
        Buffer.from("a")
      );
      const expectedResults = "616263";
      expect(res.hexSlice()).to.deep.equal(expectedResults);
    });
  });

  describe("hashToBuffer", () => {
    it("should work", () => {
      expect(utils.hashToBuffer("foo")).to.deep.equal(
        Buffer.from("foo", "hex")
      );
    });

    it("should do nothing if the input is a hash", () => {
      const originalBuffer = Buffer.from("foo", "utf8");
      expect(utils.hashToBuffer(originalBuffer)).to.deep.equal(originalBuffer);
    });
  });

  describe("toBuffer", () => {
    it("should work", () => {
      expect(utils.toBuffer("foo").hexSlice()).to.deep.equal(
        "837fb5aa99ab7d0392fa43e61f529f072a693fd38032cd4a039793a9f9b4ea42"
      );
    });

    it("should do nothing if the input is a hash", () => {
      const originalBuffer = keccak256(Buffer.from("foo", "utf8"));
      expect(utils.toBuffer(originalBuffer)).to.deep.equal(originalBuffer);
    });
  });

  describe("sha256", () => {
    it("should hash content without salt", () => {
      expect(utils.sha256("password123")).to.deep.equal(
        "sha256$ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
      );
    });

    it("should hash content with salt", () => {
      expect(utils.sha256("password", "123")).to.deep.equal(
        "sha256$ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
      );
    });
  });

  describe("randomSalt", () => {
    it("should generate default salt", () => {
      expect(utils.randomSalt().length).to.equal(20);
    });

    it("should generate salt with given entropy (in bytes)", () => {
      expect(utils.randomSalt(256).length).to.equal(512);
    });

    it("should not collide LOL", () => {
      expect(utils.randomSalt()).to.not.equal(utils.randomSalt());
    });
  });

  describe("combineHashBuffers", () => {
    it("should combine two hashes (in buffer format) and return result as a string", () => {
      expect(
        utils
          .combineHashBuffers(
            utils.hashToBuffer(
              "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
            ),
            utils.hashToBuffer(
              "9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2"
            )
          )
          .toString("hex")
      ).to.equal(
        "6a4fe9cb57c9f79964c0408f25d70a73b3448bc6e975d0a905f0f8694764954b"
      );
    });

    it("should return original hash if only one is given", () => {
      expect(
        utils
          .combineHashBuffers(
            utils.hashToBuffer(
              "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
            )
          )
          .toString("hex")
      ).to.equal(
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
      );
      expect(
        utils
          .combineHashBuffers(
            null,
            utils.hashToBuffer(
              "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
            )
          )
          .toString("hex")
      ).to.equal(
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
      );
    });
  });

  describe("combineHashString", () => {
    it("should combine two hashes (in string format) and return result as a string", () => {
      expect(
        utils.combineHashString(
          "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc",
          "9261495095bfbb82deedb97b2be90d0f4c0d9a03fdd90a9da62c1bbcc45d7eb2"
        )
      ).to.equal(
        "6a4fe9cb57c9f79964c0408f25d70a73b3448bc6e975d0a905f0f8694764954b"
      );
    });

    it("should return original hash if only one is given", () => {
      expect(
        utils.combineHashString(
          "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
        )
      ).to.equal(
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
      );
      expect(
        utils.combineHashString(
          null,
          "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
        )
      ).to.equal(
        "660c9a8d0051d07b1abd38e8a6f68076d98fdf948abd2a13e2870fe08a1343cc"
      );
    });
  });
});
