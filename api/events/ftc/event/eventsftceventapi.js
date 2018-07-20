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

app.get('/api/events/ftc/event/uploadSchedule', (req, res) => {		//change this to post when done
	res.status(509).json({error: 'not implemented'})

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

})

app.get('/api/events/ftc/event/uploadSync', (req, res) => {		//change this to post when done

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
	// 				winner: 'abc', 	//'blue', 'red', 'tie'				//IFFY
	// 				score:{
	// 					auto:{
	// 						red: 123, //red alliance autonomous score
	// 						blue: 123 //blue alliance autonomous score
	// 					},
	// 					driver:{
	// 						red: 123, //red alliance tele-op score
	// 						blue: 123 //blue alliance tele-op score
	// 					},
	// 					end:{
	// 						red: 123, //red alliance end-game score
	// 						blue: 123 //blue alliance end-game score
	// 					},
	// 					total:{
	// 						red: 123, //red alliance total score
	// 						blue: 123 //blue alliance total score
	// 					},
	// 					penalty:{
	// 						red: 123, //red alliance penalty score
	// 						blue: 123 //blue alliance penalty score
	// 					},
	// 					final:{
	// 						red: 123, //red alliance final score
	// 						blue: 123 //blue alliance final score
	// 					}
	// 				}
	// 			}
	// 		]
	// 	},
	// 	middleware:{
	// 	}
	// }

	req.body = {
		seasonId:{
			season: '2017-2018',
			first: 'ftc'
		},
		eventKey: 'SOMEKEYHERE',
		gameData:[
			{
				matchInformation:{
					matchNumber: 123,
					robotAlliance: 'blue',
					teams: [123, 123]
				},
				"auto":{
					"jewel": 2,
					"glyph": 3,
					"key": 3,
					"park": 15
				},
				"driver":{
					"glyph": 10,
					"row": 3,
					"column": 2,
					"cipher": 30
				},
				"end":{
					"relic1": 1,
					"relic2": 9,
					"relic3": 7,
					"relicUp": 6,
					"balanced": 0
				}
			},
			{
				matchInformation:{
					matchNumber: 123,
					robotAlliance: 'red',
					teams: [123, 123]
				},
				"auto":{
					"jewel": 4,
					"glyph": 12,
					"key": 13,
					"park": 19
				},
				"driver":{
					"glyph": 18,
					"row": 23,
					"column": 26,
					"cipher": 27
				},
				"end":{
					"relic1": 24,
					"relic2": 29,
					"relic3": 21,
					"relicUp": 19,
					"balanced": 20
				}
			}
		]
	}

	db.collection('seasons').findOne(
		{
			_id: req.body.seasonId
		},
		{
			fields:{
				_id: 0,
				'game.name': 1,
				'game.period': 1,
				'game.validation': 1
			}
		},
		(err, result) => {
			if(err){
				console.log(err)
				res.status(500).send(err)
				return
			}
			interpretSeasonFormat(result)
		}
	)

	function interpretSeasonFormat(seasonData){
		//check if any season matched
		if(seasonData == null){
			res.status(406).json({error: 'no season found'})
			return
		}

		//first check if all data is present
		if(req.body.gameData != null && req.body.gameData.constructor === Array && req.body.gameData.length > 0)
			req.body.gameData.forEach((dataBit) => {
				seasonData.game.forEach((periodName) => {
					if(dataBit[periodName.period] == null){	//checks if period is undefined or null
						res.status(406).json({error: 'schema is not correct for season: missing period: ' + periodName.period})
						return
					}
					if(dataBit[periodName.period][periodName.name] == null){ //checks if name is undefined or null
						res.status(406).json({error: 'schema is not correct for season: missing name in ' + periodName.period + ': ' + periodName.name})
						return
					}
					if(!Number.isInteger(dataBit[periodName.period][periodName.name])){ //checks if value is a number
						res.status(406).json({error: 'data is not a number: ' + periodName.period + ': ' + periodName.name})
						return
					}
				})
			})
		else{
			res.status(406).json({error: 'no data found'})
			return
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

		var abstractData = []

		// {
		// 	matchInformation:{
		// 		matchNumber: 123,
		// 		robotAlliance: 'abc', 	//blue or red; with lower case
		// 		teams: [123, 123]
		// 	},
		// 	gameInformation:[123, 123, 123]
		// }

		//populate abstractData
		req.body.gameData.forEach((dataBit) => {
			let gameInformation = []
			for(let i = 0; i < seasonData.game.length; i++)
				gameInformation[i] = dataBit[seasonData.game[i].period][seasonData.game[i].name]
			abstractData.push(
				{
					matchInformation: dataBit.matchInformation,
					gameInformation: gameInformation
				}
			)
		})
		saveData(abstractData, validationLog)
	}

	function saveData(abstractData, validationLog){

		if(validationLog.length == 0)
			res.status(200).json({rawData: abstractData})
		else
			res.status(206).json({warning: validationLog})
	}

	// res.status(501).json({message: 'upload is not implemented yet'})

})



}