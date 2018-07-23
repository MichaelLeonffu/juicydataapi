//accounts by Michael Leonffu

const bcrypt 	= require('bcrypt')
const jwt 		= require('jsonwebtoken')
const nodemailer = require('nodemailer')
const ObjectId 	= require('mongodb').ObjectID

function cleanEmail(email){
	var emailParts = email.split('@')
	return emailParts[0].toLowerCase().replace(/\./g, '') + '@' + emailParts[1]
}

function checkEmailForm(email){
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(email).toLowerCase())
}

//var validate 	= require('jsonschema').validate
module.exports 	= function(config, app, db){

//Todo:
	//Do validation
	//Make method of formatting email correctly
	//Make sure that email resend process isnt spamable; and limits to 5 tries
	//Somehow ip block spamers; have a DB for that

//Email verification process 

app.get('/api/accounts/accounts/email-verification', (req, res) => {
	//res options in email-verification process; add a descriptor for each implementation
	res.status(501).json({message: 'email-verification is not implemented yet'})
})

app.get('/api/accounts/accounts/email-verification/send-email', (req, res) => {
	//res options in email-verification process; add a descriptor for each implementation
	res.status(501).json({message: 'email-verification is not implemented yet'})
})

app.get('/api/accounts/accounts/email-verification/verify', (req, res) => {

	// req = {
	// 	query:{
	// 		data: 'abc'	//JWT
	// 	}
	// }

	//add validation check if its a string

	//read jwt data

	if(req.query.data == null){
		console.warn('data is null: ', req.query.data)
		throw 'data is null'
	}

	jwt.verify(req.query.data, config.jwt.key, {algorithm: 'HS256'}, (err, decoded) => {	//algorithm should be in config as well
		if(err){
			console.log(err)
			res.status(406).send('token is bad')
			return
		}
		console.warn(decoded)
		console.log(decoded.jti)	//The user ID value

		if(decoded.sub == 'account-email-verification')
			verifyUser(ObjectId(decoded.jti))	//Setting the type
		else
			return res.status(400).json({message: 'bad jwt sub for email verification'})
	})

	function verifyUser(userId){
		db.collection('tenative').findOne({_id: ObjectId(userId)}, (err, result) => {
			if(err)
				return res.status(500).json({message: 'some error finding tenative account'})
			console.log(result)

			//check the date on the user if expired or not; if not then proceed with process
			if(new Date(result.birthTime.getTime() + config.accounts.tenativeTime) > new Date()){
				createUser(result)
			}else{
				db.collection('tenative').deleteOne({_id: ObjectId(result._id)}, (err, result) => {
					if(err)
						return res.status(500).json({message: 'some error deleting tenative account due to timeout'})
					console.log(result.result) //check and add logic
					res.status(410).json({message: 'account verification timeout; recreate account at sign-up'})
					// res.status(500).json({message: 'failed to delete tenative user'})
				})
			}
		})
	}

	function createUser(tenativeData){
		//users
		db.collection('users').insertOne(tenativeData.user, (err, result) => {
			if(err)
				return res.status(500).json({message: 'failed to move tenativeData into users'})
			if(result.result.ok == 1)
				db.collection('profile').insertOne(
					{
						_id: ObjectId(result.insertedId),
						name: tenativeData.profile.name
					}, (err, result) => {
						if(err)
							return res.status(500).json({message: 'failed to move tenativeData into profile'})
						if(result.result.ok == 1)
							db.collection('tenative').deleteOne({_id: ObjectId(tenativeData._id)}, (err, result) => {
								if(err)
									return res.status(500).json({message: 'failed to delete tenativeData'})
								else
									res.status(200).json({message: 'user created!'})	//amybe send a jwt at this point sign in
							})
						else
							return res.status(500).json({message: 'failed to move tenativeData into profile and get result'})
					}
				)
			else
				return res.status(500).json({message: 'failed to get result from inserting into users'})
		})
	}

	//res options in email-verification process; add a descriptor for each implementation
	// res.status(501).json({message: 'email-verification is not implemented yet'})
})

app.post('/api/accounts/accounts/forgot-password', (req, res) => {

	// req = {
	// 	query:{
	// 		email: 'abc'
	// 	}
	// }


	//res options in email-verification process; add a descriptor for each implementation
	res.status(501).json({message: 'email-verification is not implemented yet'})
})

app.post('/api/accounts/accounts/reset-password', (req, res) => {

	// req = {
	// 	query:{
	// 		password: 'abc'
	// 	}
	// }


	//res options in email-verification process; add a descriptor for each implementation
	res.status(501).json({message: 'email-verification is not implemented yet'})
})

app.get('/api/accounts/accounts/check-email', (req, res) => {	//Checks if the email exsists already

	// req = {
	// 	query:{
	// 		email: 'abc'
	// 	}
	// }

	//VALIDATION GOES HERE

	req.query.email = cleanEmail(req.query.email)

	if(!checkEmailForm(req.query.email)){
		res.status(406).json({message: 'bad email form'})
		return
	}

	db.collection('users').findOne({users: req.query.email}, (err, result) => {
		if(err){
			console.log(err)
			res.status(500).send(err)
			return
		}
		if(result.result.ok == 1)
			res.status(202).json({message:'email is not taken'})
		else
			res.status(409).json({message:'email is taken'})
		
	})
})		//FIX FOR NOSQL INJECT ATTACKS; needs validation

app.post('/api/accounts/accounts/signup', (req, res) =>{		//Creating an account

	// req = {
	// 	body: {
	// 		email: 'abc',
	// 		password: 'abc'
	// 		profile: {
	// 			firstName: 'abc',
	// 			lastName: 'abc'
	// 		}
	// 	}
	// }

	//TEMP:

	try{

		console.log(req.body)

		req.body.email = String(req.body.email)
		req.body.password = String(req.body.password)
		req.body.profile.firstName = String(req.body.profile.firstName)
		req.body.profile.lastName = String(req.body.profile.lastName)

		req.body.email = cleanEmail(req.body.email)

		if(!checkEmailForm(req.body.email)){
			console.log('missing email')
			res.status(406).json({message: 'bad email form'})
			return
		}

		if(req.body.profile.firstName.length <= 0 || req.body.profile.lastName.length <= 0){
			console.log('bad name length')
			res.status(406).json({message: 'bad name length'})
			return
		}

		checkTenative()

	}catch(e){
		console.log('failed validation')
		res.status(400).json({message: 'bad request'})
		return //not needed?
	}

	//VALIDATION GOES HERE

	//check size of name and if name is already take etc

	//FIX THIS LATTER;MAKE THIS INTO A METHOD FOR BOTH check-email and signup

	function checkTenative(){
		//check if account is in creation process
		db.collection('tenative').findOne({'user.email': req.body.email}, (err, result) => {
			if(err)
				return res.status(500).json({message: 'error finding tenative email'})

			if(result == null)	//email not in tenative
				return db.collection('users').findOne({email: req.body.email}, checkEmail)

			if(new Date(result.birthTime.getTime() + config.accounts.tenativeTime) < new Date())
				db.collection('tenative').deleteOne({_id: ObjectId(result._id)}, (err, result) => {
					if(err)
						return res.status(500).json({message: 'error deleteing timed out tenative file'})
					if(result.result.ok == 1)
						res.status(410).json({message: 'make a new account'})
					else
						res.status(500).json({message: 'failed to delete timed out tenative file after attempting to delete'})
				})
			else
				res.status(409).json({message: 'email verification already sent'})

			//ADD //check the date on the user if expired or not alternative set
		})
	}

	//check a user already has email
	function checkEmail(err, userDoc){
		if(err){
			console.log(err)
			res.status(500).send(err)
			return
		}
		if(userDoc == null)	//email not in user
			hashPassword()
		else
			res.status(409).json({message:'email is taken'})
	}

	function hashPassword(){
		//Let the hasing begin...

		//But first lets make some salt for that hash ;)

		//We will use 15 rounds; on 2GHz it's 3sec/hash

		bcrypt.genSalt(config.accounts.saltRounds, (err, salt) =>{
			if(err){
				console.log(err)
				res.status(503).json({message: 'salt broke'})
				return
			}
			bcrypt.hash(
				req.body.password,
				salt,
				saveUser
			)
		})
	}

	function saveUser(err, encryptedPassword){	//save user to tenative
		if(err){
			console.log(err)
			res.status(503).json({message:'bcrypt failed'})
			return
		}
		console.log('new tenative user: ', req.body.email, encryptedPassword)
		db.collection('tenative').insertOne(
			{
				birthTime: new Date(),
				user:{
					email: req.body.email,
					password: encryptedPassword
				},
				profile:{
					name:{
						first: req.body.profile.firstName,
						last: req.body.profile.lastName
					}
				}
			},
			signupStatus
		)
	}

	function signupStatus(err, result){
		if(err){
			console.log(err)
			res.status(500).send(err)
			return
		}
		if(result.result.ok == 1){
			// result.insertedId	//This is the object Id of that user IN TENATIVE
			// jwt.sign({jti:String(result.insertedId)}, config.jwt.key, {algorithm: 'HS256'}, (err, token) =>{
			// 	if(err){
			// 		console.log(err)
			// 		res.status(503).json({message:'jwt failed sign'})
			// 		return
			// 	}else{
			// 		console.log(token)
			// 		//res.cookie('token', token)
			// 		res.status(201).json({token: token})
			// 		return
			// 	}
			// })
			// return

			//send user email to verify email account
			generateJwtEmailVerification(result)

			// res.status(200).json({message: 'account has been placed in tenative, '})

		}else{
			res.status(500).json({message: 'account failed to be saved to tenative'})
			return
		}
	}

	function generateJwtEmailVerification(result){
		//generate jwt for user
		jwt.sign(
			{
				jti:String(result.insertedId),
				sub: 'account-email-verification'
			},
			config.jwt.key,
			{
				algorithm: 'HS256'
			},
			(err, token) =>{
			if(err)
				return res.status(503).json({message: 'failed to generate jwt for user sign up'})	//should remove user from tenative
			// console.log(token)
			//res.cookie('token', token)
			// res.status(201).json({token: token})

			sendVerificationEmail(token)
		})
	}

	function sendVerificationEmail(token){
		nodemailer.createTestAccount((err, account) => {		//can be moved apart when new api is created
			var transporter = nodemailer.createTransport({
				service: config.nodemailer.service,
				auth:{
					user: config.nodemailer.email,
					pass: config.nodemailer.password
				}
			})

			var mailMessage = {
				fullName: req.body.profile.firstName + ' ' + req.body.profile.lastName,
				link: (config.developer.ui.accounts? config.developer.ui.url : config.ui.url) + '/email-verification/verify/' + token,
				expireTime: config.accounts.tenativeTime + 'milliseconds'
			}

			var mailOptions = {
				from: '"Juicy Data Info" <juicydatainfo@gmail.com',
				to: config.developer.accounts.devEmail? 'juicydatainfo@gmail.com': req.body.email,
				subject: 'Juicy Data email verification',
				text: mailMessage.fullName + ',\n\nWelcome to Juicy Data!\nTo finish the account creation, click on this link: ' + mailMessage.link + '\nAccount and link will expire in ' + mailMessage.expireTime + ' if not used.\n\nThank you,\nJuicy Data Developers' //timestamp from result as well
			}

			transporter.sendMail(mailOptions, (err, info) => {
				if(err)
					return console.log(err)
				console.log('Message sent: %s', info.messageId)

				res.status(200).json({message: 'complete success'})
			})
		})
	}

})		//needs validation; protect noSQL inject attacks; maybe add support for name and stuff in profiles?

app.post('/api/accounts/accounts/signin', (req, res) =>{			//Check if the user is valid then return the JWT

	// req = {
	// 	body:{
	// 		email: 'abc',
	// 		password: 'abc'
	// 	}
	// }

	console.log('Request: %o', req.body)

	req.body.email = cleanEmail(req.body.email)

	if(!checkEmailForm(req.body.email)){
		res.status(406).json({message: 'bad email form'})
		return
	}
	else
		findAccount()

	//VALIDATION GOES HERE

	function findAccount(){
		db.collection('users').findOne({email:req.body.email}, (err, account) => {
			if(err)
				return res.status(500).json({message: 'error, finding user account'})
			else{
				console.log('Account found: %o', account)
				if(account)
					comparePassword(account)
				else
					return res.status(400).json({message: 'wrong password or account'}) //account wrong
			}
		})
	}

	function comparePassword(account){
		bcrypt.compare(
			req.body.password,
			account.password,
			(err, same) =>{
				//result of the compare
				if(err)
					return res.status(503).json({message: 'the compare failed'})
				else{
					if(same === true)
						generateAuthToken(account)
					else
						return res.status(400).json({message: 'wrong password or account'})	//password wrong
				}
			}
		)
	}

	function generateAuthToken(account){
		//find profile first
		db.collection('profile').findOne({_id: ObjectId(account._id)}, (err, result) => {
			if(err)
				return res.status(500).json({message: 'failed to get profile for user'})
			if(!result)
				return res.status(400).json({message: 'missing profile data for user'})
			jwt.sign(
				{
					jti: String(account._id),
					name: String(result.name.first + ' ' + result.name.last)
				}, 
				config.jwt.key, {algorithm: 'HS256'}, (err, token) =>{
				if(err)
					return res.status(503).json({message: 'jwt failed sign'})
				else{
					console.log('Sign in token generated: %o', token)
					res.cookie('juicydata-auth-token', token, { maxAge: 86400000, httpOnly: true})	//cookie lasts for 24 hours; place this in config
					return res.status(201).json({token: token})
				}
			})
		})
	}
})		//needs validation; protect noSQL inject attacks

// app.get('/api/accounts/accounts/signout', (req, res) =>{

// 	//Kills the JWT; Cleint side kills the JWT but server side logs it?

// })

}