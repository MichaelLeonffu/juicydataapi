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

//getting league information
app.get('/api/leagues/get-info', (req, res) => {

	// req.query = {
	// 	week : 123 //week number
	// }

	// res = {
	// 	leagues: [
	// 		{
	// 			leagueName: 'abc',
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
	// 						week: 123 //1 or 2
	// 					},
	// 					slots: 123,		//how many filled in slots
	// 				},
	// 			]
	// 		},
	// 	]
	// }

	if(typeof req.query.week == 'undefined')
		return res.status(400).json({message: 'BAD REQUEST NO WEEK QUERY'})

	console.log(req.query.week)

	db.collection('leagues').aggregate(
		[
			{$match:{
				'leagueInfo.week': Number(req.query.week)
			}},
			{$project:{
				teams: 0
			}},
			{$group:{
				_id:'$leagueInfo.leagueName',
				leagueMeets:{
					$addToSet:'$$ROOT'
				}
			}},
			{$project:{
				_id: 0,
				leagueName:'$_id',
				leagueMeets: '$leagueMeets'
			}}
		], 
		{
			teams: 0
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

	for(let i = 1; i < req.body.contacts.length; i++)
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
					return res.status(400).json({message: 'No key found for that jwt or no used'})
				if(result.used)
					return res.status(400).json({message: 'This key has already been used'})
				//check two leagues if they are valid combination of leagues
				db.collection('leagues').findOne(
					{
						_id: req.body.meetPick1
					},
					(err, result1) =>{
						if(err)
							return res.status(500).json({message: 'some error getting meet1'})
						if(!result1)
							return res.status(400).json({message: 'invalid meet1, not found'})
						db.collection('leagues').findOne(
							{
								_id: req.body.meetPick2
							},
							(err, result2) =>{
								if(err)
									return res.status(500).json({message: 'some error getting meet2'})
								if(!result2)
									return res.status(400).json({message: 'invalid meet2, not found'})
								if( //condituions to fail!
									(result1.leagueInfo.week != 1 && result1.leagueInfo.week != 2) || 
									(result2.leagueInfo.week != 1 && result2.leagueInfo.week != 2) ||
									result1.leagueInfo.week == result2.leagueInfo.week) //each week needs to be either 1 or 2 and cannot be same
									return res.status(400).json({message: 'weeks are either not 1 or 2; or the same value'})
								if(result1.slots >= 14 || result2.slots >= 14) //check if full
									return res.status(400).json({message: 'either meet week 1 or 2 is full'})
								if(result1.leagueInfo.leagueName != result2.leagueInfo.leagueName) //if the events are not the same league
									return res.status(400).json({message: 'events are not part of the same league'})
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
																		result1.leagueInfo.location,
																		result1.leagueInfo.date,
																		result1.leagueInfo.address,
																		result1.leagueInfo.time.start + ' - ' + result1.leagueInfo.time.end,
																		result2.leagueInfo.location,
																		result2.leagueInfo.date,
																		result2.leagueInfo.address,
																		result2.leagueInfo.time.start + ' - ' + result2.leagueInfo.time.end
																	)

																	transporter.sendMail(
																	{
																		from: config.nodemailer.name,
																		to: req.body.contacts[0].email,
																		subject: 'TEST: ' + mailContent.subject,
																		html: mailContent.html
																	}, 
																		(err, info) =>{
																			if(err)
																				return console.log(err)
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
	})
})

}

function generateEmailContentConfirm(teamNumber, meetLocation1, meetDate1, meetAddress1, meetTime1, meetLocation2, meetDate2, meetAddress2, meetTime2){
	return {
		subject: 'SDFTC 2018-2019 Registration Confirmation for Team ' + teamNumber,
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
											This is a confirmation of the events you registered for in the <strong>2018-2019
												San Diego FTC Rover Ruckus Season.</strong> Please note that these are only
											your <strong>2nd and 3rd meets.</strong> Look for other emails from the region for
											your 1st meet and league championship information.
											<br>
											<br>

											<strong>Meet 2: </strong>
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
											<strong>Meet 3: </strong>
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