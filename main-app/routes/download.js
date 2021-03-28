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
const path = require('path');

const getFileInfo = async (fileid) => {
    const config = {
        method: 'post',
        url: `${process.env.URL_SHORTENER_API}&action=get`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({ url_key: fileid }),
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
    // TODO: Download Page Creation
    res.render('download', {
        fileName: "Sword Art Online New Movie.mkv",
        fileSize: "1.5 GB",
        expireTime: "24 hours",
        downloadLink: "https://google.com",
        CsrfParam: req.csrfToken(),
    })
});

module.exports = router;
