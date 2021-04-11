var express = require('express');
const BoardServices = require('../services/boardServices');
var router = express.Router();

/* GET list boards. */
router.get('/', function (req, res, next) {
  res.send('list boards');
});

router.get('/:id', function (req, res, next) {
  let boardId = req.params.id;
  new BoardServices(req.boardsCollection).findById(boardId)
    .then(serviceResp => {
      console.log(serviceResp)
      res.json(serviceResp)
    })
    .catch(err => {
      res.json({ error: err })
    })
});

module.exports = router;
