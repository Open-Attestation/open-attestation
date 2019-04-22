import { SignedDocument, getData, obfuscateData, obfuscateDocument, setData } from "./privacy";

describe("privacy", () => {
  describe("obfuscateData", () => {
    test("is a pure function", () => {
      const testData = {
        key1: "value1",
        key2: "value2"
      };
      const testDataCopy = {
        key1: "value1",
        key2: "value2"
      };
      obfuscateData(testData, "key1");
      expect(testData).toEqual(testDataCopy);
    });

    test("removes one field", () => {
      const testData = {
        key1: "value1",
        key2: "value2"
      };
      const field = "key1";
      const { data, obfuscatedData } = obfuscateData(testData, field);
      expect(data).toEqual({
        key2: "value2"
      });
      expect(obfuscatedData).toEqual(["1549a7b5fac4126fa0fbdea8c156930790691317e30400feb76c0f5cec06b396"]);
    });

    test("removes multiple fields", () => {
      const testData = {
        key1: "value1",
        key2: "value2"
      };
      const fields = ["key1", "key2"];
      const { data, obfuscatedData } = obfuscateData(testData, fields);
      expect(data).toEqual({});
      expect(obfuscatedData).toEqual([
        "1549a7b5fac4126fa0fbdea8c156930790691317e30400feb76c0f5cec06b396",
        "9effc0520df5aa99bd49cc6521f76b13274a113ef0e4f45cd3bedecbf5d9e3d6"
      ]);
    });

    test("removes values from root object", () => {
      const testData = {
        key1: 2,
        key2: "value2",
        key3: false,
        key4: "control"
      };
      const fields = ["key1", "key2", "key3"];
      const { data, obfuscatedData } = obfuscateData(testData, fields);
      expect(data).toEqual({ key4: "control" });
      expect(obfuscatedData).toEqual([
        "95d3d5290cbedca7c616c3b531280a5d5bbc05ec1301af9990860eb4854974d6",
        "9effc0520df5aa99bd49cc6521f76b13274a113ef0e4f45cd3bedecbf5d9e3d6",
        "4efbbb60071bb9d068120fd1f855ae79773db8a2d966a17edc18235649d78b4f"
      ]);
    });

    test("removes values from nested object", () => {
      const testData = {
        key1: "control",
        key2: {
          key21: "control",
          key22: "value22",
          key23: {
            key231: "control",
            key232: "value232",
            key233: {
              key2331: "control"
            }
          }
        }
      };
      const fields = ["key2.key22", "key2.key23.key232"];
      const { data, obfuscatedData } = obfuscateData(testData, fields);
      expect(data).toEqual({
        key1: "control",
        key2: {
          key21: "control",
          key23: {
            key231: "control",
            key233: {
              key2331: "control"
            }
          }
        }
      });
      expect(obfuscatedData).toEqual([
        "ebc402e918095d861060397a080355b5ba70c203f709795256544d706e2babb1",
        "3155a96711e47297b1c9d8737e7662081c1771a02c535d6fc63c9cf810a9e1ff"
      ]);
    });

    test("removes values from arrays", () => {
      const testData = {
        key1: "control",
        key2: ["value21", "value22", "value23", "value24"],
        key3: {
          key31: "control",
          key32: ["value321", "value322"]
        }
      };
      const fields = ["key2.0", "key2.2", "key3.key32.1"];
      const { data, obfuscatedData } = obfuscateData(testData, fields);
      expect(data).toEqual({
        key1: "control",
        key2: [undefined, "value22", undefined, "value24"],
        key3: {
          key31: "control",
          key32: ["value321", undefined]
        }
      });
      expect(obfuscatedData).toEqual([
        "6861b14e4bb0633052a4c7cf1dbcdec397779ebd34be2c6d1171e3b0035e0a34",
        "97ae60af73c7b5f5523f950655c04e09e90d3d5f34fccd480888c0f8c47bf9de",
        "b42e640700371697ed374f8ce02f6b8348e41e1e9ef18fd3dfaf7ad8d11cca9f"
      ]);
    });
  });

  describe("obfuscateDocument", () => {
    test("is a pure function", () => {
      const document: SignedDocument = {
        schema: "http://example.com/schema-v1.json",
        data: {
          key1: "test"
        },
        privacy: {},
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54",
          proof: [],
          merkleRoot: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54"
        }
      };
      const document2: SignedDocument = {
        schema: "http://example.com/schema-v1.json",
        data: {
          key1: "test"
        },
        privacy: {},
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54",
          proof: [],
          merkleRoot: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54"
        }
      };
      obfuscateDocument(document, "key1");
      expect(document).toEqual(document2);
    });

    test("is transitive", () => {
      const document = {
        schema: "http://example.com/schema-v1.json",
        data: {
          key1: "item1",
          key2: "item4"
        },
        privacy: {},
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "e20e8b2ae5874860486e06a8b7506a16e2ac3bef77457622731718715fe14f02",
          proof: [
            "f83ab45ee162d8745ceb260a05149abc33a52a8efae81ed4c66b766945aa80d9",
            "2dd7ff47612ae3a8416030c5824ef11062ac6bcaecac813f2e30674907771f8a"
          ],
          merkleRoot: "d32eac5b9695e00917e86041f527cd394b99e6c73366762ce40814b25c3f2653"
        }
      };
      const intermediateDoc = obfuscateDocument(document, "key1");
      const finalDoc = obfuscateDocument(intermediateDoc, "key2");
      const finalDoc2 = obfuscateDocument(document, ["key1", "key2"]);
      expect(finalDoc).toEqual(finalDoc2);
    });

    test("returns new document with obfuscated data", () => {
      const document = {
        schema: "http://example.com/schema-v1.json",
        data: {
          key1: "test"
        },
        privacy: {},
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54",
          proof: [],
          merkleRoot: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54"
        }
      };
      const newDoc = obfuscateDocument(document, "key1");
      expect(newDoc).toEqual({
        schema: "http://example.com/schema-v1.json",
        data: {},
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54",
          proof: [],
          merkleRoot: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54"
        },
        privacy: {
          obfuscatedData: ["674afcc934fede83cbfef6361de969d520ec3f8aebacbc984b8d39b11dbdcd38"]
        }
      });
    });
  });

  describe("getData", () => {
    test("returns original data given salted content and, optionally, salt length", () => {
      const document: SignedDocument = {
        schema: "http://example.com/schema-v1.json",
        signature: {
          type: "SHA3MerkleProof",
          targetHash: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54",
          proof: [],
          merkleRoot: "9d88ff928654395a23619187227014fd7c9ef098052bad98b13ad6f8bee50e54"
        },
        privacy: {
          obfuscatedData: ["674afcc934fede83cbfef6361de969d520ec3f8aebacbc984b8d39b11dbdcd38"]
        },
        data: {
          key1: "f9ec69be-ab21-474d-b8d7-012424813dc3:string:value1",
          key2: {
            key21: "181e6794-45e4-4ecd-ac45-4c2aed0d757f:boolean:true"
          }
        }
      };
      const data = getData(document);
      expect(data).toEqual({
        key1: "value1",
        key2: {
          key21: true
        }
      });
    });
  });

  describe("setData", () => {
    test("sets data and obfuscated data of the document", () => {
      const data = {
        key1: "value1",
        key2: {
          key21: true
        }
      };
      const obfuscatedData = [
        "6f60bbe613a4a5b3d448b905f73f559f740131d5aa8d57b4b7ada9b78c72d81e",
        "780f5fbb10e5a2c88c7254c196e20d8c8b74c5b5925be49e8281be5a6cb1a2e2",
        "4d93dd9bbaa80d01010b3f7faaf48ed5da36f0b9408c751493f6cce24a9a0c89"
      ];

      // @ts-ignore intentionally ignoring this as it's supposed to work with malformed data
      const document = setData({}, data, obfuscatedData);
      expect(document.data.key1).toEqual(expect.stringContaining("value1"));
      expect(document.data.key2.key21).toBe(true);

      expect(document.privacy.obfuscatedData).toEqual([
        "6f60bbe613a4a5b3d448b905f73f559f740131d5aa8d57b4b7ada9b78c72d81e",
        "780f5fbb10e5a2c88c7254c196e20d8c8b74c5b5925be49e8281be5a6cb1a2e2",
        "4d93dd9bbaa80d01010b3f7faaf48ed5da36f0b9408c751493f6cce24a9a0c89"
      ]);
    });
  });
});
