import { salt, decodeSalt } from "../salt";
import { Base64 } from "js-base64";

describe("V4.0 salt", () => {
  describe("salt", () => {
    test("handles shadowed keys correctly (type 1: root, dot notation)", () => {
      const vc = {
        "credentialSubject.alumniOf":
          "0xSomeMaliciousDocumentStore, this would be at credentialSubject.alumniOf after flatMap if uncaught",
      };
      expect(() => {
        salt(vc);
      }).toThrow("Key names must not have . in them");
    });
    test("handles shadowed keys correctly (type 2: root, array index)", () => {
      const vc = {
        "type[1]": "MaliciousCredential, this would be at type[1] after flatMap if uncaught",
      };
      expect(() => {
        salt(vc);
      }).toThrow("Key names must not have '[' or ']' in them");
    });
    test("handles shadowed keys correctly (type 3: nested as object, dot notation)", () => {
      const vc = {
        nested: {
          "credentialSubject.alumniOf":
            "0xSomeMaliciousDocumentStore, this would be at nested.credentialSubject.alumniOf after flatMap if uncaught",
        },
      };
      expect(() => {
        salt(vc);
      }).toThrow("Key names must not have . in them");
    });
    test("handles shadowed keys correctly (type 4: nested as object, array index)", () => {
      const vc = {
        nested: { "type[1]": "this would be at nested.type[1] after flatMap if uncaught" },
      };
      expect(() => {
        salt(vc);
      }).toThrow("Key names must not have '[' or ']' in them");
    });
    test("handles shadowed keys correctly (type 5: nested as array, dot notation)", () => {
      const vc = {
        nested: [{ "shadowed.key": "this would be at nested[0].shadowed.key after flatMap if uncaught" }],
      };
      expect(() => {
        salt(vc);
      }).toThrow("Key names must not have . in them");
    });
    test("handles shadowed keys correctly (type 6: nested as array, array index)", () => {
      const vc = {
        nested: [{ "type[1]": "this would be at nested[0].type[1] after flatMap if uncaught" }],
      };
      expect(() => {
        salt(vc);
      }).toThrow("Key names must not have '[' or ']' in them");
    });

    test("handles null values correctly", () => {
      const vc = {
        grades: null,
      };
      const salted = salt(vc);
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades" }));
    });
    test("handles undefined values correctly", () => {
      const vc = {
        grades: undefined,
      };
      expect(() => {
        salt(vc);
      }).toThrow("Unexpected data 'undefined' in 'grades'"); // Cannot convert undefined or null to object?
    });
    test("handles numbers and booleans correctly", () => {
      const vc = {
        grades: ["A+", 100, 50.28, true, "B+"],
      };
      const salted = salt(vc);
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[0]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[1]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[2]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[3]" }));
      expect(salted).toContainEqual(expect.objectContaining({ path: "grades[4]" }));
    });
    test("throw on sparse arrays (we do not support obfuscation of array item as JSON turns empty slots into null values)", () => {
      const vc = {
        grades: ["A+", 100, , , , true, "B+"],
      };
      expect(() => salt(vc)).toThrow(`Unexpected data 'undefined'`);
    });
  });

  describe("decodeSalt", () => {
    it("should throw when salt is of wrong length to prevent attack on value", () => {
      const encodedSalt = Base64.encode(
        JSON.stringify([{ path: "foo", value: "123456789012345678901234567890123456789012345678901234567890" }])
      );
      expect(() => decodeSalt(encodedSalt)).toThrowError("Salt must be 32 bytes");
    });

    it("should decode salt correctly", () => {
      const encodedSalt = Base64.encode(
        JSON.stringify([{ path: "foo", value: "1234567890123456789012345678901234567890123456789012345678901234" }])
      );
      const decoded = decodeSalt(encodedSalt);
      expect(decoded).toMatchInlineSnapshot(`
        [
          {
            "path": "foo",
            "value": "1234567890123456789012345678901234567890123456789012345678901234",
          },
        ]
      `);
    });
  });
});
