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
	}
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
	logo: 'abc'			//file name
}

//in collection leagueRegistrationKey
{
	_id: 'abc',	//key
	name: 'abc',
	teamNumber: 123,
	email: 'abc',
	used: false	//turns true when used
}