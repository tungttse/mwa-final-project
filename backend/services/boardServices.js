class BoardServices {
  constructor(collection) {
    this.dbCollection = collection
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.findOne({ _id: id })
          .then(rs => {
            if (rs) {
              resolve(rs)
            } else {
              reject()
            }
          })

      } catch (e) {
        reject(e)
      }
    })
  }

  findCardById(id, column_id, card_id) {
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.findOne(
          {
            _id: id,
            "columns" : {
              $elemMatch: {
                _id: column_id,
                "cards" : {
                  $elemMatch: {
                    _id: card_id
                  }
                }
              }
            }
          }      
        )
        .then(rs => {
            if (rs) {
              resolve(rs)
            } else {
              reject()
            }
          })

      } catch (e) {
        reject(e)
      }
    })
  }

  updateColumnOrder(id, data) { // data {column_id, new_order}
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.updateOne(
          { _id: id },
          {
            $set: { "columns.$[object].order": data.new_order }
          },
          {
            arrayFilters: [{ "object._id": data.column_id }],
          }
        )
          .then(rs => {
            if (rs) {
              resolve(rs)
            } else {
              reject()
            }
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  updateCardOrder(id, data) { // data {column_id, new_order, card_id}
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.updateOne(
          {
            _id: id,
            "columns._id": data.column_id
          },
          {
            $set: { "columns.$.cards.$[ca].order": data.new_order }
          },
          {
            arrayFilters: [{ "ca._id": data.card_id }]
          }
        )
          .then(rs => {
            if (rs) {
              resolve(rs)
            } else {
              reject()
            }
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  addCardToColumnDD(board_id, column_id, card_data) {
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.updateOne(
          {
            _id: board_id,
            "columns._id": column_id
          },
          {
            $push: { "columns.$.cards": card_data }
          }
        )
          .then(rs => {
            if (rs) {
              resolve(rs)
            } else {
              reject()
            }
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  deleteCardOutOfColumn(board_id, column_id, card_id) {
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.updateOne(
          {
            _id: board_id,
            "columns._id": column_id
          },
          {
            $pull: { "columns.$.cards" : {
              "_id" : card_id
            }}
          }
        )
          .then(rs => {
            if (rs) {
              resolve(rs)
            } else {
              reject()
            }
          })
      } catch (e) {
        reject(e)
      }
    })
  }
};

module.exports = BoardServices