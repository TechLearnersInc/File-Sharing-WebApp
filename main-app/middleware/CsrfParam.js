/**
 * Environment Variable.
 */

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

/**
 * Module dependencies.
 */

const { randomBytes } = require('crypto');

// CSRF Token
const CsrfParam = (req, res, next) => {
    if (req.session.CsrfParam === undefined) {
        req.session.CsrfParam = randomBytes(100).toString('base64');
    }
    next();
}

// CSRF Token Check
const CsrfParamCheck = (req, res, next) => {
    if (req.header('X-CSRF-TOKEN') === req.session.CsrfParam) {
        next();
    }
    else
        return res.status(401).send('401 Unauthorized');
}

module.exports = { CsrfParam, CsrfParamCheck };
