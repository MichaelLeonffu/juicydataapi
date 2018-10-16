//generateLeagueRegistrationLinks by Michael Leonffu

const config 							= require('./../../config.js')
const MongoClient 						= require('mongodb').MongoClient
const configDB 							= config.mongodb
const jwt 								= require('jsonwebtoken')

data = [
	{name: 'Anna Li', email: 'AnnaLi@gmail.com', teamNumber: 12299},

	{name: 'Todd Lineback', email: 'tlineback@ljcds.org', teamNumber: 3650},
	{name: 'Morgan Brown', email: 'morganbrown@grauerschool.com', teamNumber: 3848},
	{name: 'Matthew Nilsen', email: 'mnilsen8@outlook.com', teamNumber: 4216},
	{name: 'Brooks Park', email: 'bpark@pacificridge.org', teamNumber: 4262},
	{name: 'Robert Swift', email: 'robert.swift@carlsbadusd.net', teamNumber: 5015},
	{name: 'Donald Brockett', email: 'brockett89@gmail.com', teamNumber: 5131},
	{name: 'Lindsay White', email: 'ki6lzn@gmail.com', teamNumber: 5135},
	{name: 'Martin Machniak', email: 'martin.machniak@navy.mil', teamNumber: 5136},
	{name: 'Stephen Yip-Wineman', email: 'stephenyipwineman@vistausd.org', teamNumber: 6016},
	{name: 'Neil McCurdy', email: 'neil.mccurdy@colemantech.org', teamNumber: 6074},
	{name: 'Douglas Smith', email: 'smithdouglasb@gmail.com', teamNumber: 6226},
	{name: 'Anthony Mauro', email: 'tony.mauro@sduhsd.net', teamNumber: 7159},
	{name: 'Patrick Hagarman', email: 'phagarman@sdjaschool.com', teamNumber: 7609},
	{name: 'Thomas Powell', email: 'tpowell66@cox.net', teamNumber: 7696},
	{name: 'Saied Moezzi', email: 'saied.moezzi@carlsbadusd.net', teamNumber: 8097},
	{name: 'Roger Gallegos', email: 'rg2010@yahoo.com', teamNumber: 8380},
	{name: 'David Warner', email: 'dwarner@rsf.k12.ca.us', teamNumber: 8606},
	{name: 'Peter Ellegaard', email: 'p.ellegaard@yahoo.com', teamNumber: 8742},
	{name: 'Robert Swift', email: 'robert.swift@carlsbadusd.net', teamNumber: 9049},
	{name: 'Francisco Ocampo Chavira', email: 'francisco.ocampo@cetys.mx', teamNumber: 9164},
	{name: 'Saied Moezzi', email: 'saied.moezzi@carlsbadusd.net', teamNumber: 9261},
	{name: 'Brooks Park', email: 'bpark@pacificridge.org', teamNumber: 9266},
	{name: 'Susan Domanico', email: 'sdomanico@ljcds.org', teamNumber: 9367},
	{name: 'Anthony Mauro', email: 'tony.mauro@sduhsd.net', teamNumber: 9837},
	{name: 'Amanda Beaumont', email: 'amanda.beaumont@tccs.org', teamNumber: 9892},
	{name: 'Monica Burick', email: 'burickfamily@gmail.com', teamNumber: 9902},
	{name: 'Robert Colatutto', email: 'rob.colatutto@gmail.com', teamNumber: 10092},
	{name: 'Martin Machniak', email: 'martin.machniak@navy.mil', teamNumber: 10390},
	{name: 'Alx Ramos', email: 'alxramos@gmail.com', teamNumber: 10793},
	{name: 'Saied Moezzi', email: 'saied.moezzi@carlsbadusd.net', teamNumber: 10809},
	{name: 'alexander szeto', email: 'adszeto@gmail.com', teamNumber: 11128},
	{name: 'Soon Lau', email: 'soonlau8@gmail.com', teamNumber: 11212},
	{name: 'Lindsay White', email: 'ki6lzn@gmail.com', teamNumber: 11285},
	{name: 'Sanja Zlatanovic', email: 'szlatanovic@gmail.com', teamNumber: 11288},
	{name: 'David Paxson', email: 'dpaxson@twinight.org', teamNumber: 11411},
	{name: 'Joseph Wetherell', email: 'jlwether@alum.mit.edu', teamNumber: 11656},
	{name: 'Wayne Solomon', email: 'warriorlord76@gmail.com', teamNumber: 12499},
	{name: 'David Warner', email: 'dwarner@rsf.k12.ca.us', teamNumber: 12605},
	{name: 'Anand Krishnan', email: 'anand_thonur@yahoo.com', teamNumber: 12666},
	{name: 'Joe Oliver', email: 'oliverj5150@cox.net', teamNumber: 12748},
	{name: 'LeAnn Erimli', email: 'bmms.ftc.robotics@gmail.com', teamNumber: 12778},
	{name: 'Edwin Luwa', email: 'edluwa@yahoo.com', teamNumber: 12823},
	{name: 'LeAnn Erimli', email: 'bmms.ftc.robotics@gmail.com', teamNumber: 13084},
	{name: 'Lay Lay', email: 'kylelay@yahoo.com', teamNumber: 13089},
	{name: 'Vincent Buntin', email: 'ovbuntin@gmail.com', teamNumber: 13145},
	{name: 'Babak Aryan', email: '6a6ak.aryan@gmail.com', teamNumber: 13185},
	{name: 'EMILY JULIAN-BOCANEGRA', email: 'aej002@gmail.com', teamNumber: 13200},
	{name: 'Namita Dandekar', email: 'namita_dandekar@yahoo.com', teamNumber: 13224},
	{name: 'Cassie Rivaldi', email: 'Cassie.rivaldi@cvesd.org', teamNumber: 14094},
	{name: 'Karen Miller', email: 'karen_miller@fastmail.fm', teamNumber: 14129},
	{name: 'Devin Breise', email: 'devin@breise.com', teamNumber: 14140},
	{name: 'Rexford Hill', email: 'codehenge@gmail.com', teamNumber: 14149},
	{name: 'Robert Colatutto', email: 'rob.colatutto@gmail.com', teamNumber: 14195},
	{name: 'Dadre Marie Rudolph', email: 'dadrerudolph@vistausd.org', teamNumber: 14205},
	{name: 'Dadre Marie Rudolph', email: 'dadrerudolph@vistausd.org', teamNumber: 14206},
	{name: 'hsiuchuan lee', email: 'smilinghc@yahoo.com', teamNumber: 14235},
	{name: 'Vicki Mazur', email: 'vmazur@classicalacademy.com', teamNumber: 14338},
	{name: 'Anna Quan', email: 'apquan@gmail.com', teamNumber: 14425},
	{name: 'Ganga Sanka', email: 'grsanka@gmail.com', teamNumber: 14429},
	{name: 'Jeremy Usher', email: 'jeremyu@yahoo.com', teamNumber: 14496},
	{name: 'Digamber Mithbawkar', email: 'digamberm@yahoo.co.uk', teamNumber: 14535},
	{name: 'Amit Goel', email: 'amigo1@gmail.com', teamNumber: 14564},
	{name: 'Emmanuel Pizano', email: 'epizano@guhsd.net', teamNumber: 14968},
	{name: 'Brian Mendoza', email: 'bmendoza@lsusd.net', teamNumber: 15000},
	{name: 'Alan Lewis', email: 'al5pbb@gmail.com', teamNumber: 15097},
	{name: 'Faye Li', email: 'Faye_Li@yahoo.com', teamNumber: 15146},
	{name: 'Priyanka chawla', email: 'pmchawla1223@gmail.com', teamNumber: 15171},
	{name: 'Andrea Cascia', email: 'andrea.cascia@oside.us', teamNumber: 15511},
	{name: 'Paul de la Houssaye', email: 'houssaye@gmail.com', teamNumber: 15554},
	{name: 'Andrea Cascia', email: 'andrea.cascia@oside.us', teamNumber: 201801007},
	{name: 'Michael Stephens', email: 'bowtiecobra@gmail.com', teamNumber: 2885},
	{name: 'Carlos Andreiu', email: 'candreiu18@gmail.com', teamNumber: 6003},
	{name: 'Mark Quan', email: 'markquansd@gmail.com', teamNumber: 4278}
]

// data = [{name: 'Anna Li', email: 'AnnaLi@gmail.com', teamNumber: 12299}]

MongoClient.connect(configDB.url, function(err, client){
	if(err)
		return console.log(err)
	const db = client.db(configDB.db)
	for(let i = 0; i < data.length; i++)
		generateLeagueRegistrationKey(config.jwt.key, data[i].name, data[i].email, data[i].teamNumber, (token) =>{
			db.collection('leagueRegistrationKey').insertOne(
				{
					_id: data[i].teamNumber,
					name: data[i].name,
					email: data[i].email,
					key: token,
					used: false
				}, 
				(err, result) =>{
					if(err)
						return console.log('err in insert', err)
					if(result.result.ok != 1)
						return console.log('result was not ok 1 league reistration gen', result)
					addShortLinkToDataBase(db, '/sd-league-registration/' + result.ops[0].key, (linkDone) =>{
						console.log('new key generated with shortlink: ', data, ' shortlink: ', linkDone)
					})
				}
			)
		})
})

function generateLeagueRegistrationKey(jwtConfigKey, name, email, teamNumber, finalToken){
	jwt.sign(
		{
			iat: (new Date()).getTime(),
			name: name,
			email: email,
			teamNumber: teamNumber,
			sub: 'League Registration Key v1'
		},
		jwtConfigKey,
		{
			algorithm: 'HS256'
		},
			(err, token) =>{
			if(err)
				return finalToken('TOKEN GENERATION FAILED!')
			return finalToken(token)
		}
	)
}

function addShortLinkToDataBase(db, link, linkDone){
	db.collection('shortLinks').insertOne( //TODO: insertmany
		{
			_id: makeShortLinkCode(),
			orginalLink: link //TODO: Check if link shorten already exsist then use that one
		}, (err, result) =>{
			if(err)
				if(err.code == 11000) //dup err
					addShortLinkToDataBase(db, link, linkDone) //recusrivly loop until it works
				else
					return console.log('err making shortlink', err)
			if(result.result.ok != 1)
				return console.log('result was not ok 1 short link gen', result)
			linkDone(result.insertedId)
		}
	)
}

function makeShortLinkCode(){
	let code = ''
	for(let i = 0; i < 6; i++){	//6 things long
		let random = Math.floor((Math.random() * (34)) +0)
		if(random < 9)	//if it is 0-8
			code += random + 1
		else
			if(random - 9 + 97 == 111)
				code += String.fromCharCode(122)	//o becomes z
			else
				code += String.fromCharCode(random - 9 + 97)
	}
	return code
}