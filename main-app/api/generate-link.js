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
const { CsrfParamCheck } = require('../middleware/CsrfParam');
const { log } = require("debug");

// Link Generator
router.post('/', CsrfParamCheck, async (req, res) => {
    const config = {
        method: 'post',
        url: `${process.env.URL_SHORTENER_API}&action=create`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            "filename": req.body.fileName,
            "filesize": req.body.fileSize,
            "container": req.body.containerName,
            "expire": 86400, // 1 day has 86400 seconds
        })
    };
    await axios(config)
        .then(response => res.json(response.data))
        .catch((error) => {
            console.error(error);
            res.status(404).json({
                status: 'error',
            });
        });
});

module.exports = router;
