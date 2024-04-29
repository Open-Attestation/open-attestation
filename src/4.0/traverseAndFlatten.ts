import { Options } from "@govtechsg/jsonld";

type LeafValue = string | number | boolean | null;
interface Options<IterateeValue> {
  /* function to run on every field */
  iteratee: (data: { value: LeafValue; path: string }) => IterateeValue;
  /* root path of the property being acceded */
  path?: string;
}

/** Given a record | list, returns a list of all leaf nodes of value that is not undefined */
export function traverseAndFlatten<IterateeValue>(data: LeafValue, options: Options<IterateeValue>): IterateeValue;
export function traverseAndFlatten<IterateeValue>(data: unknown, options: Options<IterateeValue>): IterateeValue[];
export function traverseAndFlatten<IterateeValue>(
  data: unknown,
  { iteratee, path = "" }: Options<IterateeValue>
): IterateeValue | IterateeValue[] {
  if (Array.isArray(data)) {
    return data.flatMap((v, index) => traverseAndFlatten(v, { iteratee, path: `${path}[${index}]` }));
  }

  if (typeof data === "object" && data !== null) {
    return Object.keys(data).flatMap((key) =>
      traverseAndFlatten(data[key as keyof typeof data], { iteratee, path: path ? `${path}.${key}` : key })
    );
  }

  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean" || data === null) {
    return iteratee({ value: data, path });
  }

  throw new Error(`Unexpected data '${data}' in '${path}'`);
}
