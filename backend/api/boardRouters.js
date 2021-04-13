var express = require('express');
const mongo = require('mongodb');
const BoardServices = require('../services/boardServices');
var router = express.Router();

/* GET list boards. */
router.get('/', function (req, res, next) {
  res.send('list boards');
});

router.get('/dd/:id', function (req, res, next) {
  let boardId = new mongo.ObjectID(req.params.id);
  new BoardServices(req.boardsCollection).findById(boardId)
    .then(serviceResp => {
      res.json(serviceResp)
    })
    .catch(err => {
      res.json({ error: err })
    })
});

router.patch('/dd/order/columns/:board_id', function (req, res, next) {
  let boardId = new mongo.ObjectID(req.params.board_id);
  let columnId = new mongo.ObjectID(req.body.column_id);
  new BoardServices(req.boardsCollection).updateColumnOrder(boardId, {"column_id": columnId, "new_order": req.body.new_order})
    .then(serviceResp => {
      res.json(serviceResp.modifiedCount)
    })
    .catch(err => {
      res.json({ error: err })
    })
});

// change order of card in a column
router.patch('/dd/order/cards/:board_id', function (req, res, next) {
  let boardId = new mongo.ObjectID(req.params.board_id);
  let data = {
    column_id: new mongo.ObjectID(req.body.column_id),
    card_id: new mongo.ObjectID(req.body.card_id),
    new_order: req.body.new_order
  }
  
  new BoardServices(req.boardsCollection).updateCardOrder(boardId, data)
    .then(serviceResp => {
      res.json(serviceResp.modifiedCount)
    })
    .catch(err => {
      res.json({ error: err })
    })
});

router.get('/dd/cards/:board_id/:column_id/:card_id', (req, res) => {
  let boardId = new mongo.ObjectID(req.params.board_id);
  let columnId = new mongo.ObjectID(req.params.column_id);
  let cardId = new mongo.ObjectID(req.params.card_id);
  new BoardServices(req.boardsCollection).findCardById(boardId, columnId, cardId)
    .then(serviceResp => {
      res.json(serviceResp)
    })
    .catch(err => {
      res.json({ error: err })
    })
})

router.post('/dd/cards/:board_id/:column_id', (req, res) => {
  let boardId = new mongo.ObjectID(req.params.board_id);
  let columnId = new mongo.ObjectID(req.params.column_id);
  
  new BoardServices(req.boardsCollection).addCardToColumnDD(boardId, columnId, req.body)
    .then(serviceResp => {
      res.json(serviceResp)
    })
    .catch(err => {
      res.json({ error: err })
    })
})


router.delete('/dd/cards/:board_id/:column_id/:card_id', (req, res) => {
  let boardId = new mongo.ObjectID(req.params.board_id);
  let columnId = new mongo.ObjectID(req.params.column_id);
  let cardId = new mongo.ObjectID(req.params.card_id);
  new BoardServices(req.boardsCollection).deleteCardOutOfColumn(boardId, columnId,cardId)
    .then(serviceResp => {
      res.json(serviceResp)
    })
    .catch(err => {
      res.json({ error: err })
    })
})

module.exports = router;
