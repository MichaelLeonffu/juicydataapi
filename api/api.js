//api by Michael Leonffu

module.exports = function(config, app, db, ObjectId){

app.get('/api', (req, res) => {
	res.send('api home')
})

app.get('/api/version', (req, res) => {
	res.status(200).send(config.api.version)
})

//Connecting all APIs

// require('./accounts/accountsapi')(config, app, db)
// require('./events/eventsapi')(config, app, db)
// require('./blog/blogsapi')(config, app, db)
require('./leagues/leaguesapi')(config, app, db)
require('./misc/miscapi')(config, app, db)

// app.get('/api/illusive', (req, res) => {
// 	res.status(301).redirect('/api/teapot')
// })

// app.get('/api/download_virus', (req, res) => {
// 	res.status(200).download('virus.exe')
// })

// app.get('/api/download/teapot', (req, res) => {
// 	res.status(200).download('./data/resources/teapot.png')
// })

// app.get('/api/download/teapot2', (req, res) => {
// 	res.status(200).sendFile('/Users/michaelleonffu/Developer/juicydata/juicydataapi/juicydataapi/data/resources/teapot.png')
// })

// app.get('/api/download/bakabar', (req, res) => {
// 	res.status(200).download('./data/resources/bakabar.png')
// })

// app.get('/api/index', (req, res) => {
// 	res.send('<html><header>lolxd</header><a href = "http://50.113.86.149:12299/api/teapot"> Download Teapot here.</a><br><img src = "bakabar"><br><body> u r using: ' + req.headers['user-agent'] + '</body></html>')
// })

// app.get('/api/bakabar', (req, res) => {
// 	res.sendFile('/Users/michaelleonffu/Developer/juicydata/juicydataapi/juicydataapi/bakabar.png')
// })

// app.get('/api/teapot', (req, res) => {
// 	// res.status(418).send('I\'m a teapot')
// 	res.status(418).sendFile('./teapot.png')
// })


//Tracking API logic
// app.get('/api/track', (req, res) => {

// 	// req = {
// 	// 	user: {
// 	// 		type: 'mongodbObjectId'
// 	// 	},
// 	// 	session: {
// 	// 		type: 'number'
// 	// 	},
// 	// 	tracking: String
// 	// }

// 	//TODO have it sawp depending on who its tracking
// 	//ADD Mongodb interface to this so it can UPDATE tracking logs

// 	res.status(200).json({
// 		user: req.body.user,
// 		session: req.body.session,
// 		tracking: req.body.tracking
// 	})
// })

// app.post('/api/navigation/enter', (req, res) => {
// 	console.log('ITS RES HERE: ', res.headersSent)
// 	res.status(200).send()
// })
// app.post('/api/navigation/leave', (req, res) => {
// 	res.status(200).send()
// })

}