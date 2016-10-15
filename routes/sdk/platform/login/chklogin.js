/**
 * Created by admin on 2015/12/10.
 */
"use strict";
var express = require('express');
var router = express.Router();
var base = require('./base');

router.post('/serverinfochk',function(req,res)
{
    base.pubfun(req,res);
});
module.exports=router;