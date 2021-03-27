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

// Blob Storage SAS Get from Azure Func and Response
router.post('/', CsrfParamCheck, async (req, res) => {
    const config = {
        method: 'get',
        url: process.env.BLOB_STORAGE_SAS_GENERATOR_API,
    };
    if (req.body.container_name === undefined)
        await axios(config)
            .then(response => res.json(response.data))
            .catch((error) => {
                console.error(error);
                return res.status(404).json({
                    status: 'Try again later'
                });
            });
    else res.json({ container: process.env.CONTAINER_NAME });
});

module.exports = router;
