const AZURE_STORAGE_ACCOUNT = process.env["AZURE_STORAGE_ACCOUNT"];
const AZURE_STORAGE_ACCESS_KEY = process.env["AZURE_STORAGE_ACCESS_KEY"];

const {
    StorageSharedKeyCredential,
    generateAccountSASQueryParameters,
    AccountSASPermissions,
    SASProtocol,
} = require("@azure/storage-blob");

const sharedKeyCredential = new StorageSharedKeyCredential(
    AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY
);

const permissions = new AccountSASPermissions();
permissions.read = false;
permissions.write = true;
permissions.delete = false;
permissions.list = false;
permissions.add = true;
permissions.create = true;
permissions.update = false;
permissions.process = true;

const SAS_Token = () => generateAccountSASQueryParameters({
    // startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 86400), // 24 Hours
    services: "b", // Blob Only
    permissions: permissions,
    resourceTypes: "co", // Container, Object
    // ipRange: {
    //     start: "0.0.0.0",
    //     end: "255.255.255.255",
    // },
    protocol: SASProtocol.Https, // Always HTTPS
    // version: '2020-02-10', // Optional
}, sharedKeyCredential);

module.exports = async (context, req) => {
    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            name: AZURE_STORAGE_ACCOUNT,
            token: `?${SAS_Token().toString()}`,
        },
    };
}
