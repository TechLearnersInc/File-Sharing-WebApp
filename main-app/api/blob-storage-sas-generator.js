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
router.post('/', CsrfParamCheck, (req, res) => {
    const SAS = async () => {
        try {
            const response = await axios.get(process.env.BLOB_STORAGE_SAS_GENERATOR_API);
            return res.json(response.data);
        } catch (error) {
            console.error(error);
            return res.status(404).json({
                status: 'Try again later'
            });
        }
    }
    if (req.body.container_name === undefined) SAS();
    else res.json({ container: process.env.CONTAINER_NAME });
});

module.exports = router;
