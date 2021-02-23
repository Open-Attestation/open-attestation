import { sign } from ".";

it("should sign a hex string correctly", async () => {
  expect(
    await sign("0xcce7bd33bd80b746b71e943e23ddc88fcb99c9011becdd1b4d8b7ab9567d2adb", {
      private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
      public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller"
    })
  ).toBe(
    "0xff0227ce8400a17a2d80073a95fd895f4fed0011954c90eef389bc618087a4b36ed958775420d122e9a6764c6ffe9d3302d4f45fb065d5e962c3572d3872f31a1b"
  );
});

it("should sign a string literal correctly", async () => {
  expect(
    await sign(
      "foobar",
      {
        private: "0x497c85ed89f1874ba37532d1e33519aba15bd533cdcb90774cc497bfe3cde655",
        public: "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89#controller"
      },
      { signAsString: true }
    )
  ).toBe(
    "0xdf5c332dbc99a69987d4b448bc4324194f400f3e821af76e550820cb956b0f9d6719499d11c14461ee2a6cdb09dd7cd4b8f9941b328da53866f456cee61f427c1c"
  );
});
