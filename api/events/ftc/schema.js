//in collection 'seasons'
{
	_id:{
		season: 'abc',			//as 2017-2018
		first: 'abc'			//as fll, ftc, frc
	},
	name: 'abc', 				//of season game i.e Block Party 
	description: 'abc',			//short description of the season game
	game:[
		{
			period: 'abc',		//auto, driver, or end
			name: 'abc',		//name of the game element: jewekl/glyph/keys etc
			description: 'abc',	//describes the game element
			displayName: 'abc',	//shorter name for tables
			abbreviation: 'abc',//even shorter way to name the game element
			conditions: 'abc',	//certain conditions that can be described; i.e this cannot be this when game element this is that
			type: 'abc', 		//boolean, number, other?
			value: 123,			//how many points is this game element worth
			validation: {
				min: 123,		//min value
				max: 123		//max value
			}
		}
	]
}

//in collection 'schedules'
{
	_id: 'abc', //eventKey
	schedule:[
		{
			matchNumber: 123,		//match Number
			teams:{
				red1: {
					teamNumber: 123,
					surrogate: false //true if this team is surrogate
				},
				red2: {
					teamNumber: 123,
					surrogate: false
				},
				blue1: {
					teamNumber: 123,
					surrogate: false
				},
				blue2: {
					teamNumber: 123,
					surrogate: false
				}
			}
		}
	],
	metadata:{
		permissionLevel: 123,		//dictates the permissions required to edit this data
		archive: false,				//if true then only admins and mods can view
		log:{
			creator: ObjectId(), 	//IMMUTABLE mongodb unique id of user
			lastEditor: ObjectId(), //mongodb unique id of user
			birthTime: ISODate(),	//IMMUTABLE time of insertion
			lastUpdated: ISODate() 	//time of update
		}
	}
}

//in collection 'gameData'
{
	_id:{
		eventKey: 'abc',			//as found in events
		matchInformation:{
			matchNumber: 123,
			robotAlliance: 'abc', 	//blue or red; with lower case
			teams: [123, 123]
		},
		season:{					//just like season _id
			season: 'abc',			//as 2017-2018
			first: 'abc'			//as fll, ftc, frc
		}
	},
	gameInformation:{},				//schema as found in seasons
	metadata:{
		permissionLevel: 123,		//dictates the permissions required to edit this data
		archive: false,				//if true then only admins and mods can view
		log:{
			creator: ObjectId(), 	//IMMUTABLE mongodb unique id of user
			lastEditor: ObjectId(), //mongodb unique id of user
			birthTime: ISODate(),	//IMMUTABLE time of insertion
			lastUpdated: ISODate() 	//time of update
		}
	}
}

//in collection 'matchData'
{
	_id:{
		eventKey: 'abc',
		matchInformation:{
			matchNumber: 123,
			teams: {
				red1: 123,
				red2: 123,
				blue1: 123,
				blue2: 123
			}
		},							//comment: season isnt nessasary in matchData but helps.
		season:{					//just like season _id
			season: 'abc',			//as 2017-2018
			first: 'abc'			//as fll, ftc, frc
		}
	},
	resultInformation:{
		winner: 'abc', 	//'blue', 'red', 'tie'
		score:{
			auto:{
				red: 123, //red alliance autonomous score
				blue: 123 //blue alliance autonomous score
			},
			driver:{
				red: 123, //red alliance tele-op score
				blue: 123 //blue alliance tele-op score
			},
			end:{
				red: 123, //red alliance end-game score
				blue: 123 //blue alliance end-game score
			},
			total:{
				red: 123, //red alliance total score
				blue: 123 //blue alliance total score
			},
			penalty:{
				red: 123, //red alliance penalty score
				blue: 123 //blue alliance penalty score
			},
			final:{
				red: 123, //red alliance final score
				blue: 123 //blue alliance final score
			}
		}
	},
	metadata:{
		permissionLevel: 123,		//dictates the permissions required to edit this data
		archive: false,				//if true then only admins and mods can view
		log:{
			creator: ObjectId(), 	//IMMUTABLE mongodb unique id of user
			lastEditor: ObjectId(), //mongodb unique id of user
			birthTime: ISODate(),	//IMMUTABLE time of insertion
			lastUpdated: ISODate() 	//time of update
		}
	}
}

//in collection 'events'
{
	_id: 'abc', 					//20172018-ABCD-ABCD where ABCD are 4 characters long depending on OFFICAL event name; for non offical events: auto generated number is made
	date: ISODate(), 				//ISO Date of the date of the event at 12am
	eventName: 'abc',				//common name of the event
	description: 'abc',				//short description of event
	locationID: ObjectId(), 		//ID of the location in the 'locations' collection
	season:{						//as season _id in seasons
		season: 'abc',				//as 2017-2018
		first: 'abc'				//as fll, ftc, frc
	},
	offical: true, 					//false if event is private and for personal use
	seriesType: 'abc',				//league, regional, private, etc (add more latter)
	region: 'abc',					//spesific pharse relating this event to other events of the same series; this similar to _id; i.e sanDiego
	administration:{
		coordinator: ObjectId(), 	//mongodb unique id of user
		moderators:[
			ObjectId() 				//mongodb unique id of user
		],
		scorekeepers:[
			ObjectId() 				//mongodb unique id of user
		]
	},
	live: false,					//true if event is currently live; automatically turns on during date;
	active: false,					//true if a mod or approved account has approved this event to be real
	eventLog:{
		submissionDate: ISODate(),	//time event was submitted
		approvalDate: ISODate(),	//time event was aproved on
		approvedBy: ObjectId(), 	//mongodb unique id of user
	}
	teamsList:[123, 123, 123],		//list of teams in this event
	metadata:{
		permissionLevel: 123,		//dictates the permissions required to edit this data
		archive: false,				//if true then only admins and mods can view
		log:{
			creator: ObjectId(), 	//IMMUTABLE mongodb unique id of user
			lastEditor: ObjectId(), //mongodb unique id of user
			birthTime: ISODate(),	//IMMUTABLE time of insertion
			lastUpdated: ISODate() 	//time of update
		}
	}
}

//in collection 'eventInformation'
{
	//for details of the event transpireing
}

//in collection 'locations'
{
	_id: ObjectId(),
	name: 'abc',		//name of the location exmaple: Sage Creek High School
	address:{			//if value is missing, use null
		number: 123,	//address number?
		street: 'abc',	//street
		zip: 123,		//postal zip
		city: 'abc',	//city
		state: 'abc',	//state (CA)
		country: 'abc'	//usa
	},
	metadata:{
		permissionLevel: 123,		//dictates the permissions required to edit this data
		archive: false,				//if true then only admins and mods can view
		log:{
			creator: ObjectId(), 	//IMMUTABLE mongodb unique id of user
			lastEditor: ObjectId(), //mongodb unique id of user
			birthTime: ISODate(),	//IMMUTABLE time of insertion
			lastUpdated: ISODate() 	//time of update
		}
	}
}

//in collection 'statistics'
{
	_id: 'abc',								//eventKey
	lastUpdated: ISODate(), 				//Time of insert/update
	statistics:[
		{
			algorithm: 'abc',				//name of the algorithm used to generate thses stats; OPR CCWM etc
			status: 123,					//status codes...
			efficiency: .123,				//0-1 algorithm self evaluation
			lastUpdated: ISODate(), 		//Time of insert/update
			stats:[
				{
					teamNumber: 123,		//team number
					total: .123,			//for OPR this would be total OPR
					auto: .123,
					driver: .123,
					end: .123,
					game: [.123, .123, .123]	//for each game element
				}
			]
		}
	]
}

//in collection 'rankings'
{
	_id: 'abc',								//eventKey
	lastUpdated: ISODate(), 				//Time of insert/update
	rankings:[
		{
			protocal: 'abc',				//leaguemeet/etc have differnt protocals
			status: 123,					//status codes...
			lastUpdated: ISODate(), 		//Time of insert/update
			ranks:[
				{
					teamNumber: 123,		//team number
					rank: 123,
					record:{
						wins: 123,
						losses: 123,
						ties: 123
					},
					qualifyingPoints: 123,
					rankingPoints: 123
				}
			]
		}
	]
}

//in collection 'matchHistory'
{
	_id: 'abc',							//eventKey
	lastUpdated: ISODate(), 			//Time of insert/update
	status: 123,						//status codes...
	matchHistory:[
		{
			matchNumber: 123,
			isMatchDone: false,			//no data on match
			winner: 'abc', 				//blue or red
			red:{
				team1:{
					teamNumber: 123,
					surrogate: false	//true if team is playing as surrogate
				},
				team2:{
					teamNumber: 123,
					surrogate: false	//true if team is playing as surrogate
				},
				result:{
					total: 123,			//0 or null if match is incomplete
					penalty: 123,
					final: 123
				},
				game:[123, 123, 123]	//gamedata; empty if match not complete
			},
			blue:{
				team1:{
					teamNumber: 123,
					surrogate: false	//true if team is playing as surrogate
				},
				team2:{
					teamNumber: 123,
					surrogate: false	//true if team is playing as surrogate
				},
				result:{
					total: 123,			//0 or null if match is incomplete
					penalty: 123,
					final: 123
				},
				game:[123, 123, 123]	//gamedata; empty if match not complete
			}
		}
	]
}

//in collection 'algorithms'
{
	_id:{
		name: 'abc',			//example: Offensive Power Rating
		version: 123
	},
	shotname: 'abc',			//example: OPR
	description: 'abc',
	permissionLevel: 123		//which users can use this
}

//in collection 'predictions'
{
	//UNDER CONSTRUCTION; predicts similarly as algorhithm in stats; via differnt allgorithms per each amtch
}

//in collection 'apiKeys'
{
	_id:{
		//still under development
	},
	metadata:{
		permissionLevel: 123,		//dictates the permissions required to edit this data
		archive: false,				//if true then only admins and mods can view
		log:{
			creator: ObjectId(), 	//IMMUTABLE mongodb unique id of user
			lastEditor: ObjectId(), //mongodb unique id of user
			birthTime: ISODate(),	//IMMUTABLE time of insertion
			lastUpdated: ISODate() 	//time of update
		}
	},
	key: 'abc'	//the key itself
}

//in collection 'teams'
{
	_id: 123,					//team Number
	name: 'abc',				//team name
	school: 'abc',				//afflication
	city: 'abc',				//city name
	state: 'abc',				//state
	country: 'abc',				//country abrviation
	rookie: 123,				//year team was established; 0 if no year
	socials:{
		contacts:[ObjectId(), ObjectId(), ObjectId(),], //contacts, where primary is the first one
		facebook: 'abc',
		instagram: 'abc',
		twitter: 'abc',
		website: 'abc',
		logo: 'abc',			//image location using image logic TODO.
	}
}