declare module "jsonld" {
  import { RemoteDocument, Url } from "jsonld/jsonld-spec";
  export * from "@types/jsonld";
  export namespace documentLoaders {
    let node: () => (url: Url) => Promise<RemoteDocument>;
    let xhr: () => (url: Url) => Promise<RemoteDocument>;
  }

  export type DocumentLoaders = "node" | "xhr";
}
