/**
 * Environment Variable.
 */

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

/**
 * Module dependencies.
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: ['http://192.168.1.80:3000', 'https://share.techlearners.xyz']
};

app.use(cors(corsOptions));

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Csrf Token
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Static Path
const public = path.join(__dirname, './public');
app.use(express.static(public));

// Ignore Favicon
app.use((req, res, next) => {
    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico')
        return res.sendStatus(204);
    else return next();
});

/**
 * Routes
 */

// Index Route
app.use('/', require('./routes/index'));

// Download Route
app.use('/file', require('./routes/download'));

// File Upload API
// app.use('/api/upload', require('./api/upload'));

// Blob Storage SAS Generator
app.use('/api/sas', require('./api/blob-storage-sas-generator'));

// Generate Link
app.use('/api/generate', require('./api/generate-link'));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
