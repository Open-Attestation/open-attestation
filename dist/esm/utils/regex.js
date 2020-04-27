import VerEx from "verbal-expressions";
var hexDigits = VerEx().range("0", "9", "a", "f", "A", "F");
var hexString = VerEx()
    .then("0x")
    .then(hexDigits)
    .oneOrMore();
export var isHexString = function (input) {
    var testRegex = VerEx()
        .startOfLine()
        .then(hexString)
        .endOfLine();
    return testRegex.test(input);
};
