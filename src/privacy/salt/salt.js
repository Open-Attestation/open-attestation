import { includes, mapValues, map } from "lodash";
import { isUUID } from "validator";
import uuid from "uuid/v4";

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

export function primitiveToTypedString(value) {
  switch (typeof value) {
    case "number":
      return `number:${String(value)}`;
    case "string":
      return `string:${String(value)}`;
    case "boolean":
      return `boolean:${String(value)}`;
    default:
      return value === null ? "null:null" : "undefined:undefined";
  }
}

export function typedStringToPrimitive(str) {
  const firstColonIndex = str.indexOf(":");
  const type = str.substring(0, firstColonIndex);
  const value = str.substring(firstColonIndex + 1);

  switch (type) {
    case "number":
      return Number(value);
    case "string":
      return value;
    case "boolean":
      return value === "true";
    case "null":
      return null;
    default:
      return undefined;
  }
}

/**
 * Returns the salted value,
 * salt is a hexadecimal string that is 2 * saltLength
 * @param {*} value
 * @param {*} saltLength
 */
export function uuidSalt(value) {
  const salt = uuid();
  return `${salt}:${primitiveToTypedString(value)}`;
}

/**
 * Removes salt from the given string and applies JSON.parse() to it
 * @param {*} value
 * @param {*} saltLength
 */
export function unsalt(value) {
  if (startsWithUuidV4(value)) {
    const untypedValue = value.substring(37).trim();
    return typedStringToPrimitive(untypedValue);
  }
  return value;
}

// Use uuid salting method to recursively salt data
export const saltData = data => deepMap(data, uuidSalt);
export const unsaltData = data => deepMap(data, unsalt);
