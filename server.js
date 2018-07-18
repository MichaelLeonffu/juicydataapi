const	config 			= require('./config.js')

const 	app				= require('express')()
const 	port 			= process.env.PORT || 3000

const 	morgan 			= require('morgan')
const 	bodyParser 		= require('body-parser')

const 	MongoClient 	= require('mongodb').MongoClient
const 	configDB 		= config.mongodb
const 	assert 			= require('assert')

app.use(morgan('dev')) // log every request to the console

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

function someMiddleWare(req, res, next){
	console.log(req.body)
	next()
}

app.use(someMiddleWare)

MongoClient.connect(configDB.url, function(err, client){
	assert.equal(null, err)
	require('./api/api')(config, app, client.db('JuicyData'))
})

app.listen(port)
console.log('Server started on port ' + port)