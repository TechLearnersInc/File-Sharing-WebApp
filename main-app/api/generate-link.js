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
router.post('/', CsrfParamCheck, (req, res) => {
    console.log(req.body.fileName);
    console.log(req.body.containerName);
    return res.json({
        shorturl: 'Hello World',
    });
});

module.exports = router;
