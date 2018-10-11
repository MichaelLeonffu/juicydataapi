//leaguesapi by Michael Leonffu

const jwt = require('jsonwebtoken')

module.exports = function(config, app, db){

app.get('/api/leagues', (req, res) => {
	res.status(200).json({message: 'leagues api home'})
})

//Connecting all APIs

// require('./ftc/eventsftcapi')(config, app, db)

//getting league information
app.get('/api/leagues/get-info', (req, res) => {

	// res = {
	// 	leagueSlotsInfo:[
	// 		{
	// 			leagueId: 'abc',
	// 			slotsFilled: 123
	// 		}
	// 	]
	// }

	db.collection('leagues').find({}, (err, result) => {
		if(err)
			return res.status(500).json({message: 'some error finding leagues'})
		result.toArray((err, results) => {
			var finalArray = []

			for(let i = 0; i < results.length; i++)
				finalArray[i] = {
					leagueId: results[i]._id,
					slotsFilled: results[i].slots
				}

			res.status(200).json({leagueSlotsInfo:finalArray})

		})
	})
})

//generate a api key (THIS IS SUOPSER RISKYYYY)
app.get('/api/leagues/generate-league-key', (req, res) => {

	// res.query = {
	// 	teamNumber: 123
	// }

	if(!req.query || !req.query.teamNumber)
		return res.status(503).json({message: 'no given teamnumber'})

	jwt.sign(
		{
			jti:Number(req.query.teamNumber),
			sub: 'teamNumber for League'
		},
		config.jwt.key,
		{
			algorithm: 'HS256'
		},
		(err, token) =>{
		if(err)
			return res.status(503).json({message: 'failed to generate jwt for user sign up'})

		res.status(200).json({token: token})
	})

})

// 1819-CASDW2-RR
// 1819-CASDW2-LJCD
// 1819-CASDW2-D39-1
// 1819-CASDW2-D39-2
// 1819-CASDW2-RD

// 1819-CASDW3-GRAUER
// 1819-CASDW3-MATER
// 1819-CASDW3-SET
// 1819-CASDW3-CAO
// 1819-CASDW3-SCHS


//signup for a league
app.post('/api/leagues/sign-up', (req, res) => {

	// req.body = req.query

	var validIds1 = [
		'1819-CASDW2-RR',
		'1819-CASDW2-LJCD',
		'1819-CASDW2-D39-1',
		'1819-CASDW2-D39-2',
		'1819-CASDW2-RD',
		'1819-CASDW3-SCHS'
	]

	var validIds2 = [
		'1819-CASDW3-GRAUER',
		'1819-CASDW3-MATER',
		'1819-CASDW3-SET',
		'1819-CASDW3-CAO',
		'1819-CASDW3-SCHS'
	]

	// req.body = {
	// 	jwt: 'abc',				//key!!!!!!!! jwt
	// 	facebook: 'abc',	//links
	// 	twitter: 'abc',
	// 	instagram: 'abc',
	// 	website: 'abc',
	// 	leaguePick1: 'abc',
	// 	leaguePick2: 'abc'
	// }

	console.log('reqsute body', req)

	if(!req.body)
		return res.status(503).json({message: 'incomplete data!'})

	jwt.verify(req.body.jwt, config.jwt.key, {algorithm: 'HS256'}, (err, decoded) => {	//algorithm should be in config as well
		if(err){
			console.log(err)
			res.status(406).send('token is bad')
			return
		}
		console.warn(decoded)
		console.log(decoded.jti)	//the team number

		var valid1 = false;
		var valid2 = false;

		//check if its a valid league selecttion1
		validIds1.forEach((leagueKey) => {
			if(req.body.leaguePick1 == leagueKey)
				valid1 = true;
		})

		//check if its a valid league selecttion2
		validIds2.forEach((leagueKey) => {
			if(req.body.leaguePick2 == leagueKey)
				valid2 = true;
		})

		if(!valid1 || !valid2)
			return res.status(500).json({message: 'the selected league dont count!!!!!!!!'})

		db.collection('socials').insertOne(
			{
				_id: decoded.jti,		//team number
				facebook: req.body.facebook,
				twitter: req.body.twitter,
				instagram: req.body.instagram,
				website: req.body.website
			}, 
		(err, result) => {
			if(err)
				return res.status(500).json({message: 'some error setting scoials'})
			console.log('making the socials', result)
			//league 1
			db.collection('leagues').updateOne(
				{
					_id: req.body.leaguePick1
				},
				{
					$inc: {slots: 1},
					$push: {teams: decoded.jti}
				},
			(err, result) => {
				if(err)
					return res.status(500).json({message: 'some error setting league1 info'})
				console.log('making the leagues1', result)
				//league 2
				db.collection('leagues').updateOne(
					{
						_id: req.body.leaguePick2
					},
					{
						$inc: {slots: 1},
						$push: {teams: decoded.jti}
					},
				(err, result) => {
					if(err)
						return res.status(500).json({message: 'some error setting league2 info'})
					console.log('making the leagues2', result)
					
					return res.status(200).json({message: 'good'})
				})
			})
		})
	})
})

}