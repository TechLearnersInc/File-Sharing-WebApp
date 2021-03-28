/**
 * Module dependencies.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const public = path.join(__dirname, '../public');

// GET Index Page
router.get('/', (req, res) => {
    res.render('index', {
        CsrfParam: req.csrfToken(),
    })
});

module.exports = router;
