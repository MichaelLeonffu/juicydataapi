//in collections leagues
{
	_id: 'abc',		//league ID
	leagueInfo: {
		location: 'abc',
		address: 'abc',
		date: 'abc',
		time: {
			start: 'abc',
			end: 'abc'
		},
		week: 123, //1 or 2
		leagueName: 'abc' //name of that league
	},
	slots: 123,		//how many filled in slots
	teams: [123, 123, 123, ]	//teams which signed up for this
}

//in collection socials
{
	_id: 123,	//team number
	facebook: 'abc',	//links
	twitter: 'abc',
	instagram: 'abc',
	website: 'abc',
	logo: 'abc',		//file name
	contacts: [
		{	//first one is required
			firstName: 'abc',
			lastName: 'abc',
			email: 'abc',
			phone: 'abc'
		},
	]
}

//in collection leagueRegistrationKey
{
	_id: 123,	//teamNumber
	name: 'abc',
	key: 'abc',
	email: 'abc',
	used: false	//turns true when used
}

//in collection teamsToSelect
{
	_id: 123, //teamNumber
	name: 'abc',
	email: 'abc'
}