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

const fileUploadSave = require('../middleware/file-upload-save');
const fileUploadBlob = require('../middleware/file-upload-to-blob');
const fileDelete = require('../middleware/file-delete');


// POST Upload
router.post('/', fileUploadSave.single('myfile'), fileUploadBlob, (req, res) => {

    if (!req.file) {
        return response = res.status(500).send({
            error: 'All fields are required'
        });

    }

    return res.json({
        name: req.file.filename,
        origname: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        status: 'successful',
        file: 'Test URL'
    })
});

module.exports = router;
