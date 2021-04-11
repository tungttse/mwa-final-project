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
};

module.exports = BoardServices