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
	}
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