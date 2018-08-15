import { includes, mapValues, map } from "lodash";
import { isNumeric, isBoolean, isUUID } from "validator";
import uuid from "uuid/v4";
import { isHexString } from "../../utils";

const identityFn = val => val;

const PRIMITIVE_TYPES = ["string", "number", "boolean"];

/* eslint-disable no-use-before-define */
/**
 * Curried function that takes (iteratee)(value),
 * if value is a collection then recurse into it
 * otherwise apply `iteratee` on the primitive value
 * @param {Function} iteratee
 * @param {*} value
 */
const recursivelyApply = iteratee => value => {
  if (includes(PRIMITIVE_TYPES, typeof value)) {
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

/**
 * Returns the salted value,
 * salt is a hexadecimal string that is 2 * saltLength
 * @param {*} value
 * @param {*} saltLength
 */
export function uuidSalt(value) {
  const salt = uuid();
  return `${salt}:${String(value)}`;
}

const startsWithUuidV4 = inputString => {
  const elements = inputString.split(":");
  return isUUID(elements[0], 4);
};

function coerceStringToPrimitve(value) {
  if (isHexString(value) || !(isBoolean(value) || isNumeric(value))) {
    return value;
  }
  return JSON.parse(value);
}

/**
 * Removes salt from the given string and applies JSON.parse() to it
 * @param {*} value
 * @param {*} saltLength
 */
export function unsalt(value) {
  if (startsWithUuidV4(value)) {
    const untypedValue = value.substring(37).trim();
    return coerceStringToPrimitve(untypedValue);
  }
  return value;
}

// Use uuid salting method to recursively salt data
export const saltData = data => deepMap(data, uuidSalt);
export const unsaltData = data => deepMap(data, unsalt);
