/**
 * Created by admin on 2015/12/11.
 */
"use strict";
var request = require('request');
var http = require('http');

var platconfig = {};
platconfig.enum={
    PLATFORM_91 : 1,
    PLATFORM_360 :2,
    PLATFORM_TONGBU:3
};
var ProtoBuf = require('protobufjs');
var path = require('path');
var base_builder = ProtoBuf.loadProtoFile(path.join(__dirname, "./", "base.proto"));
var web_builder = ProtoBuf.loadProtoFile(path.join(__dirname, "./", "web.proto"));
var web = web_builder.build('web');
var base = base_builder.build('Base');

platconfig.Call = base.Call;
platconfig.chkLogin = web.chkLogin;
platconfig.chkLoginR = web.chkLoginR;
platconfig.NotifyGameServer = web.NotifyGameServer;
platconfig.frntGetOrderid = web.frntGetOrderid;
platconfig.frntGetOrderidR = web.frntGetOrderidR;
var dealmap = new Map();
var MSGNAME = function(msg)
{
    return new msg().toString().substring(1);
}
var REGISTER = function(msgname,func)
{
    dealmap.set(msgname,func);
}
var decodeweb = function(msgtype,data)
{
    var decodedata = msgtype.decode(data);
    return decodedata;
}
//BEGIN MSG HANDLER
REGISTER(MSGNAME(platconfig.chkLogin),function(data) {
    var decodedata = decodeweb(platconfig.chkLogin,data);
    return function()
    {
        return decodedata;
    }
});
REGISTER(MSGNAME(platconfig.NotifyGameServer),function(data){
    var decodedata = decodeweb(platconfig.NotifyGameServer,data);
    //闭包  返回一个函数外面来调用
    return function()
    {
        return decodedata;
    }
});
REGISTER(MSGNAME(platconfig.frntGetOrderid),function(data){
   var decodedata = decodeweb(platconfig.frntGetOrderid,data);
    return function()
    {
        return decodedata;
    }
});

//END MSG HANDLER


var decodeData= function(recvData)
{
    var buf = recvData;
    var len = buf.readUInt16BE(0);
    var data =  buf.slice(2,buf.length);
    return data;
};
var decodeBase = function(recvData)
{
    var data = decodeData(recvData);
    var decodedata = platconfig.Call.decode(data);
    return {"msgName":decodedata.msgname,"data":decodedata.buf};
}

/*platconfig.get_decode_data=function(data)
{
    var opt = decodeBase(data);
    console.log(opt.msgName);
    return dealmap.get(opt.msgName)(opt.data);
}*/
//接到消息时用这个取handler
platconfig.get_handlr = function(data)
{
    var opt = decodeBase(data);
    return dealmap.get(opt.msgName)(opt.data);
}
//序列化想发送到消息
//默认都先写在base.proto-> Call这个消息里
platconfig.encode_proto = function(msg)
{
    var buf = msg.encodeNB();
    var base = new platconfig.Call();
    base.set_msgname(msg.toString().substring(1));
    base.set_buf(buf);
    var buf_base = base.encodeNB();
    var len = base.encodeNB().length;
    var buffer = new Buffer(2+len);
    buffer.writeUInt16BE(len,0);
    buf_base.copy(buffer,2,0,len);
    return buffer;
}


platconfig.platform_91_info = function ()
{
    var info = {
         appid : 100010,
         AppKey : "12332112345467"
    };
    return info;
}
platconfig.platform_360_info = function() {}
platconfig.platform_tongbutui_info = function(){
    var info = {
        appid : "",
        key : ""
    };
    return info;
}
platconfig.mymd5 = function(data){
    var md5 = crypto.createHash('md5');
    md5.update(data);
    return md5.digest('hex');
}



module.exports = platconfig;
