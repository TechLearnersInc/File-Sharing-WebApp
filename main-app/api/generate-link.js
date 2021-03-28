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

// Axios Config
let config = {
    method: 'post',
    url: `${process.env.URL_SHORTENER_API}&action=create`,
    headers: {
        'Content-Type': 'application/json',
    },
    data: null,
};

// Link Generator
router.post('/', async (req, res) => {
    config.data = JSON.stringify({
        "filename": req.body.fileName,
        "filesize": req.body.fileSize,
        "container": req.body.containerName,
        "expire": 86400, // 1 day has 86400 seconds
    })
    await axios(config)
        .then(response => res.json({
            shorturl: `${process.env.APP_BASE_URL}file/${response.data.url}`,
        }))
        .catch((error) => {
            console.error(error);
            res.status(404).json({
                status: 'error',
            });
        });
});

module.exports = router;
