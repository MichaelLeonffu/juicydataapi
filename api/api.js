//api by Michael Leonffu

module.exports = function(config, app, db, ObjectId){

app.get('/api', (req, res) => {
	res.send('api home')
})

app.get('/api/version', (req, res) => {
	res.status(200).send(config.api.version)
})

//Connecting all APIs

require('./accounts/accountsapi')(config, app, db)

app.get('/api/teapot', (req, res) => {
	res.status(418).send('I\'m a teapot')
})


//Tracking API logic
app.get('/api/track', (req, res) => {

	// req = {
	// 	user: {
	// 		type: 'mongodbObjectId'
	// 	},
	// 	session: {
	// 		type: 'number'
	// 	},
	// 	tracking: String
	// }

	//TODO have it sawp depending on who its tracking
	//ADD Mongodb interface to this so it can UPDATE tracking logs

	res.status(200).json({
		user: req.body.user,
		session: req.body.session,
		tracking: req.body.tracking
	})
})

}