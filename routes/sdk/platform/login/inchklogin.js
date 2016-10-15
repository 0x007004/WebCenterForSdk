/**
 * Created by admin on 2015/12/10.
 */

var express = require('express');
var router = express.Router();
var base = require('./base');
"use strict";
var multer  = require('multer');
var upload = multer();


router.post('/',function(req,res)
{
    base.pubfun(req,res);
});
module.exports=router;