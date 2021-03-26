/**
 * Environment Variable.
 */

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

/**
 * Module dependencies.
 */

const filesystem = require('fs');
const path = require('path');
const tmpPath = path.join(__dirname, '../tmp');

const fileDelete = (req, res, next) => {
    filesystem.unlink(req.file.path, (err) => {
        if (err) {
            throw err;
        } else {
            console.log(`Deleted: ${req.file.filename}`);
            next();
        }
    })
}

module.exports = fileDelete;
