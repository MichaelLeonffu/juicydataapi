//leaguesapi by Michael Leonffu

const multer 		= require('multer')
const jwt 			= require('jsonwebtoken')
const nodemailer 	= require('nodemailer')

module.exports = function(config, app, db){

const upload 		= multer({dest: config.multer.dest})

app.get('/api/leagues', (req, res) => {
	res.status(200).json({message: 'leagues api home'})
})

//Connecting all APIs

// require('./ftc/eventsftcapi')(config, app, db)

app.get('/api/leagues/get-teams', (req, res) =>{


	// res = 'teamNumber, name, email, status\n' //as csv

	db.collection('teamsToSelect').aggregate(
		[
			{$lookup:{
				from: 'socials', 
				localField: '_id', 
				foreignField: '_id', 
				as: 'status'
			}},{$addFields:{
				status:{
					$gt:[{$size: '$status'}, 0]
				}
			}}
		],(err, result) =>{
			if(err)
				return res.status(500).send('some error geberatubg get-teams information')
			result.toArray((err, results) => {
				if(err)
					return res.status(500).send('some error making cursor for get-teams')
				let dataCSV = 'teamNumber, name, email, status\n'
				for(let i = 0; i < results.length; i++)
					dataCSV += results[i]._id + ', ' + results[i].name + ', ' + results[i].email + ', ' + results[i].status + '\n'
				res.status(200).send(dataCSV)
			})
		}
	)


	// res.status(200).send('teamNumber, name, email, status\n'+'teamNumber2, name2, email2, status2')
})

//getting league information
app.get('/api/leagues/get-info', (req, res) => {

	// res = {
	// 	leagues: [
	// 		{
	// 			leagueWeek: 1,
	// 			leagueMeets:[
	// 				{
	// 					_id: 'abc',		//league ID
	// 					leagueInfo: {
	// 						location: 'abc',
	// 						address: 'abc',
	// 						date: 'abc',
	// 						time: {
	// 							start: 'abc',
	// 							end: 'abc'
	// 						},
	// 						leagueName: 'abc',
	// 						week: 123 //1 or 2
	// 					},
	// 					slots: 123		//how many filled in slots
	// 				},
	// 			]
	// 		},
	// 	]
	// }

	db.collection('leagues').aggregate(
		[
			{$sort:{
				'leagueInfo.leagueName': 1 //doesnt seem to sort
			}},
			{$project:{
				teams: 0
			}},
			{$group:{
				_id:'$leagueInfo.week',
				leagueMeets:{
					$addToSet:'$$ROOT'
				}
			}},
			{$project:{
				_id: 0,
				leagueWeek:'$_id',
				leagueMeets: '$leagueMeets'
			}}
		],
		{
			teams: 0 //DO I NEED THIS CAN I REMOVE THIS?!?!?!?!?!?!?!??!?!??
		}, (err, result) => {
			if(err)
				return res.status(500).json({message: 'some error finding leagues'})
			result.toArray((err, results) => {
				if(err)
					return res.status(500).json({message: 'some error making cursor'})
				res.status(200).json({leagues: results})
			})
		}
	)
})

//getting league information
app.get('/api/leagues/get-league', (req, res) => {

	// req.query = {
	// 	leagueId: 'abc'
	// }

	// res = {
	// 	_id: 'abc',		//league ID
	// 	leagueInfo: {
	// 		location: 'abc',
	// 		address: 'abc',
	// 		date: 'abc',
	// 		time: {
	// 			start: 'abc',
	// 			end: 'abc'
	// 		},
	// 		leagueName: 'abc',
	// 		week: 123 //1 or 2
	// 	},
	// 	slots: 123		//how many filled in slots
	// }

	if(!req.query || typeof req.query.leagueId == 'undefined')
		res.status(400).json({message: 'No query for leagueId'})

	db.collection('leagues').findOne(
		{
			_id: req.query.leagueId
		},
		{
			projection:{
				teams: 0
			}
		}, (err, result) => {
			if(err)
				return res.status(500).json({message: 'some error finding leagues'})
			if(!result)
				return res.status(400).json({message: 'no key matches'})
			res.status(200).json(result)
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
	// 	weekPick1: 'abc',	//same as the week number; this is the id of the event
	// 	weekPick2: 'abc',
	// 	weekPick3: 'abc',
	// 	weekPick4: 'abc',
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
	if(!req || !req.body || !req.body.jwt || !req.body.weekPick1 || !req.body.weekPick2 || !req.body.weekPick3 || !req.body.weekPick4 || !req.body.contacts) //required fields
		return res.status(400).json({message: 'incomplete required data'})

	//parse contacts; remove any bad contacts
	let contacts = []
	//primary must be completely filled out
	if(!req.body.contacts[0].firstName || !req.body.contacts[0].lastName || !req.body.contacts[0].email || !req.body.contacts[0].phone)
		return res.status(400).json({message: 'incomplete required data primary contact'})

	contacts.push(req.body.contacts[0]) //primary is 0

	for(let i = 1; i < req.body.contacts.length; i++)
		if(req.body.contacts[i].firstName && req.body.contacts[i].lastName && req.body.contacts[i].email && req.body.contacts[i].phone)
			contacts.push(req.body.contacts[i])

	if(!checkEmailForm(req.body.contacts[0].email))
		return res.status(400).json({message: 'BAD EMAIL FORM! try again'})

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
					return res.status(400).json({message: 'No key found for that jwt or no used'})
				if(result.used)
					return res.status(400).json({message: 'This key has already been used'})
				//check two leagues if they are valid combination of leagues
				db.collection('leagues').findOne(
					{
						_id: req.body.weekPick1, //I could also ask ti to query for slots
						'leagueInfo.week': 1
					},
					(err, result1) =>{
						if(err)
							return res.status(500).json({message: 'some error getting meet1'})
						if(!result1)
							return res.status(400).json({message: 'invalid meet1, not found'})
						db.collection('leagues').findOne(
							{
								_id: req.body.weekPick2,
								'leagueInfo.week': 2
							},
							(err, result2) =>{
								if(err)
									return res.status(500).json({message: 'some error getting meet2'})
								if(!result2)
									return res.status(400).json({message: 'invalid meet2, not found'})
								db.collection('leagues').findOne(
									{
										_id: req.body.weekPick3,
										'leagueInfo.week': 3
									},
									(err, result3) =>{
										if(err)
											return res.status(500).json({message: 'some error getting meet3'})
										if(!result3)
											return res.status(400).json({message: 'invalid meet3, not found'})
										db.collection('leagues').findOne(
											{
												_id: req.body.weekPick4,
												'leagueInfo.week': 4
											},
											(err, result4) =>{
												if(err)
													return res.status(500).json({message: 'some error getting meet4'})
												if(!result4)
													return res.status(400).json({message: 'invalid meet4, not found'})
												if( //condituions to fail!
													result1.leagueInfo.week != 1 || 
													result2.leagueInfo.week != 2 ||
													result3.leagueInfo.week != 3 ||
													result4.leagueInfo.week != 4) //each week needs to be either 1 or 2 and cannot be same
													return res.status(400).json({message: 'weeks are either not equal to picks'})
												if(result1.slots >= 14 || result2.slots >= 14 || result3.slots >= 14 || result4.slots >= 14) //check if full
													return res.status(400).json({message: 'either meet week 1, 2, 3, or 4 is full'})
												if(result1.leagueInfo.leagueName != result4.leagueInfo.leagueName) //if the events are not the same league
													return res.status(400).json({message: 'events 1 and 4 are not part of the same league'})
												//all is good lets go boiz!
												db.collection('socials').updateOne(
													{
														_id: Number(decoded.teamNumber)	//team number
													},
													{
														$set: {
															_id: Number(decoded.teamNumber),	//team number
															contacts: req.body.contacts,
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
																_id: req.body.weekPick1
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
																		_id: req.body.weekPick2
																	},
																	{
																		$inc: {slots: 1},
																		$push: {teams: Number(decoded.teamNumber)}
																	},
																	(err, result) => {
																		if(err)
																			return res.status(500).json({message: 'some error setting league2 info'})
																		console.log('making the leagues2', result.result)
																		//league 3
																		db.collection('leagues').updateOne(
																			{
																				_id: req.body.weekPick3
																			},
																			{
																				$inc: {slots: 1},
																				$push: {teams: Number(decoded.teamNumber)}
																			},
																			(err, result) =>{
																				if(err)
																					return res.status(500).json({message: 'some error setting league3 info'})
																				console.log('making the leagues3', result.result)
																				//league 4
																				db.collection('leagues').updateOne(
																					{
																						_id: req.body.weekPick4
																					},
																					{
																						$inc: {slots: 1},
																						$push: {teams: Number(decoded.teamNumber)}
																					},
																					(err, result) =>{
																						if(err)
																							return res.status(500).json({message: 'some error setting league4 info'})
																						console.log('making the leagues4', result.result)
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
																								nodemailer.createTestAccount((err, account) => {		//can be moved apart when new api is created
																									const transporter = nodemailer.createTransport({
																										service: config.nodemailer.service,
																										auth:{
																											user: config.nodemailer.email,
																											pass: config.nodemailer.password
																										}
																									})

																									const mailContent = generateEmailContentConfirm(
																										decoded.teamNumber,
																										result1.leagueInfo.leagueName,
																										result1.leagueInfo.location,
																										result1.leagueInfo.date,
																										result1.leagueInfo.address,
																										result1.leagueInfo.time.start + ' - ' + result1.leagueInfo.time.end,
																										result2.leagueInfo.location,
																										result2.leagueInfo.date,
																										result2.leagueInfo.address,
																										result2.leagueInfo.time.start + ' - ' + result2.leagueInfo.time.end,
																										result3.leagueInfo.location,
																										result3.leagueInfo.date,
																										result3.leagueInfo.address,
																										result3.leagueInfo.time.start + ' - ' + result3.leagueInfo.time.end,
																										result4.leagueInfo.location,
																										result4.leagueInfo.date,
																										result4.leagueInfo.address,
																										result4.leagueInfo.time.start + ' - ' + result4.leagueInfo.time.end
																									)

																									transporter.sendMail({
																										from: config.nodemailer.name,
																										to: req.body.contacts[0].email,
																										subject: mailContent.subject,
																										html: mailContent.html
																									}, 
																										(err, info) =>{
																											if(err)
																												return res.status(400).json({message: 'BAD! invalid email/email not sent! WHO HAS AUTH!?'})
																											console.log('Message sent: %s', info.messageId)
																											res.status(200).json({message: 'good'})
																										}
																									)
																								})
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

function checkEmailForm(email){
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(String(email).toLowerCase())
}

function generateEmailContentConfirm(teamNumber, leagueName, meetLocation1, meetDate1, meetAddress1, meetTime1, meetLocation2, meetDate2, meetAddress2, meetTime2, meetLocation3, meetDate3, meetAddress3, meetTime3, meetLocation4, meetDate4, meetAddress4, meetTime4){
	return {
		subject: 'SDFTC 2018-2019 League Selection Confirmation for Team ' + teamNumber,
		html: `<table role="presentation" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
			style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto;max-width:600px;table-layout:fixed!important">
			<tbody>
				<tr>
					<td style="padding:20px 0;text-align:center" align="center">
						<a href="https://juicydata.info/" style="color:#fa9235;outline:0" target="_blank">
							<img src="https://juicydata.info/assets/logo-text.png" aria-hidden="true" width="220" height="54"
								border="0" style="font-family:sans-serif;font-size:15px;height:auto;line-height:20px;outline:0">
						</a>
					</td>
				</tr>
			</tbody>
		</table>
		<div style="font-family:'Helvetica Neue','Arial',sans-serif;font-size:17px;line-height:1.45;margin:auto;max-width:600px">
			<table role="presentation" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" align="center" width="100%"
				style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto;max-width:600px;table-layout:fixed!important">
				<tbody>
					<tr>
						<td bgcolor="#ffffff">
							<table role="presentation" aria-hidden="true" cellspacing="0" cellpadding="0" border="0" width="100%"
								style="border-collapse:collapse!important;border-spacing:0!important;margin:0 auto;table-layout:fixed!important;font-size:17px;line-height:1.45">
								<tbody>
									<tr>
										<td style="color:#444444;padding:0 20px 20px">
											Hi <strong>Team ` + teamNumber + `!</strong>
											<br>
											<br>
											This is a confirmation of the events and league you selected for the <strong>2018-2019
												San Diego FTC Rover Ruckus Season.</strong> Please remember that each team will be 
												required to provide one volunteer for each event they attend. Tournament hosts will 
												be sending you additional emails about your tournaments as they get closer.
											<br>
											<br>
											League: <strong>` + leagueName + `</strong>
											<br>
											<br>
											<strong>Meet 1: </strong>
											<br>
											Location: <strong>` + meetLocation1 + `</strong>
											<br>
											Date: <strong>` + meetDate1 + `</strong>
											<br>
											Address: <strong>` + meetAddress1 + `</strong>
											<br>
											Time: <strong>` + meetTime1 + `</strong>
											<br>
											<br>
											<strong>Meet 2: </strong>
											<br>
											Location: <strong>` + meetLocation2 + `</strong>
											<br>
											Date: <strong>` + meetDate2 + `</strong>
											<br>
											Address: <strong>` + meetAddress2 + `</strong>
											<br>
											Time: <strong>` + meetTime2 + `</strong>
											<br>
											<br>

											<strong>Meet 3: </strong>
											<br>
											Location: <strong>` + meetLocation3 + `</strong>
											<br>
											Date: <strong>` + meetDate3 + `</strong>
											<br>
											Address: <strong>` + meetAddress3 + `</strong>
											<br>
											Time: <strong>` + meetTime3 + `</strong>
											<br>
											<br>

											<strong>Meet 4: </strong>
											<br>
											Location: <strong>` + meetLocation4 + `</strong>
											<br>
											Date: <strong>` + meetDate4 + `</strong>
											<br>
											Address: <strong>` + meetAddress4 + `</strong>
											<br>
											Time: <strong>` + meetTime4 + `</strong>
											<br>
											<br>

											Good luck and have fun this season!
											<br>
											<br>
											Regards,
											<br>
											The Juicy Data Team

											<br>
											<br>
											If you have any questions, comments, concerns, or come across any errors, please do
											not reply to this email. Send us an email at <a href="mailto:juicydatainfo@gmail.com">juicydatainfo@gmail.com.</a>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</div>`
	}
}