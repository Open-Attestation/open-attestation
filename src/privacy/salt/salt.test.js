const {
  deepMap,
  uuidSalt,
  unsalt,
  primitiveToTypedString,
  typedStringToPrimitive,
  saltData,
  unsaltData
} = require("./salt");

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
        arrayObject1KeyK: null
      },
      {
        arrayObject2KeyA: {
          arrayObject2NestedObjectA: "array object nested object value 1",
          arrayObject2NestedObjectB: 5,
          arrayObject2NestedObjectC: true
        }
      }
    ],
    nestedKeyC: {
      doubleNestedKeyA: "value 5"
    }
  }
};

describe("salt", () => {
  describe("uuidSalt", () => {
    it("salts and add type to primitives", () => {
      const saltedString = uuidSalt("test string");
      const uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/;
      expect(saltedString.length).to.equal(55);
      expect(saltedString.substring(36, 37)).to.be.equal(":");
      expect(uuidRegex.test(saltedString.split(":")[0])).to.be.true;
      expect(saltedString.substring(37)).to.be.equal("string:test string");
    });
  });

  describe("deepMap", () => {
    const fakeSalt = value => `fakesalt: ${String(value)}`;

    const fakeSaltedObject = {
      keyA: "fakesalt: value 1",
      keyB: {
        nestedKeyA: "fakesalt: nested value 1",
        nestedKeyBwithArray: [
          {
            arrayObject1KeyA: "fakesalt: array object value 1",
            arrayObject1KeyB: "fakesalt: 3",
            arrayObject1KeyC: "fakesalt: false",
            arrayObject1KeyD:
              "fakesalt: 0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce",
            arrayObject1KeyE: "fakesalt: 3.14159",
            arrayObject1KeyF: "fakesalt: true",
            arrayObject1KeyG: "fakesalt: false",
            arrayObject1KeyH: "fakesalt: undefined",
            arrayObject1KeyI: "fakesalt: null",
            arrayObject1KeyJ: "fakesalt: undefined",
            arrayObject1KeyK: "fakesalt: null"
          },
          {
            arrayObject2KeyA: {
              arrayObject2NestedObjectA:
                "fakesalt: array object nested object value 1",
              arrayObject2NestedObjectB: "fakesalt: 5",
              arrayObject2NestedObjectC: "fakesalt: true"
            }
          }
        ],
        nestedKeyC: { doubleNestedKeyA: "fakesalt: value 5" }
      }
    };

    it("traverses copys if no function is supplied", () => {
      expect(deepMap(someObj)).to.deep.eql(someObj);
    });

    it("should apply function recursively", () => {
      expect(deepMap(someObj, fakeSalt)).to.deep.eql(fakeSaltedObject);
    });
  });

  describe("unsalt", () => {
    it("should unsalt numbers", () => {
      expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5")).to.equal(
        5
      );
      expect(
        unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:number:51234")
      ).to.equal(51234);
      expect(
        unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:number:51234.54321")
      ).to.equal(51234.54321);
    });
    it("should unsalt booleans", () => {
      expect(
        unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:boolean:true")
      ).to.equal(true);
      expect(
        unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:boolean:false")
      ).to.equal(false);
    });
    it("should unsalt strings", () => {
      expect(
        unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:string:abcd")
      ).to.equal("abcd");
    });
    it("should unsalt numbers in string format", () => {
      expect(
        unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874:string:1234")
      ).to.equal("1234");
    });
  });

  describe("primitiveToTypedString", () => {
    it("works for number", () => {
      expect(primitiveToTypedString(12)).to.eql("number:12");
      expect(primitiveToTypedString(3.14159)).to.eql("number:3.14159");
    });

    it("works for string", () => {
      expect(primitiveToTypedString("test")).to.eql("string:test");
      expect(primitiveToTypedString("true")).to.eql("string:true");
      expect(primitiveToTypedString("1")).to.eql("string:1");
      expect(primitiveToTypedString("3.14159")).to.eql("string:3.14159");
    });

    it("works for boolean", () => {
      expect(primitiveToTypedString(true)).to.eql("boolean:true");
      expect(primitiveToTypedString(false)).to.eql("boolean:false");
    });

    it("works for null", () => {
      expect(primitiveToTypedString(null)).to.eql("null:null");
    });

    it("works for undefined", () => {
      expect(primitiveToTypedString(undefined)).to.eql("undefined:undefined");
    });
  });

  describe("typedStringToPrimitive", () => {
    it("works for number", () => {
      expect(typedStringToPrimitive("number:12")).to.eql(12);
      expect(typedStringToPrimitive("number:3.14159")).to.eql(3.14159);
    });

    it("works for string", () => {
      expect(typedStringToPrimitive("string:test")).to.eql("test");
      expect(typedStringToPrimitive("string:true")).to.eql("true");
      expect(typedStringToPrimitive("string:1")).to.eql("1");
      expect(typedStringToPrimitive("string:3.14159")).to.eql("3.14159");
    });

    it("works for boolean", () => {
      expect(typedStringToPrimitive("boolean:true")).to.eql(true);
      expect(typedStringToPrimitive("boolean:false")).to.eql(false);
    });

    it("works for null", () => {
      expect(typedStringToPrimitive("null:null")).to.eql(null);
    });

    it("works for undefined", () => {
      expect(typedStringToPrimitive("undefined:undefined")).to.eql(undefined);
    });
  });

  describe("saltData & unsaltData", () => {
    it("works for all types of values", () => {
      const salted = saltData(someObj);
      const unsalted = unsaltData(salted);
      expect(unsalted).to.eql(someObj);
    });
  });
});
