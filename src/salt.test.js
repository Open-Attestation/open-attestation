const { deepMap, uuidSalt, unsalt } = require("./salt");
const util = require('util')
const someObj = {
  keyA: "value 1",
  keyB: {
    nestedKeyA: "nested value 1",
    nestedKeyBwithArray: [
      {
        arrayObject1KeyA: "array object value 1",
        arrayObject1KeyB: 3,
        arrayObject1KeyC: false
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
describe("object traversal", () => {
  it("it should traverse an object tree and copy it if no function is supplied", () => {
    expect(deepMap(someObj)).to.deep.eql(someObj);
  });
});

describe("salting", () => {
  it("should salt", () => {
    const saltedString = uuidSalt("test string");
    const uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/
    expect(saltedString.length).to.equal(49)
    expect(saltedString.substring(36,37)).to.be.equal(":")
    expect(uuidRegex.test(saltedString.split(":")[0])).to.be.true;
  });
});

describe("salt object recursively", () => {
  const fakeSalt = value => {
    return "fakesalt: " + String(value);
  };

  const fakeSaltedObject = {
    keyA: "fakesalt: value 1",
    keyB: {
      nestedKeyA: "fakesalt: nested value 1",
      nestedKeyBwithArray: [
        {
          arrayObject1KeyA: "fakesalt: array object value 1",
          arrayObject1KeyB: "fakesalt: 3",
          arrayObject1KeyC: "fakesalt: false"
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

  it("should salt object recursively", () => {
    expect(deepMap(someObj, fakeSalt)).to.deep.eql(fakeSaltedObject);
  });

  it("should unsalt object recursively", () => {
      const saltedObj = deepMap(someObj, uuidSalt)
      const unsaltedObj = deepMap(saltedObj, unsalt)
      expect(unsaltedObj).to.deep.equal(someObj)
  })
});


describe("unsalt value", () => {
    it("should unsalt numbers", () => {
        expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874: 5")).to.equal(5)
        expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874: 51234")).to.equal(51234)
        expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874: 51234.54321")).to.equal(51234.54321)
    })
    it("should unsalt booleans", () => {
        expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874: true")).to.equal(true)
        expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874: false")).to.equal(false)
    })
    it("should unsalt strings", () => {
        expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874: abcd")).to.equal("abcd")
    })
    it("should unsalt strings with numbers in it", () => { 
        expect(unsalt("ee7f3323-1634-4dea-8c12-f0bb83aff874: abcd")).to.equal("abcd")
    })
})
