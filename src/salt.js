const { includes, mapValues, map } = require("lodash");
const uuid = require('uuid/v4')

const identityFn = val => val

/**
 * Applies `iteratee` to all fields in objects, goes into arrays as well.
 * Refer to test for example
 * @param {*} collection 
 * @param {*} iteratee 
 */
function deepMap(collection, iteratee = identityFn) {
  if (collection instanceof Array) {
    return map(collection, recursivelyApply(iteratee));
  } else if (typeof collection === "object") {
    return mapValues(collection, recursivelyApply(iteratee));
  }
}

const PRIMITIVE_TYPES = [ 'string', 'number', 'boolean' ]

/**
 * Curried function that takes (iteratee)(value), 
 * if value is a collection then recurse into it
 * otherwise apply `iteratee` on the primitive value
 * @param {Function} iteratee
 * @param {*} value
 */
const recursivelyApply = (iteratee) => (value) => {
    if (includes(PRIMITIVE_TYPES, typeof value)) {
        return iteratee(value);
    } else {
        return deepMap(value, iteratee);
    }
}

/**
 * Returns the salted value, 
 * salt is a hexadecimal string that is 2 * saltLength
 * @param {*} value 
 * @param {*} saltLength 
 */
function uuidSalt(value) {
  const salt = uuid() 
  return `${salt}: ${String(value)}`;
}

function startsWithUuidV4(value) {
    const UuidV4Regex = /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}[:].*/
    return UuidV4Regex.test(value);
}

/**
 * Removes salt from the given string and applies JSON.parse() to it
 * @param {*} value 
 * @param {*} saltLength 
 */
function unsalt(value) {
    if (startsWithUuidV4(value)) {
        untypedValue = value.substring(37).trim()
        return coerceStringToPrimitve(untypedValue) 
    }
    return value
}

function coerceStringToPrimitve(value) {
    if (isBoolean(value) || isNumber(value)) { return JSON.parse(value) }
    else return value
}

function isBoolean(value) {
    return (value === "true" || value === "false")
}

function isNumber(value) {
    return !isNaN(Number(value)) && isFinite(Number(value))
}

module.exports = {
  deepMap,
  uuidSalt,
  unsalt
};
