/**
 * Created by admin on 2015/12/9.
 */
"use strict";
var request = require('request');

function LoginBase() {}
LoginBase.prototype.config=function(req,fret) {}

LoginBase.prototype.check=function(option,fret){

    request(option,function(error,body,response)
    {
        fret(error,body,response);
    });
}
LoginBase.prototype.send=function(response)
{
    return response;
}

exports.base = LoginBase;

var loginFactory = require('./loginFactory');
var request = require('request');
var ProtoBuf = require('protobufjs');
var pub = require('../pub');
var formidable = require('formidable');

exports.pubfun = function(req,res)
{
    var form = new formidable.IncomingForm({"encoding":'binary'});
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.error(err.message);
            return;
        }
        var buffer = new Buffer(fields.my_buffer,'binary');
        var decodedata = pub.get_handlr(buffer)();
        var platform = loginFactory(decodedata.platform);
        platform.config(decodedata,function(error,body,response){
            if(error){res.end();}
            var chkLoginR =  new pub.chkLoginR();

            if(platform.send(response)===1) {
                chkLoginR.set_result(true);
            }
            else {
                chkLoginR.set_result(false);
            }
            console.log(buffer);
            res.set('Content-Type', 'application/octet-stream');
            res.send(pub.encode_proto(chkLoginR).toString('binary'));
        });
    });
}