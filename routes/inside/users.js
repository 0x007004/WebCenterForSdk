


module.exports = function (x)
{
  var express = require('express');
  var router = express.Router();
  router.get('/', function(req, res, next) {
    console.log(x);
    res.send('respond with a resource');
  });
  return function() {
    return router;
  }
}
//module.exports = router;
