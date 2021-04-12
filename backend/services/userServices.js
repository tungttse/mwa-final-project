class UserServices {
  constructor(collection, boardCollection) {
    this.dbCollection = collection
    this.dbBoardCollection = boardCollection
  }

  findBoardCurrenUser(uid) {
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.findOne(
          { _id: uid },
          {
            projection: {
              password: 0
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

  createNewBoard(boardName, userInfo) {
    return new Promise((resolve, reject) => {
      try {
        this.dbBoardCollection.insertOne(
          {
            "name" : boardName,
            "user": userInfo,
            "columns": [],
            "created_date": new Date(),
            "updated_date": new Date(),
          }
          )
          .then(rs => {
            console.log(rs)
            if (rs) {
              return new Promise((uresolve, ureject) => {
                try {
                  this.dbCollection.updateOne(
                    { _id: userInfo._id },
                    { $push: { "boards": {
                      _id: rs.insertedId,
                      name: boardName
                    } } },
                    )
                    .then(urs => {
                      console.log(urs)
                      if (urs) {
                        resolve(urs)
                      } else {
                        reject()
                      }
                    })
          
                } catch (e) {
                  reject(e)
                }
              })
            } else {
              reject()
            }
          })

      } catch (e) {
        reject(e)
      }
    })
  }

  findByEmail(email) {
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.updateOne(
          { _id: email },
          { $push: {"boards": {}} }
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

  insert(data) {
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.findOne({ _id: data._id })
          .then(findResult => {
            if (findResult) reject("exist")
            else {
              this.dbCollection.insertOne(data)
                .then((insertResult) => {
                  if (insertResult.insertedCount) resolve()
                  else {
                    reject(insertResult)
                  }
                })
            }
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  checkEmail(email) {
    return new Promise((resolve, reject) => {
      try {
        this.dbCollection.findOne({ _id: email })
          .then(findResult => {
            if (findResult) resolve()
            else reject()
          })
      } catch (e) {
        resolve()
      }
    })
  }
};

module.exports = UserServices