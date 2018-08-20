//in 'users' collection
{
	_id: ObjectId(), //mongodb unique id of user
	email: 'abc',
	password: 'abc'
}

//in 'profiles' collection
{
	_id: ObjectId(), //same as user id
	name:{
		first: 'abc',
		last: 'abc'
	},
	rookieYear: 2015, // can be converted to/from total years of experience
	experience: 3 // years. Periodically updated based on rookieYear
	graduationYear: 2017, // can be converted to/from current year in school
	educationLevel: 'abc' // Periodically updated based on graduationYear
	gender: 'abc',
	firstInvolvement: ['abc'],
	firstProgram: ['abc']
}

//in 'tentative' collection
{
	_id: ObjectId(), 		//same as user id
	birthTime: ISODate(),	//time this became tenative
	user:{
		email: 'abc',
		password: 'abc'
	},
	profile:{
		name:{
			first: 'abc',
			last: 'abc'
		}
	}
}

//in 'personalization' collection
{
	experience: {
		type: 'number'
	},
	educationLevel: {
		type: 'choice'
		values: ['elementary', 'middle', 'high', 'graduated']
	},
	gender: {
		type: 'choice',
		values: ['male', 'female']
	},
	firstInvolvement: {
		type: 'array',
		values: ['student', 'alumni', 'mentor', 'parent', 'coach', 'other']
	},
	firstProgram: {
		type: 'array',
		values: ['FLL', 'FTC', 'FRC']
	}
}