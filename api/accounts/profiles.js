//profiles by Michael Leonffu

const jwt 		= require('jsonwebtoken')

const imagePath	= require('./../../config/config').data.localImagePath

//var validate = require('jsonschema').validate
module.exports = function(config, app, db){

const cert 		= config.jwt

//Todo:
	//Do vlidation
	//make method of formatting email correctly

app.get('/api/accounts/accounts/email-verification', (req,res) =>{	//Will verify email address

})

app.get('/api/accounts/profile/read', (req, res) =>{	//Gets the users profile file
	
	// req = {
	// 	cookies: {
	// 		token: 'abc'
	// 	}
	// }

	//temp
	var localToken = String(req.cookies.token)	//CHECK THIS LATTER?

	//Open and check JWT

	if(localToken){		//checks if threre is a JWT
		verifyJwt()
	}else{				//If threre isn't a JWT then:
		console.log('no jwt found')
		res.status(400).send('no jwt found')
		return
	}

	function verifyJwt(){
		jwt.verify(localToken, cert.key, {algorithm: 'HS256'}, (err, decoded) =>{
			if(err){
				console.log(err)
				res.status(406).send('token is bad')
				return
			}
			console.log(decoded)
			console.log(decoded.jti)	//The user ID value

			findProfile(ObjectId(decoded.jti))	//Setting the type
		})
	}

	let findProfile = function(userId){
		db.collection('profiles').findOne(
		{
			_id: userId
		},profile)
	}

	let profile = function(err, profile){
		if(err){
			console.log(err)
			res.status(500).send(err)	//Fix to json latter
			return
		}
		console.log(profile)
		if(profile){
			res.status(200).json(profile)
		}else{
			res.status(409).json({message: 'profile not found'})
		}
	}

})

app.post('/api/accounts/profile/profile-picture', upload.single('profilePicture'), (req,res) =>{	//update the profile image stuff
	
	// req = {
	// 	files: [
	// 		{
	// 			fieldname: 'abc',	//it's whatever is upload.single('THIS THING')
	// 			originalname: 'abc',	//orginal file name
	// 			encoding: 'abc',	//7bit? thingys?
	// 			mimetype: 'abc',	//type of file? eg: image/jpeg
	// 			destination: 'abc',	//Directory it'll be saved in; eg: 'uploads/'
	// 			filename: 'abc',	//The new name of the file that got saved into that directory
	// 			path: 'abc',	//path and name of the file altogether eg: 'uploads/542ab8b60d711f003f279fb4fb486024'
	// 			size: 123	//size of the file; in bytes; such that 695869 bytes = 695.869 kilobytes KB
	// 		}
	// 	],
	// 	cookies: {
	// 		token: 'abc'	//JWT Token
	// 	}
	// }

	//temp

	var localToken = String(req.cookies.token)	//CHECK THIS LATTER?
	var localFiles = req.files
	var localProfilePicture = localFiles[0].filename

	//VALIDATION GOES HERE

	//Open and check JWT

	if(localToken){		//checks if threre is a JWT
		verifyJwt()
	}else{				//If threre isn't a JWT then:
		console.log('no jwt found')
		res.status(400).send('no jwt found')
		return
	}

	function verifyJwt(){
		jwt.verify(localToken, cert.key, {algorithm: 'HS256'}, (err, decoded) =>{
			if(err){
				console.log(err)
				res.status(406).send('token is bad')
				return
			}
			console.log(decoded)
			console.log(decoded.jti)	//The user ID value

			updateProfilePicture(ObjectId(decoded.jti))	//Setting the type
		})
	}

	let updateProfilePicture = function(userId){

		db.collection('profiles').updateOne(
			{
				_id: userId
			},
			{
				profilePicture: {$set: localProfilePicture}
			},
			profilePicture
		)
	}

	let profilePicture = function(err, result){
		if(err){
			console.log(err)
			res.status(500).send(err)
			return
		}
		console.log(result)
		if(result){
			res.status(200).json({message:'profile picture worked'})
		}else{
			res.status(409).json({message:'profile picture failed'})
		}
	}

})

}