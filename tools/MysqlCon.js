/**
 * Created by admin on 2015/12/8.
 */
var mysql = require('mysql');
var pool  = mysql.createPool({
    ip: '127.0.0.1',
    port:3306,
    user: 'root',
    password: '123456',
    database : 'webcenter'
});

exports.query = function (sql,func) {
    pool.query(sql,func);
}
exports.escape = function(str){
    return mysql.escape(str);
}//sql Injection Defenses