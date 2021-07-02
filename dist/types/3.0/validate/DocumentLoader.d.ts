import { RemoteDocument } from "jsonld/jsonld-spec";
export declare class ContextLoader {
    constructor();
    private fetchContext;
    private isRemoteDocument;
    private preLoad;
    loadContext(url: string): Promise<RemoteDocument>;
}
