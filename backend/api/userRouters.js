const UserServices = require('../services/userServices');
const express = require('express');
const router = express.Router();

/* GET users info. */
router.get('/', function(req, res, next) {
  res.send('user detail');
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

module.exports = router;
