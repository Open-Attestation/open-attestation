import { flatten as flatley } from "flatley";
import { cloneDeep } from "lodash";

const hasPeriodInKey = key => {
  if (key.indexOf(".") >= 0) {
    throw new Error("Key names must not have . in them");
  }
  return false;
};

const filters = [{ test: hasPeriodInKey }];

/**
 * Calls external flatten library but ensures that global filters are always applied
 * @param {*} data
 * @param {*} options
 */
const flattenWithGlobalFilters = (data, options) => {
  const newOptions = cloneDeep(options) || {};
  if (newOptions.coercion) {
    newOptions.coercion.push(...filters);
  } else {
    newOptions.coercion = filters;
  }
  return flatley(data, newOptions);
};

export const flatten = flattenWithGlobalFilters;
