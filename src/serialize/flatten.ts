import { flatten as flatleyFlatten, Coercion, FlatleyOptions } from "flatley";
import { cloneDeep } from "lodash";

const hasPeriodInKey = (key: string) => {
  if (key.indexOf(".") >= 0) {
    throw new Error("Key names must not have . in them");
  }
  return false;
};

const filters: Coercion[] = [{ test: hasPeriodInKey }];

/**
 * Calls external flatten library but ensures that global filters are always applied
 * @param data
 * @param options
 */
export const flatten = (data: any, options?: FlatleyOptions): any => {
  const newOptions: FlatleyOptions = options ? cloneDeep(options) : {};
  if (newOptions.coercion) {
    newOptions.coercion.push(...filters);
  } else {
    newOptions.coercion = filters;
  }
  return flatleyFlatten(data, newOptions);
};
