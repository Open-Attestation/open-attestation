import { Options } from "@govtechsg/jsonld";

interface Options<T> {
  /* function to run on every field */
  iteratee: (data: { value: any; path: string }) => T;
  /* root path of the property being acceded */
  path?: string;
}

/**
 * @deprecated will be removed in the next major release in favour of OpenAttestation v4.0 (more info: https://github.com/Open-Attestation/open-attestation/tree/beta)
 */
export function traverseAndFlatten<T>(data: any[], options: Options<T>): T[];
export function traverseAndFlatten<T>(data: string | number | boolean | null, options: Options<T>): T;
export function traverseAndFlatten<T>(data: any, options: Options<T>): T[]; // hmmmm this is probably wrong but it works for the moment :)
export function traverseAndFlatten<T>(data: any, { iteratee, path = "" }: Options<T>): any {
  if (Array.isArray(data)) {
    return data.flatMap((v, index) => traverseAndFlatten(v, { iteratee, path: `${path}[${index}]` }));
  }
  // Since null datas are allowed but typeof null === "object", the "&& data" is used to skip this
  if (typeof data === "object" && data) {
    return Object.keys(data).flatMap((key) =>
      traverseAndFlatten(data[key], { iteratee, path: path ? `${path}.${key}` : key })
    );
  }
  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean" || data === null) {
    return iteratee({ value: data, path });
  }
  throw new Error(`Unexpected data '${data}' in '${path}'`);
}
