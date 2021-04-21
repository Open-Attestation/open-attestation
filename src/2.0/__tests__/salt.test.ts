import {
  deepMap,
  primitiveToTypedString,
  saltData,
  typedStringToPrimitive,
  unsalt,
  unsaltData,
  uuidSalt,
} from "../salt";

const someObj = {
  keyA: "value 1",
  keyB: {
    nestedKeyA: "nested value 1",
    nestedKeyBwithArray: [
      {
        arrayObject1KeyA: "array object value 1",
        arrayObject1KeyB: 3,
        arrayObject1KeyC: false,
        arrayObject1KeyD: "0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce",
        arrayObject1KeyE: "3.14159",
        arrayObject1KeyF: "true",
        arrayObject1KeyG: "false",
        arrayObject1KeyH: "undefined",
        arrayObject1KeyI: "null",
        arrayObject1KeyJ: undefined,
        arrayObject1KeyK: null,
      },
      {
        arrayObject2KeyA: {
          arrayObject2NestedObjectA: "array object nested object value 1",
          arrayObject2NestedObjectB: 5,
          arrayObject2NestedObjectC: true,
        },
      },
    ],
    nestedKeyC: {
      doubleNestedKeyA: "value 5",
    },
  },
  keyWithNumberArray: [123, 321],
  keyWithStringArray: ["foo", "bar"],
};

describe("salt", () => {
  describe("uuidSalt", () => {
    test("salts and add type to primitives", () => {
      const saltedString = uuidSalt("test string");
      const uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/;
      expect(saltedString.length).toBe(55);
      expect(saltedString.substring(36, 37)).toBe(":");
      expect(uuidRegex.test(saltedString.split(":")[0])).toBe(true);
      expect(saltedString.substring(37)).toBe("string:test string");
    });
  });

  describe("deepMap", () => {
    const fakeSalt = (value: any) => `fakesalt: ${String(value)}`;

    const fakeSaltedObject = {
      keyA: "fakesalt: value 1",
      keyB: {
        nestedKeyA: "fakesalt: nested value 1",
        nestedKeyBwithArray: [
          {
            arrayObject1KeyA: "fakesalt: array object value 1",
            arrayObject1KeyB: "fakesalt: 3",
            arrayObject1KeyC: "fakesalt: false",
            arrayObject1KeyD: "fakesalt: 0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce",
            arrayObject1KeyE: "fakesalt: 3.14159",
            arrayObject1KeyF: "fakesalt: true",
            arrayObject1KeyG: "fakesalt: false",
            arrayObject1KeyH: "fakesalt: undefined",
            arrayObject1KeyI: "fakesalt: null",
            arrayObject1KeyJ: "fakesalt: undefined",
            arrayObject1KeyK: "fakesalt: null",
          },
          {
            arrayObject2KeyA: {
              arrayObject2NestedObjectA: "fakesalt: array object nested object value 1",
              arrayObject2NestedObjectB: "fakesalt: 5",
              arrayObject2NestedObjectC: "fakesalt: true",
            },
          },
        ],
        nestedKeyC: { doubleNestedKeyA: "fakesalt: value 5" },
      },
      keyWithNumberArray: ["fakesalt: 123", "fakesalt: 321"],
      keyWithStringArray: ["fakesalt: foo", "fakesalt: bar"],
    };

    test("traverses copys if no function is supplied", () => {
      expect(deepMap(someObj)).toEqual(someObj);
    });

    test("should apply function recursively", () => {
      expect(deepMap(someObj, fakeSalt)).toEqual(fakeSaltedObject);
    });
  });

  describe("unsalt", () => {
    test("should unsalt numbers", () => {
      expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5")).toBe(5);
      expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:number:51234")).toBe(51234);
      expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:number:51234.54321")).toBe(51234.54321);
    });
    test("should unsalt booleans", () => {
      expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:boolean:true")).toBe(true);
      expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:boolean:false")).toBe(false);
    });
    test("should unsalt strings", () => {
      expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:string:abcd")).toBe("abcd");
    });
    test("should unsalt numbers in string format", () => {
      expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:string:1234")).toBe("1234");
    });
  });

  describe("primitiveToTypedString", () => {
    test("works for number", () => {
      expect(primitiveToTypedString(12)).toEqual("number:12");
      expect(primitiveToTypedString(3.14159)).toEqual("number:3.14159");
    });

    test("works for string", () => {
      expect(primitiveToTypedString("test")).toEqual("string:test");
      expect(primitiveToTypedString("true")).toEqual("string:true");
      expect(primitiveToTypedString("1")).toEqual("string:1");
      expect(primitiveToTypedString("3.14159")).toEqual("string:3.14159");
    });

    test("works for boolean", () => {
      expect(primitiveToTypedString(true)).toEqual("boolean:true");
      expect(primitiveToTypedString(false)).toEqual("boolean:false");
    });

    test("works for null", () => {
      expect(primitiveToTypedString(null)).toEqual("null:null");
    });

    test("works for undefined", () => {
      expect(primitiveToTypedString(undefined)).toEqual("undefined:undefined");
    });
  });

  describe("typedStringToPrimitive", () => {
    test("works for number", () => {
      expect(typedStringToPrimitive("number:12")).toEqual(12);
      expect(typedStringToPrimitive("number:3.14159")).toEqual(3.14159);
    });

    test("works for string", () => {
      expect(typedStringToPrimitive("string:test")).toEqual("test");
      expect(typedStringToPrimitive("string:true")).toEqual("true");
      expect(typedStringToPrimitive("string:1")).toEqual("1");
      expect(typedStringToPrimitive("string:3.14159")).toEqual("3.14159");
    });

    test("works for boolean", () => {
      expect(typedStringToPrimitive("boolean:true")).toEqual(true);
      expect(typedStringToPrimitive("boolean:false")).toEqual(false);
    });

    test("works for null", () => {
      expect(typedStringToPrimitive("null:null")).toEqual(null);
    });

    test("works for undefined", () => {
      expect(typedStringToPrimitive("undefined:undefined")).toEqual(undefined);
    });
  });

  describe("saltData & unsaltData", () => {
    test("works for all types of values", () => {
      const salted = saltData(someObj);
      const unsalted = unsaltData(salted);
      expect(unsalted).toEqual(someObj);
    });
  });
});
