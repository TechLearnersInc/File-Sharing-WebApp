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
permissions.read = true;
permissions.write = false;
permissions.delete = false;
permissions.list = false;
permissions.add = false;
permissions.create = false;
permissions.update = false;
permissions.process = false;

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
    const container = encodeURI(req.body.container);
    const filename = encodeURI(req.body.filename);
    const sas = `?${SAS_Token().toString()}`;
    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            success: true,
            url: `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${container}/${filename}${sas}`,
        },
    };
}
