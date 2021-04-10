var express = require('express');
var router = express.Router();

/* GET list cards. */
router.get('/', function(req, res, next) {
  res.send('card list');
});

module.exports = router;
