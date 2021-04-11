var express = require('express');
var router = express.Router();

/* GET list boards. */
router.get('/', function(req, res, next) {
  res.send('list boards');
});

module.exports = router;
