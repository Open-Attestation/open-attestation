export type LeafValue = string | number | boolean | null | Record<string, never> | [];

// we use a symbol just in case of conflicts with what the iteratee returns
const undefinedSym = Symbol("undefined value that should be filtered away");

function _traverseAndFlatten<IterateeValue>(
  data: unknown,
  iteratee: (data: { value: LeafValue; path: string }) => IterateeValue,
  path = "",
  isRemoveUndefinedLeafNodes = false
): IterateeValue | IterateeValue[] {
  if (Array.isArray(data)) {
    // an empty array is considered a leaf node
    if (data.length === 0) return iteratee({ value: [], path });

    // dont use flat map as it skips empty items in the array
    const results: IterateeValue[] = [];
    for (let index = 0; index < data.length; index++) {
      const value = data[index];
      const result = _traverseAndFlatten(value, iteratee, `${path}[${index}]`, isRemoveUndefinedLeafNodes);
      if (Array.isArray(result)) {
        results.push(...result);
      } else {
        results.push(result);
      }
    }

    return results;
  }

  if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data);
    // an empty object is considered a leaf node
    if (keys.length === 0) return iteratee({ value: {}, path });
    return Object.keys(data).flatMap((key) =>
      _traverseAndFlatten(
        data[key as keyof typeof data],
        iteratee,
        path ? `${path}.${key}` : key,
        isRemoveUndefinedLeafNodes
      )
    );
  }

  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean" || data === null) {
    return iteratee({ value: data, path });
  }

  if (data === undefined && isRemoveUndefinedLeafNodes) {
    // mark undefined leaf node with a unique symbol that must be removed later
    return undefinedSym as IterateeValue;
  }

  throw new Error(`Unexpected data '${data}' in '${path}'`);
}

/** Given a record, returns a list of all leaf nodes of value that is not undefined */
export function traverseAndFlatten<IterateeValue>(
  data: Record<string, unknown>,
  iteratee: (data: { value: LeafValue; path: string }) => IterateeValue,
  path = "",
  /** by default throw when there are leaf nodes that are undefined, setting this to true will remove them instead */
  isRemoveUndefinedLeafNodes = false
): IterateeValue[] {
  const results = _traverseAndFlatten(data, iteratee, path, isRemoveUndefinedLeafNodes);
  // remove undefined leaf nodes
  return Array.isArray(results) ? results.filter((v) => v !== undefinedSym) : [];
}
