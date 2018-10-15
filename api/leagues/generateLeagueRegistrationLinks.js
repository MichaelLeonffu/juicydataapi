//generateLeagueRegistrationLinks by Michael Leonffu

const config 							= require('./../../config.js')
const MongoClient 						= require('mongodb').MongoClient
const configDB 							= config.mongodb
const generateLeagueRegistrationKeys 	= require('./generateLeagueRegistrationKeys')
const generateShortLinks				= require('./../misc/generateShortLinks')
const util								= require('util')

data = [
	{
		name: 'Anna Li',
		email: 'AnnaLi@gmail.com',
		teamNumber: 8097
	},
	{
		name: 'Anna Li',
		email: 'AnnaLi@gmail.com',
		teamNumber: 92010
	},
	{
		name: 'Cameron DeMille',
		email: 'CameronDeMille@gmail.com',
		teamNumber: 6060
	},
	{
		name: 'Cam Oh',
		email: 'CamOh@gmail.com',
		teamNumber: 1
	}
]

MongoClient.connect(configDB.url, function(err, client){
	const db = client.db(configDB.db)
	data.forEach((personTeam, idx, array) =>{
		generateLeagueRegistrationKeys(config.jwt.key, personTeam.email, personTeam.name, [personTeam.teamNumber], (finalTokens) =>{
			let copyfinalTokens = finalTokens[0]
			for(let i = 0; i < finalTokens.length; i++)
				finalTokens[i] = '/sd-league-registration/' + finalTokens[i]
			generateShortLinks(db, finalTokens, (finalLinks) =>{
				personTeam.finalLinks = finalLinks
				personTeam._id = copyfinalTokens
				personTeam.used = false
				if(idx == array.length-1)//last
					db.collection('leagueRegistrationKey').insertMany(data, (err, result) =>{
						console.log(util.inspect(data, {showHidden: false, depth: null}))
						client.close()
					})
			})
		})
	})
})