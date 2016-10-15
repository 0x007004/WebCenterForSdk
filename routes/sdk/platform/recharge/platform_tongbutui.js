/**
 * Created by admin on 2015/12/14.
 */
var crypto = require('crypto');
var path = require('path');
var inherits = require( path.join(__dirname,'..','..','..','../tools/inherits'));
var BaseCharge = require('./BaseCharge');
var platconfig = require('../pub.js');


var appid = platconfig.platform_tongbutui_info().appid;

function platform_tongbutui()
{
    "use strict";
    BaseCharge.BaseCharge.call(this);
}

inherits.inherits(platform_tongbutui,BaseCharge.BaseCharge);

exports.platform_tongbutui = platform_tongbutui;