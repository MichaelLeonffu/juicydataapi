//in the "users" collection
{
	_id: ObjectId(), //mongodb unique id of user
	email: 'abc',
	passowrd: 'abc'
}

//in the "profiles" collection
{
	_id: ObjectId(), //same as user id
	name: {
		first: 'abc',
		last: 'abc'
	}
}