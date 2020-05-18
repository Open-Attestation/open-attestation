import { includes, mapValues, map, identity } from "lodash";
import { isUUID } from "validator";
import { v4 as uuid } from "uuid";

const UUIDV4_LENGTH = 37;
const PRIMITIVE_TYPES = ["string", "number", "boolean", "undefined"];

/* eslint-disable no-use-before-define */
/**
 * Curried function that takes (iteratee)(value),
 * if value is a collection then recurse into it
 * otherwise apply `iteratee` on the primitive value
 */
const recursivelyApply = (iteratee: (arg: any) => any) => (value: any) => {
  if (includes(PRIMITIVE_TYPES, typeof value) || value === null) {
    return iteratee(value);
  }
  return deepMap(value, iteratee); // eslint-disable-line @typescript-eslint/no-use-before-define
};

/**
 * Applies `iteratee` to all fields in objects, goes into arrays as well.
 * Refer to test for example
 */
export const deepMap = (collection: any, iteratee: (arg: any) => any = identity): any => {
  if (collection instanceof Array) {
    return map(collection, recursivelyApply(iteratee));
  }
  if (typeof collection === "object") {
    return mapValues(collection, recursivelyApply(iteratee));
  }
  return collection;
};
/* eslint-enable no-use-before-define */
// disabling this because of mutual recursion

const startsWithUuidV4 = (input: any) => {
  if (input && typeof input === "string") {
    const elements = input.split(":");
    return isUUID(elements[0], 4);
  }
  return false;
};

/**
 * Detects the type of a value and returns a string with type annotation
 */
export function primitiveToTypedString(value: any) {
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
      throw new Error(`Parsing error, value is not of primitive type: ${value}`);
  }
}

/**
 * Returns an appropriately typed value given a string with type annotations, e.g: "number:5"
 */
export function typedStringToPrimitive(input: string) {
  const [type, ...valueArray] = input.split(":");
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
      throw new Error(`Parsing error, type annotation not found in string: ${input}`);
  }
}

/**
 * Returns a salted value using a randomly generated uuidv4 string for salt
 */
export function uuidSalt(value: string) {
  const salt = uuid();
  return `${salt}:${primitiveToTypedString(value)}`;
}

/**
 * Value salted string in the format "salt:type:value", example: "ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5"
 * Returns an appropriately typed value when given a salted string with type annotation
 */
export function unsalt(value: string) {
  if (startsWithUuidV4(value)) {
    const untypedValue = value.substring(UUIDV4_LENGTH).trim();
    return typedStringToPrimitive(untypedValue);
  }
  return value;
}

// Use uuid salting method to recursively salt data
export const saltData = (data: any) => deepMap(data, uuidSalt);
export const unsaltData = (data: any) => deepMap(data, unsalt);
