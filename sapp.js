/**
 * Created by admin on 2015/12/1.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sapp = express();
var chktoken = require('./routes/sdk/platform/login/chklogin.js');
var callback = require('./routes/sdk/platform/recharge/callBack.js');
var docharge = require('./routes/sdk/platform/recharge/docharge.js');
// view engine setup
sapp.set('views', path.join(__dirname, 'views'));
sapp.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//sapp.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
sapp.use(logger('dev'));
sapp.use(bodyParser.json());
sapp.use(bodyParser.urlencoded({ extended: false }));
sapp.use(cookieParser());
sapp.use(express.static(path.join(__dirname, 'public')));



sapp.use('/cklogin',chktoken);
sapp.use('/callback',callback);
sapp.use('/dochare',docharge);

// catch 404 and forward to error handler
sapp.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (sapp.get('env') === 'development') {
    sapp.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
sapp.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = sapp;
