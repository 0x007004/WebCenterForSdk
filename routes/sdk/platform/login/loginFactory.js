/**
 * Created by admin on 2015/12/11.
 */
var platform_91 = require('./platform_91');
var platform_360 = require('./platform_360');
var platform_tongbu =require('./platform_tongbutui');
var platconfig = require('../pub.js');

module.exports = function(idx)
{
    "use strict";
    var platform = null;
    switch (idx)
    {
        case platconfig.enum.PLATFORM_91:
            platform = new platform_91.platform91();
            break;
        case platconfig.enum.PLATFORM_360:
            platform = new platform_360.platform360();
            break;
        case platconfig.enum.PLATFORM_TONGBU:
            platform = new platform_tongbu.platform_tongbutui();
            break;
        default :
            break;
    }
    return platform;
}