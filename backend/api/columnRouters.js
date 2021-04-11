var express = require('express');
var router = express.Router();
const mongo = require('mongodb');


/* GET list coumns. */
router.get('/', function(req, res, next) {
  res.send('list column');
});

router.post('/:board_id', async function(req, res) {

    try{
      await req.boardsCollection.updateOne(
        {
          _id : new mongo.ObjectId(req.params.board_id)
        },
        { 
          $push : { 'columns' : {"_id" : new mongo.ObjectId(), ...req.body} }
        },
      )
      res.json({"OK" : "column added successfully"});
  
    }
    catch(err){
        res.json({err: err})
    }
})




module.exports = router;
