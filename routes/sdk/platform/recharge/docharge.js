/**
 * Created by admin on 2015/12/14.
 */

"use strict";
var express = require('express');
var router = express.Router();
var chargeFactory=require('./chargeFactory');
var base = require('./BaseCharge');
var factory = require('./chargeFactory.js');
var pub = require('../pub.js');
var formidable = require('formidable');


router.post('/gorderid',function(req,res){
    var form = new formidable.IncomingForm({"encoding":'binary'});
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.error(err.message);
            return;
        }

        if (typeof fields.my_buffer === "undefined") {
            res.set('Content-Type', 'application/octet-stream');
            res.send(pub.encode_proto(reqOrderid).toString('binary'));
        }
        var buffer = new Buffer(fields.my_buffer, 'binary');
        var decodedata = pub.get_handlr(buffer)();
        base.generate_order_id(decodedata, function (err, val) {
            var reqOrderid = new pub.frntGetOrderidR();
            if (!err) {
                reqOrderid.set_orderid(val.toString());
            }
            //要数据以二进制的形式回复必须用这个。
            //默认会将数据转换成ASII，会有问题。
            res.set('Content-Type', 'application/octet-stream');
            res.send(pub.encode_proto(reqOrderid).toString('binary'));
        });
    });
});
module.exports=router;