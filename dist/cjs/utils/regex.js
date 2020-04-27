"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var verbal_expressions_1 = __importDefault(require("verbal-expressions"));
var hexDigits = verbal_expressions_1.default().range("0", "9", "a", "f", "A", "F");
var hexString = verbal_expressions_1.default()
    .then("0x")
    .then(hexDigits)
    .oneOrMore();
exports.isHexString = function (input) {
    var testRegex = verbal_expressions_1.default()
        .startOfLine()
        .then(hexString)
        .endOfLine();
    return testRegex.test(input);
};
