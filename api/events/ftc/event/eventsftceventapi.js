//eventsftceventapi by Michael Leonffu

module.exports = function(config, app, db){

app.get('/api/events/ftc/event', (req, res) => {
	res.status(200).json({message: 'events ftc event api home'})
})

//Connecting all APIs

// require('./event/eventsftceventapi')(config, app, db)

app.get('/api/events/ftc/event/plant', (req, res) => {
	var saplingSpace = Math.random() * 10000
	var saplings = ''
	for(let i = 0; i < saplingSpace; i++){
		if(Math.random() > 0.5)
			saplings += '🌱'
		else
			saplings += '&nbsp'
	}
	res.status(201).send(saplings)
})

app.get('/api/events/ftc/event/fetch_trees', (req, res) => {
	var treeSpace = Math.random() * 10000
	var trees = ''
	for(let i = 0; i < treeSpace; i++){
		if(Math.random() > 0.5)
			trees += randomTree()
		else
			trees += '&nbsp'
	}

	function randomTree(){
		if(Math.random() > 0.5){
			if(Math.random() > 0.5)
				return '🌳'
			else
				return '🎄'
		}else{
			if(Math.random() > 0.5)
				return '🌲'
			else
				return '🌴'
		}
	}
	res.status(201).send(trees)
})

app.get('/api/events/ftc/event/read', (req, res) => {

	db.collection('eventOut').findOne(
		{
			_id: req.query.eventId
		},
		(err, eventOut) => {
			if(err)
				return res.status(500).send(err)
			if(eventOut === null)
				res.status(400).json({error:'Event not found'})
			else
				res.status(200).json(eventOut)
		}
	)
})

app.post('/api/events/ftc/event/uploadSchedule', (req, res) => {

	// res = {
	// 	_id: 'abc', 					//eventKey
	// 	schedule:[
	// 		{
	// 			matchNumber: 123,		//match Number
	// 			teams:{
	// 				red1: {
	// 					teamNumber: 123,
	// 					surrogate: false //true if this team is surrogate
	// 				},
	// 				red2: {
	// 					teamNumber: 123,
	// 					surrogate: false
	// 				},
	// 				blue1: {
	// 					teamNumber: 123,
	// 					surrogate: false
	// 				},
	// 				blue2: {
	// 					teamNumber: 123,
	// 					surrogate: false
	// 				}
	// 			}
	// 		}
	// 	]
	// }

	//midleware someplace in the middle there

	//$eq: req.query.teamNumber
	db.collection('schedules').save(req.body, {w:1}, function(err, result){
		if(err)
			return res.status(500).json({message: 'something is wrong'})
		if(result.result.ok == 1)
			return res.status(200).json({message: 'got It'})
		else
			return res.status(500).json({message: 'result is not ok'})
	})

})

app.post('/api/events/ftc/event/uploadSync', (req, res) => {		//change this to post when done

	// req = {
	// 	body:{
	// 		seasonId:{			//as _id for seasons
	// 			season: 'abc',
	// 			first: 'abc'
	// 		},
	// 		eventKey: 'abc',
	// 		gameData:[
	// 			{
	// 				matchInformation:{
	// 					matchNumber: 123,
	// 					robotAlliance: 'abc',		//blue or red
	// 					teams: [123, 123]
	// 				},
	// 				//Schema of this is as found in /api/events/ftc/seasons
	// 			}
	// 		],
	// 		matchData:[
	// 			{
	// 				matchInformation:{
	// 					matchNumber: 123,
	// 					teams: {
	// 						red1: 123,
	// 						red2: 123,
	// 						blue1: 123,
	// 						blue2: 123
	// 					}
	// 				},
	// 				resultInformation:{
	// 					score:{
	// 						penalty:{
	// 							red: 123, //red alliance penalty score
	// 							blue: 123 //blue alliance penalty score
	// 						}
	// 					}
	// 				}
	// 			}
	// 		]
	// 	},
	// 	middleware:{
	// 	}
	// }

	// req.body = {
	// 	seasonId:{
	// 		season: '2017-2018',
	// 		first: 'ftc'
	// 	},
	// 	eventKey: 'SOMEKEYHERE',
	// 	gameData:[
	// 		{
	// 			matchInformation:{
	// 				matchNumber: 123,
	// 				robotAlliance: 'blue',
	// 				teams: [123, 123]
	// 			},
	// 			"auto":{
	// 				"jewel": 2,
	// 				"glyph": 1,
	// 				"key": 0,
	// 				"park": 1
	// 			},
	// 			"driver":{
	// 				"glyph": 10,
	// 				"row": 3,
	// 				"column": 1,
	// 				"cipher": 0
	// 			},
	// 			"end":{
	// 				"relic1": 1,
	// 				"relic2": 0,
	// 				"relic3": 0,
	// 				"relicUp": 1,
	// 				"balanced": 1
	// 			}
	// 		},
	// 		{
	// 			matchInformation:{
	// 				matchNumber: 123,
	// 				robotAlliance: 'red',
	// 				teams: [123, 123]
	// 			},
	// 			"auto":{
	// 				"jewel": 2,
	// 				"glyph": 2,
	// 				"key": 1,
	// 				"park": 0
	// 			},
	// 			"driver":{
	// 				"glyph": 3,
	// 				"row": 1,
	// 				"column": 0,
	// 				"cipher": 0
	// 			},
	// 			"end":{
	// 				"relic1": 1,
	// 				"relic2": 0,
	// 				"relic3": 0,
	// 				"relicUp": 1,
	// 				"balanced": 2
	// 			}
	// 		}
	// 	],
	// 	matchData:[
	// 		{
	// 			matchInformation:{
	// 				matchNumber: 123,
	// 				teams: {
	// 					red1: 123,
	// 					red2: 123,
	// 					blue1: 123,
	// 					blue2: 123
	// 				}
	// 			},
	// 			resultInformation:{
	// 				score:{
	// 					penalty:{ //total = partial + penalty: partial red + pentaly red
	// 						red: 123, //red alliance penalty score
	// 						blue: 123 //blue alliance penalty score
	// 					}
	// 				}
	// 			}
	// 		}
	// 	]
	// }

	db.collection('seasons').findOne(
		{
			_id: req.body.seasonId
		},
		{
			fields:{
				_id: 0,
				'game.name': 1,
				'game.period': 1,
				'game.value': 1,
				'game.validation': 1
			}
		},
		(err, result) => {
			if(err)
				return res.status(500).send(err)
			else
				interpretSeasonFormatGameData(result)
		}
	)

	function interpretSeasonFormatGameData(seasonData){
		//check if any season matched
		if(seasonData == null)
			return res.status(406).json({error: 'no season found'})

		//first check if all data is present
		try{
			if(req.body.gameData != null && req.body.gameData.constructor === Array && req.body.gameData.length > 0)
				req.body.gameData.forEach((dataBit) => {
					seasonData.game.forEach((periodName) => {
						if(dataBit[periodName.period] == null){	//checks if period is undefined or null
							throw {error: 'schema is not correct for season: missing period: ' + periodName.period}
						}
						if(dataBit[periodName.period][periodName.name] == null){ //checks if name is undefined or null
							throw {error: 'schema is not correct for season: missing name in ' + periodName.period + ': ' + periodName.name}
						}
						if(!Number.isInteger(dataBit[periodName.period][periodName.name])){ //checks if value is a number
							throw {error: 'data is not a number: ' + periodName.period + ': ' + periodName.name}
						}
					})
				})
			else
				throw {error: 'no game data found'}
		}catch(e){
			return res.status(406).json({error: e.error})
		}

		var validationLog = []

		// {
		// 	matchNumber: 123,
		// 	robotAlliance: 'abc',
		// 	issues:[
		// 		{
		// 			element: 'abc',	//period.element
		//			value: 123,
		// 			validation: {
		// 				min: 123,
		// 				max: 123
		// 			}
		// 		}
		// 	]
		// }

		//validate
		req.body.gameData.forEach((dataBit) => {
			let issues = []
			seasonData.game.forEach((periodNameValidation) => {
				if(dataBit[periodNameValidation.period][periodNameValidation.name] < periodNameValidation.validation.min || dataBit[periodNameValidation.period][periodNameValidation.name] > periodNameValidation.validation.max)
					issues.push(
						{
							element: periodNameValidation.period + '.' + periodNameValidation.name,
							value: dataBit[periodNameValidation.period][periodNameValidation.name],
							validation: periodNameValidation.validation

						}
					)
			})
			if(issues.length != 0){
				validationLog.push(
					{
						matchNumber: dataBit.matchInformation.matchNumber,
						robotAlliance: dataBit.matchInformation.robotAlliance,
						issues: issues
					}
				)
			}
		})

		// var abstractData = []

		// // {
		// // 	matchInformation:{
		// // 		matchNumber: 123,
		// // 		robotAlliance: 'abc', 	//blue or red; with lower case
		// // 		teams: [123, 123]
		// // 	},
		// // 	gameInformation:[123, 123, 123]
		// // }

		// //populate abstractData
		// req.body.gameData.forEach((dataBit) => {
		// 	let gameInformation = []
		// 	for(let i = 0; i < seasonData.game.length; i++)
		// 		gameInformation[i] = dataBit[seasonData.game[i].period][seasonData.game[i].name]
		// 	abstractData.push(
		// 		{
		// 			matchInformation: dataBit.matchInformation,
		// 			gameInformation: gameInformation
		// 		}
		// 	)
		// })
		// saveData(abstractData, validationLog)

		interpretSeasonFormatMatchData(seasonData, validationLog)
	}

	function interpretSeasonFormatMatchData(seasonData, validationLog){

		//check if matchdata
		if(req.body.matchData == null){
			res.status(406).json({error: 'no match data found'})
			return
		}

		//prep matchData
		req.body.matchData.forEach((matchDataBit) => {
			matchDataBit.resultInformation = {
				winner: 'error',
				score:{
					auto: {},
					driver: {},
					end: {},
					total: {},
					penalty: matchDataBit.resultInformation.score.penalty,
					final: {}
				}
			}
		})

		req.body.gameData.forEach((dataBit) => {
			let autoScore = 0
			let driverScore = 0
			let endScore = 0
			seasonData.game.forEach((periodNameValue) => {
				switch(periodNameValue.period){
					case 'auto':
						autoScore += dataBit[periodNameValue.period][periodNameValue.name] * periodNameValue.value
						break
					case 'driver':
						driverScore += dataBit[periodNameValue.period][periodNameValue.name] * periodNameValue.value
						break
					case 'end':
						endScore += dataBit[periodNameValue.period][periodNameValue.name] * periodNameValue.value
						break
					default:
						res.status(500).json({message: 'season data is wrong'})
				}
			})

			// req.body.matchData.forEach((matchDataBit) => {
			// 	if(matchDataBit.matchInformation.matchNumber == dataBit.matchInformation.matchNumber){
			// 		matchDataBit.resultInformation.score.auto[dataBit.matchInformation.robotAlliance] = autoScore
			// 		matchDataBit.resultInformation.score.driver[dataBit.matchInformation.robotAlliance] = driverScore
			// 		matchDataBit.resultInformation.score.end[dataBit.matchInformation.robotAlliance] = endScore
			// 		matchDataBit.resultInformation.score.total[dataBit.matchInformation.robotAlliance] = autoScore + driverScore + endScore
			// 		matchDataBit.resultInformation.score.final[dataBit.matchInformation.robotAlliance] = matchDataBit.resultInformation.score.penalty[dataBit.matchInformation.robotAlliance] + matchDataBit.resultInformation.score.total[dataBit.matchInformation.robotAlliance]
			// 		// break?
			// 	}
			// })

			for(let i = 0; i < req.body.matchData.length; i++)
				if(req.body.matchData[i].matchInformation.matchNumber == dataBit.matchInformation.matchNumber){
					req.body.matchData[i].resultInformation.score.auto[dataBit.matchInformation.robotAlliance] = autoScore
					req.body.matchData[i].resultInformation.score.driver[dataBit.matchInformation.robotAlliance] = driverScore
					req.body.matchData[i].resultInformation.score.end[dataBit.matchInformation.robotAlliance] = endScore
					req.body.matchData[i].resultInformation.score.total[dataBit.matchInformation.robotAlliance] = autoScore + driverScore + endScore
					req.body.matchData[i].resultInformation.score.final[dataBit.matchInformation.robotAlliance] = req.body.matchData[i].resultInformation.score.penalty[dataBit.matchInformation.robotAlliance] + req.body.matchData[i].resultInformation.score.total[dataBit.matchInformation.robotAlliance]
					break
				}

		})

		//matchdata find winners
		req.body.matchData.forEach((matchDataBit) => {
			matchDataBit.resultInformation.winner = matchDataBit.resultInformation.score.final.red == matchDataBit.resultInformation.score.final.blue? 'tie' : matchDataBit.resultInformation.score.final.red > matchDataBit.resultInformation.score.final.blue? 'red' : 'blue'
		})

		saveData(validationLog)
	}

	function saveData(validationLog){

		//game data
		// {
		// 	_id:{
		// 		eventKey: 'abc',			//as found in events
		// 		matchInformation:{
		// 			matchNumber: 123,
		// 			robotAlliance: 'abc', 	//blue or red; with lower case
		// 			teams: [123, 123]
		// 		},
		// 		season:{					//just like season _id
		// 			season: 'abc',			//as 2017-2018
		// 			first: 'abc'			//as fll, ftc, frc
		// 		}
		// 	},
		// 	gameInformation:{},				//schema as found in seasons
		// 	metadata:{
		// 		permissionLevel: 123,		//dictates the permissions required to edit this data
		// 		archive: false,				//if true then only admins and mods can view
		// 		log:{
		// 			creator: ObjectId(), 	//IMMUTABLE mongodb unique id of user
		// 			lastEditor: ObjectId(), //mongodb unique id of user
		// 			birthTime: ISODate(),	//IMMUTABLE time of insertion
		// 			lastUpdated: ISODate() 	//time of update
		// 		}
		// 	}
		// }

		var gameData = []

		//put into gameData shape for storage
		req.body.gameData.forEach((gameDataBit) => {
			gameData.push(
				{
					_id:{
						eventKey: req.body.eventKey,
						matchInformation: gameDataBit.matchInformation,
						season: req.body.seasonId
					},
					gameInformation: {
						auto: gameDataBit.auto,
						driver: gameDataBit.driver,
						end: gameDataBit.end
					}
				}
			)
		})

		//in collection 'matchData'
		// {
		// 	_id:{
		// 		eventKey: 'abc',
		// 		matchInformation:{
		// 			matchNumber: 123,
		// 			teams: {
		// 				red1: 123,
		// 				red2: 123,
		// 				blue1: 123,
		// 				blue2: 123
		// 			}
		// 		}
		// 	},
		// 	resultInformation:{
		// 		winner: 'abc', 	//'blue', 'red', 'tie'
		// 		score:{
		// 			auto:{
		// 				red: 123, //red alliance autonomous score
		// 				blue: 123 //blue alliance autonomous score
		// 			},
		// 			driver:{
		// 				red: 123, //red alliance tele-op score
		// 				blue: 123 //blue alliance tele-op score
		// 			},
		// 			end:{
		// 				red: 123, //red alliance end-game score
		// 				blue: 123 //blue alliance end-game score
		// 			},
		// 			total:{
		// 				red: 123, //red alliance total score
		// 				blue: 123 //blue alliance total score
		// 			},
		// 			penalty:{
		// 				red: 123, //red alliance penalty score
		// 				blue: 123 //blue alliance penalty score
		// 			},
		// 			final:{
		// 				red: 123, //red alliance final score
		// 				blue: 123 //blue alliance final score
		// 			}
		// 		}
		// 	},
		// 	metadata:{
		// 		permissionLevel: 123,		//dictates the permissions required to edit this data
		// 		archive: false,				//if true then only admins and mods can view
		// 		log:{
		// 			creator: ObjectId(), 	//IMMUTABLE mongodb unique id of user
		// 			lastEditor: ObjectId(), //mongodb unique id of user
		// 			birthTime: ISODate(),	//IMMUTABLE time of insertion
		// 			lastUpdated: ISODate() 	//time of update
		// 		}
		// 	}
		// }

		var matchData = []

		//put into matchData shape for storage
		req.body.matchData.forEach((matchDataBit) => {
			matchData.push(
				{
					_id:{
						eventKey: req.body.eventKey,
						matchInformation: matchDataBit.matchInformation,
						season: req.body.seasonId
					},
					resultInformation: matchDataBit.resultInformation
				}
			)
		})

		var util = require('util')
		// console.log(util.inspect(req.body, false, null))
		// console.log(util.inspect(gameData, false, null))
		// console.log(util.inspect(matchData, false, null))

		let status = {
			gameDataStat: gameData.length,
			matchDataStat: matchData.length,
			isDone: function isDone(){
				return this.gameDataStat === 0 && this.matchDataStat === 0;
			}
		}

		gameData.forEach((gameDat) =>{
			db.collection('gameData').save(gameDat, (err, result) => {
				if(err)
					return res.status(500).send(err)
				status.gameDataStat--
				if(status.isDone())
					finalStep(validationLog)
			})
		})

		matchData.forEach((matchDat) =>{
			db.collection('matchData').save(matchDat, (err, result) => {
				if(err)
					return res.status(500).send(err)
				status.matchDataStat--
				if(status.isDone())
					finalStep(validationLog)
			})
		})
	}

	function finalStep(validationLog){
		require('./../orangeFarm/orangeFarm')({db:db}, {orchard: req.body.eventKey, season: req.body.seasonId}, function(farmReport){
			console.log('farmReport:', farmReport, 'At:', new Date())
			//this is good
			if(validationLog.length == 0)
				res.status(200).json({message: "Anna Li!"})
			else
				res.status(206).json({warning: validationLog})
			//but when is it bad?
		})
	}

})



}