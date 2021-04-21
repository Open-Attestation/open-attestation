import {
  __unsafe__use__it__at__your__own__risks__wrapDocuments,
  __unsafe__use__it__at__your__own__risks__wrapDocument,
} from "../src/index";
import credentialDocumentStore from "../src/3.0/schema/sample-credential-document-store.json";
import credentialDid from "../src/3.0/schema/sample-credential-did.json";
import { writeFileSync } from "fs";

// This script rewraps the verifiable credentials in v3

const run = async () => {
  const individual = await __unsafe__use__it__at__your__own__risks__wrapDocument(credentialDocumentStore as any);
  writeFileSync("./src/3.0/schema/sample-verifiable-credential.json", JSON.stringify(individual, null, 2));

  const [batched1, batched2] = await __unsafe__use__it__at__your__own__risks__wrapDocuments([
    credentialDocumentStore,
    credentialDocumentStore,
  ] as any);
  writeFileSync("./src/3.0/schema/batched-verifiable-credential-1.json", JSON.stringify(batched1, null, 2));
  writeFileSync("./src/3.0/schema/batched-verifiable-credential-2.json", JSON.stringify(batched2, null, 2));

  const did = await __unsafe__use__it__at__your__own__risks__wrapDocument(credentialDid as any);
  writeFileSync("./src/3.0/schema/sample-verifiable-credential-did.json", JSON.stringify(did, null, 2));
};

run();
