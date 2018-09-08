//in 'sessions' collection
{
	_id: ObjectId(),
	userId: ObjectId(),	//can be null? if no user
	requests:[
		ObjectId(),		//of each related request
	]
}

//in 'requests' collection
{
	_id: ObjectId(),
	sessionId: ObjectId(),
	time:{
		start: ISODate(),
		end: ISODate()
	},
	requestData:{
		baseUrl: 'abc',
		body:{
			toUrl: 'abc'
		},
		cookies:{
		},
		fresh: true,
		headers:{
			connection: 'abc',						//close
			'accept-encoding': 'abc',				//gzip, deflate
			'accept-language': 'abc',				//en-us
			'user-agent': 'abc',					//machine
			cookie: 'abc',							//cookies string
			'upgrade-insecure-requests': '123',		//number string?
			accept: 'abc',							//text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
			host: 'abc'								//localhost:4200
		},
		hostname: 'abc',		//localhost
		ip: 'abc',				//'::ffff:127.0.0.1'
		ips:[
		],
		method: 'abc',			//GET
		originalUrl: 'abc',		///api/test
		params:{
		},
		path: 'abc',			///api/test
		protocol: 'abc',		//http
		query:{
		},
		secure: true,
		signedCookies:{
		},
		stale: true,
		subdomains:[
		],
		xhr: true
	}
}