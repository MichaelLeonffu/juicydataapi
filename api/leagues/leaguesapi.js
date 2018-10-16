//leaguesapi by Michael Leonffu

const multer 	= require('multer')
const jwt 		= require('jsonwebtoken')

module.exports = function(config, app, db){

const upload 	= multer({dest: config.multer.dest})

app.get('/api/leagues', (req, res) => {
	res.status(200).json({message: 'leagues api home'})
})

//Connecting all APIs

// require('./ftc/eventsftcapi')(config, app, db)

//getting league information
app.get('/api/leagues/get-info', (req, res) => {

	// req.query = {
	// 	week: 123 //1 or 2
	// }

	// res = {
	// 	[
	// 		{
	// 			_id: 'abc',		//league ID
	// 			leagueInfo: {
	// 				location: 'abc',
	// 				address: 'abc',
	// 				date: 'abc',
	// 				time: {
	// 					start: 'abc',
	// 					end: 'abc'
	// 				},
	// 				week: 123 //1 or 2
	// 			},
	// 			slots: 123,		//how many filled in slots
	// 		},
	// 	]
	// }

	if(typeof req.query.week == 'undefined')
		return res.status(400).json({message: 'BAD REQUEST NO WEEK QUERY'})

	if(req.query.week != 1 && req.query.week != 2)
		return res.status(400).json({message: 'BAD REQUEST NOT 1 or 2'})

	db.collection('leagues').find(
		{
			'leagueInfo.week': Number(req.query.week)
		}, 
		{
			teams: 0
		}, (err, result) => {
			if(err)
				return res.status(500).json({message: 'some error finding leagues'})
			result.toArray((err, results) => {
				if(err)
					return res.status(500).json({message: 'some error making cursor'})
				for(let i = 0; i < results.length; i++)
					results[i].teams = 'teehee no!'
				res.status(200).json(results)
			})
		}
	)
})

//checks if token has been used
app.get('/api/leagues/token-used', (req, res) => {

	// req.query = {
	// 	key: 'abc'
	// }

	if(!req || !req.query || !req.query.key)
		return res.status(400).json({message: 'BAD REQUEST NO QUERY'})

	db.collection('leagueRegistrationKey').findOne(
	{
		key: req.query.key
	}, (err, result) =>{
		if(err)
			return res.status(500).json({message: 'Finding failed'})
		if(!result || typeof result.used == 'undefined')
			res.status(400).json({message: 'Key does not exsist'})
		else
			res.status(200).json({used: result.used})	//default TODO check status code for this
	})
})

//upload an image
app.post('/api/leagues/upload-logo', upload.fields([{name: 'logo'}]), (req, res) =>{
	console.log(req.files)
	if(!req || !req.files || !req.files.logo[0] || !req.files.logo[0].filename)
		return res.status(400).json({messsage: 'no logo'})
	res.status(200).json({fileName: req.files.logo[0].filename})
})

//signup for a league
app.post('/api/leagues/sign-up', (req, res) => {

	// req.body = {
	// 	jwt: 'abc',			//key!!!!!!!! jwt
	// 	facebook: 'abc',	//links
	// 	twitter: 'abc',
	// 	instagram: 'abc',
	// 	website: 'abc',
	// 	meetPick1: 'abc',
	// 	meetPick2: 'abc',
	// 	logo: 'abc',
	// 	contacts: [
	// 		{
	// 			firstName: 'abc',
	// 			lastName: 'abc',
	// 			email: 'abc',
	// 			phone: 'abc' //as a string may be 123-123-123 or 123123123 etc
	// 		}
	// 	]
	// }

	console.log(req.body)

	//validation (can be booleans and will crash the program)
	if(!req || !req.body || !req.body.jwt || !req.body.meetPick1 || !req.body.meetPick2 || !req.body.contacts) //required fields
		return res.status(400).json({message: 'incomplete required data'})

	//parse contacts; remove any bad contacts
	let contacts = []
	//primary must be completely filled out
	if(!req.body.contacts[0].firstName || !req.body.contacts[0].lastName || !req.body.contacts[0].email || !req.body.contacts[0].phone)
		return res.status(400).json({message: 'incomplete required data primary contact'})

	contacts.push(req.body.contacts[0]) //primary is 0

	for(let i = 0; i < req.body.contacts.length; i++)
		if(req.body.contacts[i].firstName && req.body.contacts[i].lastName && req.body.contacts[i].email && req.body.contacts[i].phone)
			contacts.push(req.body.contacts[i])

	//fix
	req.body.contacts = contacts

	jwt.verify(req.body.jwt, config.jwt.key, {algorithm: 'HS256'}, (err, decoded) => {	//algorithm should be in config as well
		if(err)
			return res.status(406).send('token is bad')
		
		console.log(decoded)
		console.log(decoded.teamNumber)	//the team number

		//check if the jwt is used or not
		db.collection('leagueRegistrationKey').findOne(
			{
				key: req.body.jwt
			},
			(err, result) =>{
				if(err)
					return res.status(500).json({message: 'some error finding the league Reigstion Key'})
				if(!result || typeof result.used == 'undefined')
					return res.status(500).json({message: 'No key found for that jwt or no used'})
				if(result.used)
					return res.status(500).json({message: 'This key has already been used'})
				//check two leagues if they are valid combination of leagues
				db.collection('leagues').findOne(
					{
						_id: req.body.meetPick1
					},
					(err, result1) =>{
						if(err)
							return res.status(500).json({message: 'some error getting meet1'})
						if(!result1)
							return res.status(500).json({message: 'invalid meet1, not found'})
						db.collection('leagues').findOne(
							{
								_id: req.body.meetPick2
							},
							(err, result2) =>{
								if(err)
									return res.status(500).json({message: 'some error getting meet2'})
								if(!result2)
									return res.status(500).json({message: 'invalid meet2, not found'})
								if( //condituions to fail!
									(result1.leagueInfo.week != 1 && result1.leagueInfo.week != 2) || 
									(result2.leagueInfo.week != 1 && result2.leagueInfo.week != 2) ||
									result1.leagueInfo.week == result2.leagueInfo.week) //each week needs to be either 1 or 2 and cannot be same
									return res.status(500).json({message: 'weeks are either not 1 or 2; or the same value'})
								if(result1.slots >= 14 || result2.slots >= 14) //check if full
									return res.status(500).json({message: 'either meet week 1 or 2 is full'})
								//all is good lets go boiz!
								db.collection('socials').updateOne(
									{
										_id: Number(decoded.teamNumber)	//team number
									},
									{
										$set: {
											_id: Number(decoded.teamNumber),	//team number
											facebook: req.body.facebook,
											twitter: req.body.twitter,
											instagram: req.body.instagram,
											website: req.body.website,
											logo: req.body.logo
										}
									},
									{
										upsert: true
									},
									(err, result) =>{
										if(err)
											return res.status(500).json({message: 'some error setting socials'})
										console.log('making the socials', result.result)
										//league 1
										db.collection('leagues').updateOne(
											{
												_id: req.body.meetPick1
											},
											{
												$inc: {slots: 1},
												$push: {teams: Number(decoded.teamNumber)}
											},
											(err, result) =>{
												if(err)
													return res.status(500).json({message: 'some error setting league1 info'})
												console.log('making the leagues1', result.result)
												//league 2
												db.collection('leagues').updateOne(
													{
														_id: req.body.meetPick2
													},
													{
														$inc: {slots: 1},
														$push: {teams: Number(decoded.teamNumber)}
													},
													(err, result) => {
														if(err)
															return res.status(500).json({message: 'some error setting league2 info'})
														console.log('making the leagues2', result.result)
														//set their token to true used
														db.collection('leagueRegistrationKey').updateOne(
															{
																key: req.body.jwt
															},
															{
																$set: {used: true}
															},
															(err, result) =>{
																if(err)
																	return res.status(500).json({message: 'somehow didnt set the update token status'})
																res.status(200).json({message: 'good'})
															}
														)
													}
												)
											}
										)
									}
								)
							}
						)
					}
				)
			}
		)
	})
})

}