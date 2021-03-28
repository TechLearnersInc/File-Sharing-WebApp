/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();

const path = require('path');
const public = path.join(__dirname, '../public');

// GET Download Page
router.get('/', (req, res) => {
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
