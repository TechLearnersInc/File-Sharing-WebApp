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
const cookieSession = require('cookie-session');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:3000', 'http://192.168.1.70:8080', 'http://192.168.1.80:3000']
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

// Set up the cookie for the session
app.use(cookieSession({
    name: 'session',                               // name of the cookie
    secret: 'STEINS_GATE',                         // key to encode session
    maxAge: 24 * 60 * 60 * 1000,                   // cookie's lifespan
    sameSite: 'lax',                               // controls when cookies are sent
    path: '/',                                     // explicitly set this for security purposes
    secure: process.env.NODE_ENV === 'production', // cookie only sent on HTTPS
    httpOnly: true                                 // cookie is not available to JavaScript (client)
}));

// CsrfParam
const { CsrfParam: csrf } = require('./middleware/CsrfParam');
app.use(csrf);

// Static Path
const public = path.join(__dirname, './public');
app.use(express.static(public));

/**
 * Routes
 */

// Index Route
app.use('/', require('./routes/index'));

// Download Route
app.use('/file/:fileid', require('./routes/download'));

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
