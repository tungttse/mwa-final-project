class UserServices {
	constructor(collection){
		this.dbCollection = collection
	}

	findByEmail(email){
		return new Promise((resolve, reject) => {
			try {
				this.dbCollection.findOne({ _id: email })
					.then(rs => {
						if (rs) {
							console.log('user ', rs)
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
				this.dbCollection.findOne({_id: data._id})
					.then(findResult => {
						if(findResult) reject("exist")
						else {
							this.dbCollection.insertOne(data)
							.then((insertResult) => {
								if(insertResult.insertedCount) resolve() 
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
				this.dbCollection.findOne({_id: email})
					.then(findResult => {
						if(findResult) resolve()
						else reject() 
					})
			} catch (e) {
				resolve() 
			}
		})
	}
};

module.exports = UserServices