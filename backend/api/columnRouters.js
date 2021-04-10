var express = require('express');
var router = express.Router();

/* GET list coumns. */
router.get('/', function(req, res, next) {
  res.send('list column');
});

module.exports = router;
