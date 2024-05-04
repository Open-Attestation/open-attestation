import { unsaltData } from "./salt";
import { OpenAttestationDocument, WrappedDocument } from "./types";

type Extract<P> = P extends WrappedDocument<infer T> ? T : never;
export const getData = <T extends WrappedDocument<OpenAttestationDocument>>(document: T): Extract<T> => {
  return unsaltData(document.data);
};
