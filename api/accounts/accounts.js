//accounts by Michael Leonffu

const bcrypt 	= require('bcrypt')
const jwt 		= require('jsonwebtoken')

//var validate 	= require('jsonschema').validate
module.exports 	= function(config, app, db){

const cert 		= config.jwt

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

	//converts to lowercase; removes any periods before @ sign; 

	db.collection('users').findOne({users: req.query.email}, checkEmail)

	function checkEmail(err, result){
		if(err){
			console.log(err)
			res.status(500).send(err)
			return //do I need this return, or any returns? (I'm using a if else already)
		}
		if(result.result.ok == 1){
			res.status(202).json({message:'email is not taken'})
		}else{
			res.status(409).json({message:'email is taken'})
		}
	}
})		//FIX FOR NOSQL INJECT ATTACKS; needs validation

app.post('/api/accounts/accounts/signup', (req, res) =>{		//Creating an account

	// req = {	All required
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

	console.log(req.body)

	var localEmail = String(req.body.email)
	var localPassword = String(req.body.password)

	var localFirstName = String(req.body.profile.firstName)
	var localLastName = String(req.body.profile.lastName)

	//VALIDATION GOES HERE

	//check size of name and if name is already take etc

	//FIX THIS LATTER;MAKE THIS INTO A METHOD FOR BOTH check-email and signup

	db.collection('users').findOne({email: localEmail}, null, checkEmail)

	function checkEmail(err, userDoc){
		if(err){
			console.log(err)
			res.status(500).send(err)
			return //do I need this return, or any returns? (I'm using a if else already)
		}else{
			if(!userDoc){	//if no userDoc was found then null is returned
				//Email not taken
				hashPassword()
				return
			}else{
				res.status(409).json({message:'email is taken'})
				return
			}
		}
	}

	function hashPassword(){
		//Let the hasing begin...

		//But first lets make some salt for that hash ;)

		//We will use 15 rounds; on 2GHz it's 3sec/hash

		bcrypt.genSalt(15, (err, salt) =>{
			if(err){
				console.log(err)
				res.status(503).json({message:'salt broke!'})
			}else{
				//If salt was made cool
				bcrypt.hash(
					localPassword,
					salt,
					saveUser
				)
			}
		})
	}

	function saveUser(err, encryptedPassword){
		if(err){
			console.log(err)
			res.status(503).json({message:'bcrypt failed'})
		}else{
			console.log(localEmail, encryptedPassword)
			db.collection('users').insertOne(
				{
					email: localEmail,
					password: encryptedPassword
				},
				signupStatus
			)
		}
	}

	function signupStatus(err, result){
		if(err){
			console.log(err)
			res.status(500).send(err)
			return //do I need this return, or any returns? (I'm using a if else already)
		}else{
			if(result.result.ok == 1){
				//result.insertedId	//This is the object Id of that user
				jwt.sign({jti:String(result.insertedId)}, cert.key, {algorithm: 'HS256'}, (err, token) =>{
					if(err){
						console.log(err)
						res.status(503).json({message:'jwt failed sign'})
						return
					}else{
						console.log(token)
						//res.cookie('token', token)
						res.status(201).json({token: token})
						return
					}
				})
				return
			}else{
				res.status(503).json({message:'something is wrong'})
				return
			}
		}
	}
})		//needs validation; protect noSQL inject attacks; maybe add support for name and stuff in profiles?

app.get('/api/accounts/accounts/signin', (req, res) =>{			//Check if the user is valid then return the JWT

	// req = {
	// 	query:{
	// 		email: 'abc',
	// 		password: 'abc'
	// 	}
	// }

	//TEMP:

	var localEmail = String(req.query.email)
	var localPassword = String(req.query.password)

	//VALIDATION GOES HERE

	db.collection('users').findOne({email:localEmail}, accountFound)

	function accountFound(err, account){
		if(err){
			console.log(err)
			res.status(500).send(err)
			return //do I need this return, or any returns? (I'm using a if else already)
		}else{
			console.log(account)
			if(account){
				comparePassword(account)
			}else{
				res.status(400).json({message:'account not found '})
				return
			}
		}
	}

	function comparePassword(account){
		bcrypt.compare(
			localPassword,
			account.password,
			(err, same) =>{
				//result of the compare
				if(err){
					console.log(err)
					res.status(503).json({message: 'the compare failed'})
					return
				}else{
					console.log(account)
					if(same === true){
						//result.insertedId	//This is the object Id of that user
						jwt.sign({jti:String(account._id)}, cert.key, {algorithm: 'HS256'}, (err, token) =>{
							if(err){
								console.log(err)
								res.status(503).json({message:'jwt failed sign'})
								return
							}else{
								console.log(token)
								//res.cookie('token', token)
								res.status(201).json({token: token})
								return
							}
						})
						return
					}else{
						//If password was wrong
						res.status(401).json({message: 'wrong password'})
						return
					}
				}
			}
		)
	}
})		//needs validation; protect noSQL inject attacks

// app.get('/api/accounts/accounts/signout', (req, res) =>{

// 	//Kills the JWT; Cleint side kills the JWT but server side logs it?

// })

}