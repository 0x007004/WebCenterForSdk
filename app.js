"use strict";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var app = express();
var mysql = require('./tools/MysqlCon');

var redis = require("redis");
var redisclient = redis.createClient(6379, '192.168.2.91');
//this routers
var users = require('./routes/inside/users')(passport);
var login = require('./routes/inside/LoginPage')(passport,redisclient);
var routes = require('./routes/inside/index');
var notices = require('./routes/inside/notice')(passport);
var inchklogin = require('./routes/sdk/platform/login/inchklogin');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//the website ico
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new Strategy(
    function (username,passwd,cb)
    {
        var s = "select c_uname as name from login where c_uname="+ mysql.escape(username) + "and c_pwd=MD5("+mysql.escape(passwd)+")";
        console.log(s);
        mysql.query(s,function(err,ds){
            if(err){return cb(err);}
            console.log(ds);
            if(ds.length !=0 && ds.length ===1) {
                return cb(null,ds[0]["name"]);
            }
            else{
                cb(null,false);
            }
        });
    }
));
passport.serializeUser(function(num,cb) {cb(null,num);});
passport.deserializeUser(function(num,cb) {
    cb(null,num);
});


app.use(session({
    store: new RedisStore({
    host: "192.168.2.91",
    port: 6379,
    client:redisclient,
    db: 1,
    ttl:500
  }),
    saveUninitialized: false,
    secret: 'this is a secret key',
    resave : false,
    name:'csid'
}));

//after standard session
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/login', login());
app.use('/users', users());
app.use('/notice',notices());
app.use('/inchklogin',inchklogin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
