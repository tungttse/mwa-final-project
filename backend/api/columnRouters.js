var express = require('express');
var router = express.Router();
const mongo = require('mongodb');


/* GET list coumns. */
router.get('/', function(req, res, next) {
  res.send('list column');
});

router.post('/:board_id', async function (req, res, next) {

  try {
    let newColumn = { 
      "_id": new mongo.ObjectId(), 
      "name": req.body.name,
      "cards": [] } 
    await req.boardsCollection.updateOne(
      {
        _id: new mongo.ObjectId(req.params.board_id)
      },
      {
        $push: { 'columns': newColumn }
      }
    )
    res.json(newColumn);
  
  }
  catch (err) {
    res.json({ err: err })
  }
});

router.patch('/:column_id/:board_id', async function (req, res) {

  try {
    await req.boardsCollection.updateOne(
      {
        _id: new mongo.ObjectId(req.params.board_id),
        'columns._id': new mongo.ObjectId(req.params.column_id)
      },
      {
        $set: { 'columns.$.name': req.body.name },
      }
    )
    res.json({ "ok": "Name changed successfully" });
        
  }
  catch (err) {
    res.json({ err: err })
   
  }
});

router.delete('/:column_id/:board_id', async function (req, res,) {
  
  try {
    await req.boardsCollection.updateOne(
      {
        _id: new mongo.ObjectId(req.params.board_id),
      },
      {
        $pull: { 'columns': { '_id': new mongo.ObjectId(req.params.column_id) } },
      }
    )
    res.json({ "ok": "Column deleted successfully" });
        
  }
  catch (err) {
    res.json({ err: err })
   
  }
  
});


module.exports = router;
