import { JsonLdObj, RemoteDocument } from "jsonld/jsonld-spec";
import fetch, { Response } from "node-fetch";

type CallBack =  (err: Error, remoteDoc: RemoteDocument) => void

export class ContextLoader {
    
    preloadedContextUrls: string[] = [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
        "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
        "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
        "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
    ]

    contextMap: Map<string, RemoteDocument> = new Map();

    isCached: Promise<true>;

    constructor() {
        this.isCached = this.preLoad();
    }

    private async fetchContext (url: string): Promise<any> {
        const repsonse = await fetch(url, { headers: { accept: "application/json" } })
        return repsonse.json();
    }    

    private async preLoad(): Promise<true> {
        const promises: Promise<null>[] = this.preloadedContextUrls.map(async url => {
            const jsonLdObj: JsonLdObj = await this.fetchContext(url);
            const remoteDocument: RemoteDocument = {
                document: jsonLdObj, // this is the actual document that was loaded
                documentUrl: url,
            }
            this.contextMap.set(url, remoteDocument);
            return null;
        });
        // let all promises resolve or reject concurrently
        await Promise.allSettled(promises);
        // return true when all promises have completed, regardless of outcome
        return true;
    }

    async loadContext(url: string, callback?: CallBack): Promise<RemoteDocument> {
        // wait for caching to complete
        await this.isCached;

        if (this.contextMap.get(url) != null) {
            return this.contextMap.get(url) as RemoteDocument;
        }

        const jsonLdObj: JsonLdObj = await this.fetchContext(url);
            const remoteDocument: RemoteDocument = {
                contextUrl: undefined, 
                document: jsonLdObj, // this is the actual document that was loaded
                documentUrl: url,
            }
        this.contextMap.set(url, remoteDocument);
        return remoteDocument
    }

}