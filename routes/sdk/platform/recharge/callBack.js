/**
 * Created by admin on 2015/12/14.
 */

"use strict";
var express = require('express');
var router = express.Router();
var factory = require('./chargeFactory.js');
var pub = require('../pub.js');


router.get('/91',function(req,res){
    var platform = factory(pub.enum.PLATFORM_91);
    var errorcode = platform.check_order_valid(req);
    if(errorcode.ErrorCode === 1) {
        platform.chk_order_sequence(parseInt(req.query.CooOrderSerial));
    }
    res.json(errorcode);
});

router.get('/tongbu',function(req,res){
    var platform = factory(pub.enum.PLATFORM_TONGBU);
    var errorcode = platform.check_order_valid(req);
    if(errorcode.status === "success")
    {
        platform.chk_order_sequence(parseInt(req.query.trade_no));
    }
    res.json(errorcode);
});

router.get('/test',function(req,res){
    var pub = require('../pub.js');
    var platform = factory(pub.enum.PLATFORM_TONGBU);
    platform.test({"orderid":"afa1c75827f400079a576588d0bb41bc"});
});
module.exports=router;