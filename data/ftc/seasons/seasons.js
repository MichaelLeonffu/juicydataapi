//seasons by Michael Leonffu

const MongoClient 	= require('mongodb').MongoClient
const configDB 		= require('./../../../config').mongodb
const assert 		= require('assert')

MongoClient.connect(configDB.url, function(err, client){
	console.log('Established Database Connection: ', configDB)
	console.log('\nReading Data:')

	if(data.length <= 0)
		console.log('No season data found!')			//should end here

	console.log('Season Data Count: ' + data.length + '\n\n' + 'Data:')
	data.forEach((seasonData) => {
		console.log(seasonData._id, seasonData.name)
	})

	assert.equal(null, err)
	var db = client.db(configDB.db)

	console.log('\nStarting Upload: ')
	saveSeasonData(data, db, client)
})

function saveSeasonData(seasonData, db, client){
	if(seasonData.length <= 0){
		return
	}else
		db.collection('seasons').save(seasonData[0], (err, result) => {
			if(err)
				console.log(err)
			console.log(seasonData[0]._id, seasonData[0].name)
			console.log(result.result)
			seasonData.shift()
			saveSeasonData(seasonData, db, client)
			console.log("Done!") //fix this last bit here latter it loops!
			return client.close()
		})
}

// [
// 	{
// 		_id:{
// 			season: 'abc',			//as 2017-2018
// 			first: 'abc'			//as fll, ftc, frc
// 		},
// 		name: 'abc', 				//of season game i.e Block Party 
// 		description: 'abc',			//short description of the season game
// 		game:[
// 			{
// 				period: 'abc',		//auto, driver, or end
// 				name: 'abc',		//name of the game element: jewel/glyph/keys etc
// 				description: 'abc',	//describes the game element
// 				displayName: 'abc',	//shorter name for tables
// 				abbreviation: 'abc',//even shorter way to name the game element
// 				conditions: 'abc',	//certain conditions that can be described; i.e this cannot be this when game element this is that
// 				type: 'abc', 		//boolean, number, other?
// 				value: 123,			//how many points is this game element worth
// 				validation: {
// 					min: 123,		//min value
// 					max: 123		//max value
// 				}
// 			}
// 		]
// 	}
// ]

//add all known data for seasons here in order to init it into db

const data = [
	{
		_id:{
			season: '2017-2018',
			first: 'ftc'
		},
		name: 'Relic Recovery',
		description: 'ADD SOEMTHING HERE FOR ME PLS',
		game:[
			{
				period: 'auto',
				name: 'jewel',
				description: 'One Jewel remains on the Platform.',
				displayName: 'Jewels',
				abbreviation: 'JWL',
				conditions: 'none',
				type: 'number',
				value: 30,
				validation: {
					min: 0,
					max: 4
				}
			},
			{
				period: 'auto',
				name: 'glyph',
				description: 'Glyph Scored in Cryptobox.',
				displayName: 'Glyphs',
				abbreviation: 'GLF',
				conditions: 'There must be at least as many Glyphs scored as there are keys scored in auto',
				type: 'number',
				value: 15,
				validation: {
					min: 0,
					max: 24
				}
			},
			{
				period: 'auto',
				name: 'key',
				description: 'Glyph Bonus for a correct Cryptobox Key',
				displayName: 'Keys',
				abbreviation: 'KEY',
				conditions: 'There must be at least one Glyph scored per key scored',
				type: 'number',
				value: 30,
				validation: {
					min: 0,
					max: 2
				}
			},
			{
				period: 'auto',
				name: 'park',
				description: 'Robot Parked In Safe Zone',
				displayName: 'Park',
				abbreviation: 'PRK',
				conditions: 'none',
				type: 'number',
				value: 10,
				validation: {
					min: 0,
					max: 2
				}
			},
			{
				period: 'driver',
				name: 'glyph',
				description: 'Glyph Scored in Cryptobox',
				displayName: 'Glyphs',
				abbreviation: 'GLF',
				conditions: 'Must be at least three for each row and four for each column',
				type: 'number',
				value: 2,
				validation: {
					min: 0,
					max: 24
				}
			},
			{
				period: 'driver',
				name: 'row',
				description: 'Glyph Completed Row of 3',
				displayName: 'Rows',
				abbreviation: 'ROW',
				conditions: 'Must have three times as many Glyphs as Rows completed',
				type: 'abc',
				value: 10,
				validation: {
					min: 0,
					max: 8
				}
			},
			{
				period: 'driver',
				name: 'column',
				description: 'Glyph Completed Column of 4',
				displayName: 'Columns',
				abbreviation: 'CLM',
				conditions: 'Must have four times as many Glyphs as Rows completed',
				type: 'number',
				value: 20,
				validation: {
					min: 0,
					max: 6
				}
			},
			{
				period: 'driver',
				name: 'cipher',
				description: 'Glyph Completed Cipher',
				displayName: 'Ciphers',
				abbreviation: 'CFR',
				conditions: 'Must be 12 times as many Glyphs as Ciphers completed',
				type: 'number',
				value: 30,
				validation: {
					min: 0,
					max: 2
				}
			},
			{
				period: 'end',
				name: 'relic1',
				description: 'Relic In Zone 1',
				displayName: 'Relic1',
				abbreviation: 'RL1',
				conditions: 'Total of all Relics must not be more than two',
				type: 'number',
				value: 10,
				validation: {
					min: 0,
					max: 2
				}
			},
			{
				period: 'end',
				name: 'relic2',
				description: 'Relic In Zone 2',
				displayName: 'Relic2',
				abbreviation: 'RL2',
				conditions: 'Total of all Relics must not be more than two',
				type: 'number',
				value: 20,
				validation: {
					min: 0,
					max: 2
				}
			},
			{
				period: 'end',
				name: 'relic3',
				description: 'Relic In Zone 3',
				displayName: 'Relic3',
				abbreviation: 'RL3',
				conditions: 'Total of all Relics must not be more than two',
				type: 'number',
				value: 40,
				validation: {
					min: 0,
					max: 2
				}
			},
			{
				period: 'end',
				name: 'relicUp',
				description: 'Relic Upright Bonus',
				displayName: 'Upright',
				abbreviation: 'RLU',
				conditions: 'Must equal total of amount of Relics in each Zone',
				type: 'number',
				value: 15,
				validation: {
					min: 0,
					max: 2
				}
			},
			{
				period: 'end',
				name: 'balanced',
				description: 'Robot Balanced',
				displayName: 'Balanced',
				abbreviation: 'BLC',
				conditions: 'none',
				type: 'number',
				value: 20,
				validation: {
					min: 0,
					max: 2
				}
			}
		]
	},
	{
		_id:{ //TDB
			season: '2019-2020',
			first: 'ftc'
		},
		name: 'Sky Stone',
		description: 'ADD SOEMTHING HERE FOR ME PLS',
		game:[
			{
				period: 'auto',
				name: 'reposition',
				description: 'Reposition',
				displayName: 'Reposition',
				abbreviation: 'RFB',
				conditions: 'TBD',
				type: 'number',
				value: 10,
				validation: {
					min: 0,
					max: 1
				}
			},
			{
				period: 'auto',
				name: 'skystones',
				description: 'Skystones',
				displayName: 'Skystones',
				abbreviation: 'SKY',
				conditions: 'TBD',
				type: 'number',
				value: 10,
				validation: {
					min: 0,
					max: 2
				}
			},
			{
				period: 'auto',
				name: 'deliverStones',
				description: 'DeliverStones',
				displayName: 'DeliverStones',
				abbreviation: 'DS',
				conditions: 'TBD',
				type: 'number',
				value: 2,
				validation: {
					min: 0,
					max: 4 //not sure about this one boiz
				}
			},
			{
				period: 'auto',
				name: 'stackedStones',
				description: 'StackedStones',
				displayName: 'StackedStones',
				abbreviation: 'SS',
				conditions: 'TBD',
				type: 'number',
				value: 4,
				validation: {
					min: 0,
					max: 4
				}
			},
			{
				period: 'auto',
				name: 'skybridge',
				description: 'Skybridge',
				displayName: 'Skybridge',
				abbreviation: 'SB',
				conditions: 'TBD',
				type: 'number',
				value: 5,
				validation: {
					min: 0,
					max: 2 //only counts once
				}
			},
			{
				period: 'driver',
				name: 'deliverStones',
				description: 'DeliverStones',
				displayName: 'DeliverStones',
				abbreviation: 'DDS',
				conditions: 'TBD',
				type: 'number',
				value: 1,
				validation: {
					min: 0,
					max: 60
				}
			},
			{
				period: 'driver',
				name: 'stackedStones',
				description: 'StackedStones',
				displayName: 'StackedStones',
				abbreviation: 'DSS',
				conditions: 'TBD',
				type: 'number',
				value: 1,
				validation: {
					min: 0,
					max: 1
				}
			},
			{
				period: 'driver',
				name: 'skyscraper',
				description: 'Skyscraper',
				displayName: 'Skyscraper',
				abbreviation: 'SCR',
				conditions: 'TBD',
				type: 'number',
				value: 2,
				validation: {
					min: 0,
					max: 64 //rough guess
				}
			},
			{
				period: 'end',
				name: 'capping',
				description: 'Capping',
				displayName: 'Capping',
				abbreviation: 'CAP',
				conditions: 'TBD',
				type: 'number',
				value: 5,
				validation: {
					min: 0,
					max: 2
				}
			},
			{
				period: 'end',
				name: 'level',
				description: 'Level',
				displayName: 'Level',
				abbreviation: 'LVL',
				conditions: 'TBD',
				type: 'number',
				value: 1,
				validation: {
					min: 0,
					max: 64 //rough guess
				}
			},
			{
				period: 'end',
				name: 'foundation',
				description: 'Foundation',
				displayName: 'Foundation',
				abbreviation: 'FND',
				conditions: 'TBD',
				type: 'number',
				value: 15,
				validation: {
					min: 0,
					max: 1
				}
			},
			{
				period: 'end',
				name: 'park',
				description: 'Park',
				displayName: 'Park',
				abbreviation: 'PRK',
				conditions: 'TBD',
				type: 'number',
				value: 5,
				validation: {
					min: 0,
					max: 2
				}
			}
		]
	}
]