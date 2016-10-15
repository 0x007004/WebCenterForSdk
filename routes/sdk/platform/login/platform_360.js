/**
 * Created by admin on 2015/12/10.
 */
var path = require('path');
var inherits = require( path.join(__dirname,'..','..','..','../tools/inherits'));
var loginBase = require('./base');

function platform_360()
{
    "use strict";
    loginBase.base.call(this);
}
inherits.inherits(platform_360,loginBase.base);



platform_360.prototype.config=function(req,fret){
    var options = {
        uri:"https://openapi.360.cn/user/me.json?access_token=2593931096a9bfd3047a0e7cd25e93e5198a345c23fb5bad83"
    };
    this.check(options,fret);
}

platform_360.prototype.send=function(response)
{
    "use strict";
    return response;
}
exports.platform360 = platform_360;