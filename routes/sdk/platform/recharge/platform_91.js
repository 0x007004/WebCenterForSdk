/**
 * Created by admin on 2015/12/10.
 */
"use strict";
var crypto = require('crypto');
var path = require('path');
var inherits = require( path.join(__dirname,'..','..','..','../tools/inherits'));
var BaseCharge = require('./BaseCharge');
var platconfig = require('../pub.js');
var net = require('net');
function platform_91() {
    BaseCharge.BaseCharge.call(this);
}
inherits.inherits(platform_91,BaseCharge.BaseCharge);

platform_91.prototype.check_order_valid=function(req)
{
    var appid               = req.query.AppId;//应用ID
    var act                 = req.query.Act;//操作
    var productName         = req.query.ProductName;//应用名称
    var ConsumeStreamId     = req.query.ConsumeStreamId;//消费流水号
    var CooOrderSerial      = req.query.CooOrderSerial;//商户订单号
    var Uin			 	    = req.query.Uin;//91帐号ID
    var GoodsId		 	    = req.query.GoodsId;//商品ID
    var GoodsInfo		 	= req.query.GoodsInfo;//商品名称
    var GoodsCount		    = req.query.GoodsCount;//商品数量
    var OriginalMoney	 	= req.query.OriginalMoney;//原始总价（格式：0.00）
    var OrderMoney		    = req.query.OrderMoney;//实际总价（格式：0.00）
    var Note			 	= req.query.Note;//支付描述
    var PayStatus		 	= req.query.PayStatus;//支付状态：0=失败，1=成功
    var CreateTime		    = req.query.CreateTime;//创建时间
    var Sign		 		= req.query.Sign;//91服务器直接传过来的sign
    var errorcode = "";
    //因为这个DEMO是接收验证支付购买结果的操作，所以如果此值不为1时就是无效操作
    if(act != 1){
        return errorcode= {"ErrorCode":"3","ErrorDesc":"Act无效"};
    }
    //如果传过来的应用ID开发者自己的应用ID不同，那说明这个应用ID无效
    if(platconfig.platform_91_info().appid != appid){
        return errorcode=  {"ErrorCode":"2","ErrorDesc":"AppId无效"};
    }
    //按照API规范里的说明，把相应的数据进行拼接加密处理
    var sign_check = platconfig.mymd5(platconfig+act+productName+ConsumeStreamId+CooOrderSerial+Uin+GoodsId+GoodsInfo+GoodsCount+OriginalMoney+OrderMoney+Note+PayStatus+CreateTime+platconfig.platform_91_info().AppKey);
    if(sign_check !== Sign){//当本地生成的加密sign跟传过来的sign一样时说明数据没问题
        return errorcode= {"ErrorCode":"5","ErrorDesc":"Sign无效"};
    }
    else{
        /*
         *
         * 开发者可以在此处进行订单号是否合法、商品是否正确等一些别的订单信息的验证处理
         * 相应的别的错误用不同的代码和相应说明信息，数字和信息开发者可以自定义（数字不能重复）
         * 如果所有的信息验证都没问题就可以做出验证成功后的相应逻辑操作
         * 不过最后一定要返回上面那样格式的json数据
         *
         */
        return errorcode= {"ErrorCode":"1","ErrorDesc":"接收成功"};
    }
}
exports.platform91 = platform_91;