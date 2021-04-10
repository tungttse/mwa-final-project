var express = require('express');
var router = express.Router();

/* GET users info. */
router.get('/', function(req, res, next) {
  res.send('user detail');
});

module.exports = router;
