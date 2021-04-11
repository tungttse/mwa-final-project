class BoardServices {
	constructor(collection){
		this.dbCollection = collection
	}

	findById(id){
		return new Promise((resolve, reject) => {
			try { 
				this.dbCollection.findOne({ _id: id })
					.then(rs => {
                        console.log(rs)
						if (rs) {
							resolve(rs)
						} else {
							reject()
						}
					})
					
			} catch (e) {
                console.log(e)
				reject(e) 
			}
		})
	}
	
  updateColumnOrder(id, data){ // data {column_id, new_order}
    console.log(id, data)
		return new Promise((resolve, reject) => {
			try { 
				this.dbCollection.updateOne(
          { _id: id },
          { 
            $set : { "columns.$[object].order" : data.new_order }
          },
          { 
            arrayFilters: [ { "object._id" : data.column_id} ]
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

  updateCardOrder(id, data){ // data {column_id, new_order, card_id}
    console.log(id, data)
		return new Promise((resolve, reject) => {
			try { 
				this.dbCollection.updateOne(
          { _id: id,
            "columns._id": data.column_id       
          },
          { 
            $set : { "columns.$.cards.$[ca].order" : data.new_order }
          },
          { 
            arrayFilters : [{ "ca._id" : data.card_id}]
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