export type LeafValue = string | number | boolean | null | Record<string, never> | [];

function _traverseAndFlatten<IterateeValue>(
  data: unknown,
  iteratee: (data: { value: LeafValue; path: string }) => IterateeValue,
  path = ""
): IterateeValue | IterateeValue[] {
  if (Array.isArray(data)) {
    // an empty array is considered a leaf node
    if (data.length === 0) return iteratee({ value: [], path });
    return data.flatMap((v, index) => _traverseAndFlatten(v, iteratee, `${path}[${index}]`));
  }

  if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data);
    // an empty object is considered a leaf node
    if (keys.length === 0) return iteratee({ value: {}, path });
    return Object.keys(data).flatMap((key) =>
      _traverseAndFlatten(data[key as keyof typeof data], iteratee, path ? `${path}.${key}` : key)
    );
  }

  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean" || data === null) {
    return iteratee({ value: data, path });
  }

  // our expected input is JSON so it should never have undefined
  throw new Error(`Unexpected data '${data}' in '${path}'`);
}

/** Given a record, returns a list of all leaf nodes of value that is not undefined */
export function traverseAndFlatten<IterateeValue>(
  data: Record<string, unknown>,
  iteratee: (data: { value: LeafValue; path: string }) => IterateeValue,
  path = ""
): IterateeValue[] {
  const results = _traverseAndFlatten(data, iteratee, path);
  return Array.isArray(results) ? results : [];
}
