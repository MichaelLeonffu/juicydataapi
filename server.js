const	config 			= require('./config.js')

const	app				= require('express')()
const	port 			= process.env.PORT || 3000

const	morgan 			= require('morgan')
const	bodyParser 		= require('body-parser')
const	cookieParser	= require('cookie-parser')

//Add logic to check if config file exsists (if not then exit and prompt user)
//Add logic to check if database files have been intintazlied; such as teams data and seasons data

const	MongoClient 	= require('mongodb').MongoClient
const	configDB 		= config.mongodb
const	assert 			= require('assert')

app.use(morgan('dev')) 	//log every request to the console

app.use(cookieParser())	//make cookies parsed!

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

function someMiddleWare(req, res, next){
	console.log('------------------------------------------------------------------')
	console.log(new Date())
	console.log('device: ', req.headers['user-agent'])
	// res.cookie('rememberme', 'yes', { maxAge: 900000, httpOnly: false})
	// res.cookie('remembermenot', 'not', { maxAge: 900000, httpOnly: true})
	// res.clearCookie('rememberme')
	console.log('Cookies: ', req.cookies)
	next()
}

app.use(someMiddleWare)

MongoClient.connect(configDB.url, function(err, client){
	assert.equal(null, err)

	// //user details middleware
	// function getUserDetails(req, res, next){
	// 	var db = client.db(configDB.db)
	// 	db.collection('users').findOne(
	// 		{}
	// 	)
	// 	next()
	// }
	require('./api/api')(config, app, client.db(configDB.db))
})

app.listen(port)
console.log('Server started on port ' + port)