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

router.patch('/order/columns/:board_id', function (req, res, next) {
  let boardId = req.params.board_id;
  let data = req.body
  new BoardServices(req.boardsCollection).updateColumnOrder(boardId, data)
    .then(serviceResp => {
      res.json(serviceResp.modifiedCount)
    })
    .catch(err => {
      res.json({ error: err })
    })
});


router.patch('/order/cards/:board_id', function (req, res, next) {
  let boardId = req.params.board_id;
  let data = req.body
  new BoardServices(req.boardsCollection).updateCardOrder(boardId, data)
    .then(serviceResp => {
      res.json(serviceResp.modifiedCount)
    })
    .catch(err => {
      res.json({ error: err })
    })
});

module.exports = router;
