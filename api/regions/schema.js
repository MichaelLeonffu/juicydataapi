//in collection 'regionsGroup'
{
	_id: 'abc',							//same as the inner regions ids
	name: 'abc',						//region group name
	regions:[							//ids of the regions
		{
			_id: 'abc',					//same as the regionsGroup
			authorizationType: 'abc',	//i.e 'offical'/'scrimage'
			season: 'abc',				//season for this region data
			seriesType: 'abc'			//'league', 'quailfyer', ...
		},
	],
	info:{
		admin: ObjectId(),				//user id
		createdOn: ISODate();
	},
	social:{
		image: 'abc',					//id location of the image data
		email: 'abc',					//email?
		other: 'abc'					//other socials
	}
}

//in collection 'regions'
{
	_id:{
		_id: 'abc',							//same as the regionsGroup
		authorizationType: 'abc',			//i.e 'offical'/'scrimage'
		season: 'abc',						//season for this region data
		seriesType: 'abc'					//'league', 'quailfyer', ...
	},
	name: 'abc',							//name of region;			if blank, asume the regionGroup name; i.e sd_ftc
	teams:[
		{
			group: 'abc',					//can be a name can be only 1 etc; any combination of group; group can be leagues
			teams:[123, 123, 123,]			//the teams in this group
		},
	],
	events:[
		{
			seriesValue: 123,				//i.e 1, 2, 3, ...
			seriesName: 'abc',				//i.e 'Week 1 League Meets', 'Week 1 League Meets: Turing', 'Week 2 Interleague Meets', ...
			events:['abc', 'abc', 'abc',]	//ids of events in this region
		},
	]
	//todo, add socials here; as an override to the socials above.
}

//in collection 'regionOut'
{
	_id:{
		_id: 'abc',							//same as the regionsGroup
		authorizationType: 'abc',			//i.e 'offical'/'scrimage'
		season: 'abc',						//season for this region data
		seriesType: 'abc'					//'league', 'quailfyer', ...
	},
	name: 'abc',							//name of region;			if blank, asume the regionGroup name; i.e sd_ftc
	teams:[
		{
			group: 'abc',					//can be a name can be only 1 etc; any combination of group; group can be leagues
			teams:[123, 123, 123,]			//the teams in this group
		},
	],
	events:[
		{
			seriesValue: 123,				//i.e 1, 2, 3, ...
			seriesName: 'abc',				//i.e 'Week 1 League Meets', 'Week 1 League Meets: Turing', 'Week 2 Interleague Meets', ...
			events:['abc', 'abc', 'abc',]	//ids of events in this region
		},
	],
	//todo, add socials here; as an override to the socials above.
	regionRanking:[
		{
			group: 'abc',					//can be a name, can be only 1 etc; any combination of group; group can be leagues
			ranking: [
				{
					teamNumber: 123,		//team number
					teamName: 'abc',		//team name
					rank: 123,
					qualifyingPoints: 123,	//AKA ranking points
					rankingPoints: 123		//AKA Tie Breaker Points
				},
			]
		}
	]
}