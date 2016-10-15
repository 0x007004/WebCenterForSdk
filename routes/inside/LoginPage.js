/**
 * Created by admin on 2015/12/1.
 */
var luascript = "local key ='UserSession'\n" +
    "local value = redis.call('HGET',key,KEYS[1]) \n" +
    "if not(value) then \n" +
        "redis.call('HSET',key,KEYS[1],ARGV[1]) \n" +
        "return 1 \n" +
    "else \n" +
        "if value ~=ARGV[1] then \n" +
            "local outkey='sess:'..value \n" +
            "redis.call('DEL',outkey) \n" +
            "print(outkey)\n" +
            "redis.call('HSET',key,KEYS[1],ARGV[1]) \n" +
            "return -1\n" +
        "else\n" +
            "end \n" +
    "end\n" +
    "return 1"

module.exports = function(passport,client)
{
    var express = require('express');
    var router = express.Router();
    router.post('/',passport.authenticate('local',{failureRedirect:"/Login"}),
        function(req,res) {
            client.eval(luascript, 1,req.body.username,req.sessionID, function (err, redres) {
                console.log(err);
                console.log(redres);
                res.send('Login OK');
                res.end();
            });
        });

    router.get('/',function(req,res) {
        "use strict";
        res.render('index', { title: 'Login',
            appname:'WebCenter'});
    });

    router.get('/thisYou',require('connect-ensure-login').ensureLoggedIn(),
        function(req,res)
        {
            res.send("has login");
        });
     return function () {
         return router;
     }
}
