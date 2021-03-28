/**
 * Environment Variable.
 */

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');

const getFileInfo = async (fileid) => {
    const config = {
        method: 'post',
        url: `${process.env.URL_SHORTENER_API}&action=get`,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ url_key: fileid }),
    };
    return await axios(config)
        .then(response => response.data)
        .catch((error) => {
            console.error(error);
            return { success: false };
        });
};

const getDownloadURL = async ({ filename, container }) => {
    const config = {
        method: 'post',
        url: process.env.BLOB_STORAGE_DOWNLOAD_URL_API,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ filename, container }),
    };
    return await axios(config)
        .then(response => response.data)
        .catch((error) => {
            console.error(error);
            return { success: false };
        });
};

// GET Download Page
router.get('/:fileid', async (req, res) => {
    const FileInfo = await getFileInfo(req.params.fileid.toString());
    if (!FileInfo.success) res.sendStatus(404);

    const downloadURL = await getDownloadURL({
        filename: FileInfo.filename,
        container: FileInfo.container,
    });
    if (!downloadURL.success) res.sendStatus(404);

    res.render('download', {
        fileName: FileInfo.filename,
        fileSize: `${(FileInfo.filesize / Math.pow(10, 6)).toFixed(2)} MB`,
        expireTime: "24 hours",
        downloadLink: downloadURL.url,
        CsrfParam: req.csrfToken(),
    })
});

module.exports = router;
