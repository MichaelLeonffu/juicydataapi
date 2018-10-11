const	config 			= require('./config.js')

const	app				= require('express')()
const	port 			= process.env.PORT || 3000

const	morgan 			= require('morgan')
const	bodyParser 		= require('body-parser')
const	cookieParser	= require('cookie-parser')
const   jwt             = require('jsonwebtoken')

//Add logic to check if config file exsists (if not then exit and prompt user)
//Add logic to check if database files have been intintazlied; such as teams data and seasons data

const	MongoClient 	= require('mongodb').MongoClient
const	configDB 		= config.mongodb
const	assert 			= require('assert')
const 	ObjectId 		= require('mongodb').ObjectID

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

function authenticationMiddleware(req, res, next) {
	token = req.cookies['juicydata-auth-token'];
	if (token) {
		jwt.verify(
			token, 
			config.jwt.key, {algorithm: 'HS256'}, (err, decoded) =>{
			if(err){
				res.clearCookie('juicydata-auth-token')
				if (err.name === 'TokenExpiredError'){
					req.authTokenExpired = true;
					console.log('juicydata-auth-token expired!', decoded)
				}else
					return res.status(503).json({message: 'jwt failed verify'})
			}else{
				req.user = {}
				req.user._id = decoded.jti
				req.user.name = decoded.name
				console.log('Decoded juicydata-auth-token:', decoded)
			}
		})
	}else{
		//maybe remove this latter?
		req.user = {}
	}
	next()
}

// app.use(authenticationMiddleware)

var util = require('util')

MongoClient.connect(configDB.url, function(err, client){
	assert.equal(null, err)

	var db = client.db(configDB.db)

	// //user details middleware
	// function getUserDetails(req, res, next){
	// 	var db = client.db(configDB.db)
	// 	db.collection('users').findOne(
	// 		{}
	// 	)
	// 	next()
	// }

	function sessionMiddleware(req, res, next) {

		//check if they have session cookie
		sessionToken = req.cookies['juicydata-session-id']
		function sessionsUpkeep(callback){
			function makeSession(makeSessionCallBack){
				db.collection('sessions').insertOne(
					{
						userId: req.user._id ? ObjectId(req.user._id) : null,
						requests:[]
					}, 
					(err, result) => {
						if(err){
							return res.status(400).json({message: 'ERR in making sessions'})
						}else{
							console.log('result of session making: ', result.insertedId)
							res.cookie('juicydata-session-id', result.insertedId)
							req.user['juicydata-session-id'] = result.insertedId
							makeSessionCallBack()
						}
					}
				)
			}

			if(sessionToken){
				console.log('sessionToken', sessionToken)
				db.collection('sessions').findOne({_id: ObjectId(sessionToken)}, (err, result) => {
					if(err){
						return res.status(400).json({message: 'something wrong finding sessions file'})
					}else{
						console.log(result)
						if(result){
							//do something

							console.log('result of session search ', result)

							if(result.userId){
								console.log('user has id in session found', result.userId)
								//has a user id
								// if(req.user._id){
								// 	//is logged in
								// 	if(ObjectId(result.userId) == ObjectId(res.user._id)){	//maybe its an objectId?
								// 		//same user 
								// 		//this is good!
								// 	}else{
								// 		//BAD SITUATION SHOULDNT HAPPEN SOMEHOW!!!
								// 	}
								// }else{
								// 	//not logged in
								// 	//SHOULD NEVER HAPPEN!!!!!!!!!!! maybe check?
								// }
							}else{
								console.log('user does not have id in session found')
								//doesnt have a user id
								if(req.user._id){
									console.log('user is loged in and this is their id', req.user._id)
									console.log('attmpting to update session with id', sessionToken)
									//is logged in; add the userId to the session
									db.collection('sessions').updateOne(
										{
											_id: ObjectId(sessionToken)
										},
										{
											$set: {userId: ObjectId(req.user._id)}
										},
										(err, result) => {
											if(err){
												return res.status(400).json({message: 'fix latter, status code sessions failed to update'})
											}else{
												// result.ok

												//also add the sessions id to the profile of the user
												db.collection('profile').updateOne(
													{
														_id: ObjectId(req.user._id)
													},
													{
														$push: {sessions: ObjectId(sessionToken)}
													},
													(err, result) => {
														if(err){
															return res.status(400).json({message: 'some mistake in updating profile'})
														}else{
															//guchi
															callback(true)
														}
													}
												)
											}
										})
								}else{
									//not logged in; this is ok
								}
							}
							callback(true)
						}else{
							//make session
							makeSession(() => {
								callback(true)
							})

						}
					}
				})
			}else{
				//make a session
				makeSession(() => {
					callback(true)
				})
			}
		}

		//only runs the tracking when needed
		if(req.originalUrl == '/api/navigation/enter'){
			sessionsUpkeep((result) => {
				if(result)
					next()
			})
		}else{
			next()
		}
	}

	// app.use(sessionMiddleware)

	function requestsMiddleware(req, res, next){

		function logRequest(callback){
			var fields = [
				// 'app',
				'baseUrl',
				'body',
				'cookies',
				'fresh',
				'headers',
				'hostname',
				'ip',
				'ips',
				'method',
				'originalUrl',
				'params',
				'path',
				'protocol',
				'query',
				// 'route',
				'secure',
				'signedCookies',
				'stale',
				'subdomains',
				'xhr'
			]
			// delete req.res
			var smallData = {}
			fields.forEach((field) => {
				smallData[field] = req[field]
			})
			// console.log(util.inspect(smallData))

			db.collection('requests').insertOne(
				{
					sessionId: req.cookies['juicydata-session-id'] ? ObjectId(req.cookies['juicydata-session-id']) : req.user['juicydata-session-id'],
					time:{
						start: new Date(),
						end: null
					},
					requestData: smallData
				},
				(err, result) => {
					if(err){
						return res.status(400).json({message: 'some error in making the restues file'})
					}else{
						// console.log('result', result)
						//now to add the ID of this result to the session
						db.collection('sessions').updateOne(
							{
								_id: ObjectId(req.cookies['juicydata-session-id'] ? ObjectId(req.cookies['juicydata-session-id']) : req.user['juicydata-session-id'])
							},
							{
								$push: {requests: ObjectId(result.insertedId)}
							},
							(err, resultOfUpdate) => {
								if(err){
									return res.status(400).json({message: 'error in making result of update for request'})
								}else{

									//update the perivous request end time
									//first get the pervious request
									db.collection('sessions').findOne(
										{
											_id: ObjectId(req.cookies['juicydata-session-id'] ? req.cookies['juicydata-session-id'] : req.user['juicydata-session-id'])
										},
										(err, resultOfSessionsSearch) =>{
											if(err){
												return res.status(400).json({message: 'something wrnog finding sessions for end request time'})
											}else{
												//found or didnt find
												if(resultOfSessionsSearch != null && resultOfSessionsSearch._id){
													//found
													//check for any times
													if(resultOfSessionsSearch.requests.length > 0){
														//check the update patifuclar request
														db.collection('requests').updateOne(
															{
																_id: ObjectId(resultOfSessionsSearch.requests[resultOfSessionsSearch.requests.length-1])
															},
															{
																$set: {'time.end': new Date()}
															},
															(err, resultOfUpdateTime) => {
																if(err){
																	return res.status(400).json({message: 'error when time end setting'})
																}else{
																	//should check for stuff but not rn
																	callback()
																}
															}
														)
													}else{
														//there isnt a thing here yet so lets just call back
														callback()
													}
												}else{
													//not found SOMETHINGS WRONG?!
												}
											}
										}
									)
									// console.log(resultOfUpdate.ops)
								}
							}
						)
					}
				}
			)
		}

		logRequest((result) => {
			next()
		})
	}

	// app.use(requestsMiddleware)

	require('./api/api')(config, app, db)
})

app.listen(port)
console.log('Server started on port ' + port)