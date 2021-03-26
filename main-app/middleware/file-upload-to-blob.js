/**
 * Environment Variable.
 */

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

/**
 * Module dependencies.
 */

const {
    BlobServiceClient,
} = require('@azure/storage-blob');
const path = require('path');
const fs = require('fs');
const tmpPath = path.join(__dirname, '../tmp');

const blob = (req, res, next) => {
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient("demo");

    // Create a unique name for the blob
    const blobName = req.file.filename;

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log('\nUploading to Azure storage as blob:\n\t', blobName);

    // Upload data to the blob
    // const uploadBlobResponse = blockBlobClient.uploadFile(req.file.path, {
    //     maxSingleShotSize: 1 * 1024 * 1024,
    //     onProgress: (progress) => {
    //         // find the percentage of uploaded
    //         let percent = Math.round((100 * progress.loadedBytes) / req.file.size);
    //         console.log(percent)
    //         if (progress.loadedBytes === req.file.size) {
    //             console.log("Finished")
    //             next()
    //         }
    //     },
    // });
    // console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
    try {
        blockBlobClient.uploadFile(req.file.path, {
            blockSize: 4 * 1024 * 1024, // 4MB block size
            concurrency: 1, // 20 concurrency
            onProgress: (progress) => {
                // find the percentage of uploaded
                let percent = Math.round((100 * progress.loadedBytes) / req.file.size);
                console.log(percent)
                if (progress.loadedBytes === req.file.size) {
                    console.log("Finished")
                    next()
                }
            },
        });
        console.log("uploadFile succeeds");
    } catch (err) {
        console.log(
            `uploadFile failed, requestId - ${err.details.requestId}, statusCode - ${err.statusCode}, errorCode - ${err.details.errorCode}`
        );
    }

}

module.exports = blob;
