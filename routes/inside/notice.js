/**
 * Created by admin on 2015/12/11.
 */

var express = require('express');
var router = express.Router();
var mysql = require('../../tools/MysqlCon');

module.exports = function(passport)
{
    "use strict";
    //title 公告标题
    //content 公告内容
    router.get('/add',function(req,res){
        res.render('addroute');
    });
    router.post('/add',function(req,res){
        var date = new Date();
        var title =  '\''+req.body.title +'\'';
        var content = '\''+req.body.content+'\'';
        var sql = 'insert into notice (title,content,create_time) values ( '+title+','+content+','+'FROM_UNIXTIME('+date.getTime()/1000+'))';
        console.log(sql);
        mysql.query(sql,function(err,result){
            if(err){res.send(err);}
            else{res.send(result)}
        });
    });
    router.get('/deleteSafe',function(req,res){
        res.render('delnotice');
    })
    //id 公告id
    //如果有人正在使用就删不掉
    router.post('/deleteSafe',function(req,res){
        var id = req.body.id;
        var sql = 'call proc_del_using_notice('+req.body.id+')';
        mysql.query(sql,function(err,result){
            if(err){res.send(err);}
            else{
               if(result[0]["result"] == 1)
               {
                    res.send("删除成功")
               }
               else if(result[0]["result"]==-1)
               {
                    res.send('当前公告正在发布');
               }
               else
               {
                    res.send('内部错误');
               }
            };
        });
    });
    //title 查询公告
    // 公告标题或者公告id
    router.get('/search',function(req,res){
        res.render('publish');
    });
    router.post('/search',function(req,res){
        if(typeof req.body.idx ==="undefined")
        {
            req.body.id = 0;
            console.log("asaasdasd");
        }
        var s = "SELECT * FROM notice WHERE id = "+'\''+req.body.idx+'\''+" OR title = "+'\''+req.body.idx+'\''+"";
        console.log(s);
        mysql.query(s,function(err,result) {
        if(err){res.send(err);}
        else{res.send(result);}
        });
    });
    //获取所有不用带参数
    router.get('/searchAll',function(req,res){
        var sql = "select * from notice"
        mysql.query(sql,function(err,result){
            console.log(result);
            if(err){res.send(err);}
            else{res.send(result)}
        });
    });
    //发布公告
    //id
    router.post('/publish',function(req,res){
        var sql = "call proc_publish_notice("+req.body.id+")";
        mysql.query(sql,function(err,result)
        {
            console.log(result);
            if(err){res.send(err);}
            else{res.send(result);}
        })
    });
    //取消发布
    //id
    router.post('/unpublish',function(req,res){
        var sql = 'delete from usenotice';
        mysql.query(sql,function(err,result){
            if(err){res.send(err);}
            else{res.send(result);}
        })
    });
    return function () { return router; }
}