const mongo = require('mongodb')
var express = require('express');
var router = express.Router();

/* GET list cards. */
router.get('/:id/:column_id', async function (req, res, next) {
  await req.boardsCollection.find({
    _id: new mongo.ObjectID(req.params.id)
  }).project({ 'columns.cards': 1 }).toArray((err, data) => {
    if (err)
      res.json(err)
    res.json(data)
  })

});

//inserting a card from database
//POST /api/cards/:board_id/:column_id
router.post('/:id/:column_id', async function (req, res) {
  //console.log(req.params.id + "\n" + req.params.column_id);
    try {
    //getting the column name and board name
    let x = await req.boardsCollection
      .findOne({ _id: new mongo.ObjectID(req.params.id) })
    let name = x.name;
    let column_name;
    x.columns.forEach(element => {
      if(element._id == req.params.column_id)
        column_name = element.name
    });


    let card_id = new mongo.ObjectID();
    await req.boardsCollection.updateOne(
      {
        _id: new mongo.ObjectID(req.params.id),
        'columns._id': new mongo.ObjectID(req.params.column_id)
      },
      {
        '$push': {
          'columns.$.cards': {
            '_id': card_id,
            ...req.body,
            "board": name,
            "column": column_name,
            'created_date': new Date(),
            'updated_date': new Date()
          }
        }
      },
    )
    res.json({ "success": "ok"});
  }
  catch (err) {
    res.json(
      {
        "success": "error",
        "message": err
      }
    );
  }
})

//updating a card from database
//PATCH /api/cards/:id/:board_id/:column_id
router.patch('/:id/:board_id/:column_id', async function (req, res) {
  try {

    await req.boardsCollection.updateOne(
      {
        _id: new mongo.ObjectID(req.params.board_id)
      },
      {
        $set : {'columns.$[columnsFilter].cards.$[cardsFilter]' : {...req.body}}
      },
      {
        arrayFilters:
          [
            { 'columnsFilter._id': new mongo.ObjectID(req.params.column_id) },
            { 'cardsFilter._id':   new mongo.ObjectID(req.params.id) }
          ]
      }
    )

    res.json({ "success": "ok" });
  }
  catch (err) {
    res.json(
      {
        "success": "error",
        "message": err
      })
  }
});

//Deleting a card from database
//DELETE /api/cards/:id/:board_id/:column_id
router.delete('/:id/:board_id/:column_id', async function (req, res) {
  //console.log(req.params.id + "\n" + req.params.column_id);
  try {
    await req.boardsCollection.updateOne(
      {
        _id: new mongo.ObjectID(req.params.board_id),
        'columns._id': new mongo.ObjectID(req.params.column_id)
      },
      {
        $pull: {
          'columns.$.cards': { '_id': new mongo.ObjectID(req.params.id) }
        }
      })
    res.json({ "success": "ok" });
  }
  catch (err) {
    res.json(
      {
        "success": "error",
        "message": err
      })
  }
})



module.exports = router;
