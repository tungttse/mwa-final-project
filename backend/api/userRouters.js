const UserServices = require('../services/userServices');
const express = require('express');
const router = express.Router();
const mongo = require('mongodb');

/* GET users info. */
router.get('/', async function (req, res, next) {
    new UserServices(req.usersCollection).findBoardCurrenUser(req.current_user_email)
      .then(serviceResp => {
        res.json(serviceResp)
      })
      .catch(err => {
    res.json({ error: err })
  })
});

router.get('/boards', function (req, res, next) {
  new UserServices(req.usersCollection).findBoardCurrenUser(req.current_user_email)
    .then(serviceResp => {
      res.json(serviceResp)
    })
    .catch(err => {
      res.json({ error: err })
    })
});

router.post('/boards', function (req, res) {
  let userInfo = {
    _id: req.current_user_email
  }
  new UserServices(req.usersCollection, req.boardsCollection).createNewBoard(req.body.name, userInfo)
    .then(serviceResp => {
      res.json(serviceResp)
    })
    .catch(err => {
      res.json({ error: err })
    })
});

// edit board
router.patch('/boards/:board_id', function (req, res) {
  let boardId = new mongo.ObjectID(req.params.board_id);
  new UserServices(req.usersCollection, req.boardsCollection).editBoard(boardId, req.body.name, req.current_user_email)
    .then(serviceResp => {
      res.json(serviceResp)
    })
    .catch(err => {
      res.json({ error: err })
    })
});

// edit board
router.delete('/boards/:board_id', function (req, res) {
  let boardId = new mongo.ObjectID(req.params.board_id);
  new UserServices(req.usersCollection, req.boardsCollection).deleteBoard(boardId, req.current_user_email)
    .then(serviceResp => {
      res.json(serviceResp)
    })
    .catch(err => {
      res.json({ error: err })
    })
});

module.exports = router;
