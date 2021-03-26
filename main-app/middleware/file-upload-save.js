/**
 * Environment Variable.
 */

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

/**
 * Module dependencies.
 */

const multer = require('multer');
const path = require('path');
const tmpPath = path.join(__dirname, '../tmp');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, tmpPath),
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
            cb(null, uniqueName)
        },
    }),
    limits: {
        fileSize: 1000000 * process.env.UPLOAD_LIMIT_IN_MB
    }
});

module.exports = upload;
