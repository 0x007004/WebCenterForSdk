/**
 * Created by admin on 2015/12/10.
 */

var crypto = require('crypto');
var path = require('path');
var inherits = require( path.join(__dirname,'..','..','..','../tools/inherits'));
var loginBase = require('./base');
var platconfig = require('../pub.js');


var conf = platconfig.platform_91_info();
var appid = conf.appid;
var AppKey = conf.AppKey;
var Act = 4;

function platform_91()
{
    "use strict";
    loginBase.base.call(this);
}
inherits.inherits(platform_91,loginBase.base);

platform_91.prototype.config=function(decodedata,fret){
    var unencode = appid+Act+decodedata.pid+decodedata.token+AppKey;
    var md5 = crypto.createHash('md5');
    md5.update(unencode);
    var sign = md5.digest(unencode);
    var options = {
        baseUrl:"http://service.sj.91.com/usAercenter/AP.aspx",
        uri:"?AppId="+appid+"&Act="+Act+"&Uin="+decodedata.pid+"&Sign="+sign+"&SessionID="+decodedata.token+""
    };
    this.check(options,fret);
}

platform_91.prototype.send=function(response){
    if(response.ErrorCode == 1)
    {
        return 1;
    }
    else
    {
        return -1;
    }
}
exports.platform91 = platform_91;