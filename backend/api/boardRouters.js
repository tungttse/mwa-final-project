var express = require('express');
var router = express.Router();

/* GET list boards. */
router.get('/', function(req, res, next) {
  res.send('list boards');
});

router.post('/', async function(req, res){
  await req.boardsCollection.insert(req.body);
  res.json({"aaaaaaaaa" : " aaaa"})

});

module.exports = router;
