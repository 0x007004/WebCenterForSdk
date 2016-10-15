/**
 * Created by admin on 2015/12/14.
 */
var crypto = require('crypto');
var path = require('path');
var inherits = require( path.join(__dirname,'..','..','..','../tools/inherits'));
var loginBase = require('./base');
var platconfig = require('../pub.js');


var appid = platconfig.platform_tongbutui_info();

function platform_tongbutui()
{
    "use strict";
    loginBase.base.call(this);
}

inherits.inherits(platform_tongbutui,loginBase.base);

platform_tongbutui.prototype.config=function(req,fret){
    var options = {
        baseUrl:"http://tgi.tongbu.com/api/LoginCheck.ashx",
        uri:"?session=afa1c75827f400079a576588d0bb41bc&appid=100000"
    };
    this.check(options,fret);
}

platform_tongbutui.prototype.send = function(response)
{
    var ret ;
    "use strict";
    if(response > 0)
    {
        ret = 1;
    }
    else
    {
        ret = 0;
    }
    return ret;
}
exports.platform_tongbutui = platform_tongbutui;