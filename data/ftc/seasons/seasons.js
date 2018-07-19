//seasons by Michael Leonffu

var MongoClient = require('mongodb').MongoClient	//CHANGE
var url = "mongodb://localhost:27017"	//CHANGE

//use config there;

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

const data:[
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
	}
]