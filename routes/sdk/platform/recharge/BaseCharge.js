/**
 * Created by admin on 2015/12/14.
 */
"use strict";
var request = require('request');
var net = require('net');
var redis = require('redis');
var path = require('path');
var mysql = require( path.join(__dirname,'..','..','..','../tools/MysqlCon.js'));
var ProtoBuf = require('protobufjs');
var pub = require('../pub');
function BaseCharge(){}

var inc = "local ret_val=0\n" +
    "local cur_val = redis.call('GET','atom')\n" +
    "if not cur_val then\n" +
    "ret_val = redis.call('INCR','atom')\n" +
    "elseif tonumber(cur_val) < 999 then\n" +
    "ret_val = redis.call('INCR','atom')\n" +
    "else\n" +
    "redis.call('SET','atom','1')\n" +
    "ret_val = 1;\n" +
    "end\n" +
    "return ret_val;";

var redisclient = redis.createClient(6379, '192.168.2.91');
console.log(path.join(__dirname, "./", "web.proto"));
var builder = ProtoBuf.loadProtoFile(path.join(__dirname, "../", "web.proto"));
var web = builder.build('web');
var Notify = web.NotifyGameServer;
var notify = new Notify({
    "orderid" : "1",
    "pid" : 2
});

BaseCharge.prototype.check_order_valid = function(req) {

}

BaseCharge.prototype.test = function(option)
{
    var client = net.connect({port:3102,host:"192.168.2.36"},function(req,res){
            var notify = new Notify({"orderid" : option.orderid});
            var buf = notify.encodeNB();
            var len = buf.length;
            var buffer = new Buffer(2+len);
            buffer.writeUInt16BE(len,0);
            buf.copy(buffer,2,0,len);
            client.write(buf);
        });

    client.on('data',function(data){
        //目前这样只支持接收一条Server的消息
        if(typeof client.my_buf==="undefined"){
            var len = data.readUInt16LE(0);
            console.log(data);
            console.log("this buffer size :"+len);
            client.my_buf = new Buffer(len);
            client.my_size = len;
            client.my_sub = 0;
            data.copy(client.my_buf,client.my_sub,2,data.length);
            client.my_sub+=data.length-2;
        }
        else{
            data.copy(client.my_buf,client.my_sub,0,data.length);
            client.my_sub += data.length;
        }
        if(client.my_sub === client.my_size)
        {
            console.log(client.my_buf.length);
            //var msg = pub.get_decode_data(client.data);
            //do function
            var x  =pub.get_handlr(client.data)();
            client.end();
        }
    });
    client.on('end',function(data){
        console.log('Server close');
    });
}

BaseCharge.prototype.toGameServer=function(option) {
    var client = net.connect({port: option.port, host: option.ip}, function (req, res) {
        //发往gameServer通知给加钱
        var sql = " UPDATE orders SET status_ = 'requestdim' WHERE orderid = " + parseInt(mysql.escape(option.orderid)) + "";
        mysql.query(sql, function (err, ds) {
            if (err) {
                //mysql 有异常一般不会跑到
                //把和服务器的连接关掉
                client.end();
            }
            else {
                var notify = new Notify({"orderid": option.orderid, "pid":option.playerid});
                var buf = notify.encodeNB();
                var len = buf.length;
                var buffer = new Buffer(2 + len);
                buffer.writeUInt16BE(len, 0);
                buf.copy(buffer, 2, 0, len);
                client.write(buf);
            }
        });
    });
    client.on('data', function (data) {
        //目前这样只支持接收一条Server的消息
        if (typeof client.my_buf === "undefined") {
            var len = data.readUInt16LE(0);
            console.log(data);
            console.log("this buffer size :" + len);
            client.my_buf = new Buffer(len);
            client.my_size = len;
            client.my_sub = 0;
            data.copy(client.my_buf, client.my_sub, 2, data.length);
            client.my_sub += data.length - 2;
        }
        else {
            var  copy_len = data.length+client.my_sub > client.my_size ? data.my_size-data.my_sub:data.length;
            data.copy(client.my_buf, client.my_sub, 0, copy_len);
            client.my_sub += copy_len;
        }
        if (client.my_sub === client.my_size) {
            console.log(client.my_buf.length);
            var x = pub.get_handlr(client.my_buf)();
            //gameServer 给完钻石了
            var sql = "UPDATE orders SET status_ = 'givedim' WHERE orderid = " + parseInt(mysql.escape(x.orderid)) + "";
            mysql.query(sql, function (err, ds) {
                if (err) {throw "mysql error" + err;}
            });
            client.end();
        }
    });
}
exports.BaseCharge = BaseCharge;
//补零
function generate_zero(num)
{
    var s ="";
    for(var i = 0;i<num;++i)
    {
        s+="0";
    }
    return s;
}
function convert(option){
    for(var x in option)
    {
        option[x] = generate_zero(option[x].size - option[x].data.toString().length) + option[x].data.toString();
    }
    return option;
}

exports.chk_order_sequence=function(orderid)
{
    //通知扣款结果
    var sql =" call proc_chk_order_squence("+parseInt(mysql.escape(orderid))+")";//看看是否是重复通知
    mysql.query(sql,function(err,ds){
        if(err){
            throw "mysql Error "+err;
        }
        else{
            if(ds[0]["RESULT"] != 'request')
                return;
            var option = {
                "orderid":parseInt(orderid),
                "ip": ds[0]["S_IP"],
                "port":ds[0]["S_PORT"],
                "playerid":ds[0]["PLAYERID"]
            };
            platform.toGameServer(option);
        }
    });
}


exports.generate_order_id = function(decodedata,func)
{
    var groupid = decodedata.groupid;
    var serverid = decodedata.serverid;
    var playerid = decodedata.playerid;
    var money = decodedata.money;
    if (typeof groupid === "undefined" ||
        typeof serverid==="undefined" ||
        typeof  playerid==="undefined" ||
        typeof money ==="undefined")
    {
        func({"error":"asdasd"},0);
        return;
    }
    //订单号用时间精确到毫秒
    //用redis产生0-999累加的数字占3位
    //相当于每毫秒最多产生999个订单
    //1.计算机的计时器计算微秒好像有波动，采用毫秒
    //2.javascript最大只能精确到毫秒
    //3.第一位是年 2015 -> 15 ，如果是2115 -> 115 最大只支持3来表示年份
    redisclient.eval(inc, 0, function (err, redres) {
        var date = new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var sec = date.getSeconds();
        var msec = date.getMilliseconds();
        var msecnow = (hour*60*60+minute*60+sec)*1000+msec;
        var option = {
            year:{data:date.getFullYear()%1000, size:3},
            mon: {data:date.getMonth(), size:2},
            order:{data:redres, size:3},
            msecnow:{data:msecnow, size:8}
        }
        var coption = convert(option);
        var orderid = parseInt(coption.year + coption.mon + coption.order+coption.msecnow);
        var status = 'request';
        var sql = "insert into orders (orderid,groupid,serverid,playerid,money,status_,createtime) " +
            "values ("+orderid+",'"+groupid+"','"+serverid+"','"+playerid+"','"+money+"','"+status+"',FROM_UNIXTIME("+date.getTime()/1000+"))";
        mysql.query(sql,function(err,ds){
            if(err) return ;
            func(err,orderid);
        });
    });
}
