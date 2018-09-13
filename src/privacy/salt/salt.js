import { includes, mapValues, map } from "lodash";
import { isUUID } from "validator";
import uuid from "uuid/v4";

const UUIDV4_LENGTH = 37;
const identityFn = val => val;

const PRIMITIVE_TYPES = ["string", "number", "boolean", "undefined"];

/* eslint-disable no-use-before-define */
/**
 * Curried function that takes (iteratee)(value),
 * if value is a collection then recurse into it
 * otherwise apply `iteratee` on the primitive value
 * @param {Function} iteratee
 * @param {*} value
 */
const recursivelyApply = iteratee => value => {
  if (includes(PRIMITIVE_TYPES, typeof value) || value === null) {
    return iteratee(value);
  }
  return deepMap(value, iteratee);
};

/**
 * Applies `iteratee` to all fields in objects, goes into arrays as well.
 * Refer to test for example
 * @param {*} collection
 * @param {*} iteratee
 */
export function deepMap(collection, iteratee = identityFn) {
  if (collection instanceof Array) {
    return map(collection, recursivelyApply(iteratee));
  }
  if (typeof collection === "object") {
    return mapValues(collection, recursivelyApply(iteratee));
  }
  return collection;
}
/* eslint-enable no-use-before-define */
// disabling this because of mutual recursion

const startsWithUuidV4 = inputString => {
  if (inputString && typeof inputString === "string") {
    const elements = inputString.split(":");
    return isUUID(elements[0], 4);
  }
  return false;
};

/**
 * Detects the type of a value and returns a string with type annotation
 * @param {*} value A value with one of the Javascript primitive types, 'string' 'number' 'boolean' 'undefined'
 */
export function primitiveToTypedString(value) {
  switch (typeof value) {
    case "number":
    case "string":
    case "boolean":
    case "undefined":
      return `${typeof value}:${String(value)}`;
    default:
      if (value === null) {
        // typeof null is 'object' so we have to check for it
        return "null:null";
      }
      throw new Error(
        `Parsing error, value is not of primitive type: ${value}`
      );
  }
}

/**
 * Returns an appropriately typed value given a string with type annotations
 * @param {*} inputString A string with type annotations, e.g: "number:5"
 */
export function typedStringToPrimitive(inputString) {
  const [type, ...valueArray] = inputString.split(":");
  const value = valueArray.join(":"); // just in case there are colons in the value

  switch (type) {
    case "number":
      return Number(value);
    case "string":
      return String(value);
    case "boolean":
      return value === "true";
    case "null":
      return null;
    case "undefined":
      return undefined;
    default:
      throw new Error(
        `Parsing error, type annotation not found in string: ${inputString}`
      );
  }
}

/**
 * Returns a salted value using a randomly generated uuidv4 string for salt
 * @param {*} value
 */
export function uuidSalt(value) {
  const salt = uuid();
  return `${salt}:${primitiveToTypedString(value)}`;
}

/**
 * Returns an appropriately typed value when given a salted string with type annotation
 * @param {*} value salted string in the format "salt:type:value", example: "ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5"
 */
export function unsalt(value) {
  if (startsWithUuidV4(value)) {
    const untypedValue = value.substring(UUIDV4_LENGTH).trim();
    return typedStringToPrimitive(untypedValue);
  }
  return value;
}

// Use uuid salting method to recursively salt data
export const saltData = data => deepMap(data, uuidSalt);
export const unsaltData = data => deepMap(data, unsalt);
