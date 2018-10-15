//generateLeagueRegistrationKeys by Michael Leonffu

const jwt = require('jsonwebtoken')

module.exports = generateLeagueRegistrationKeys

function generateLeagueRegistrationKeys(jwtConfigKey, email, name, teams, finalTokens){
	let tokens = []

	teams.forEach((team, idx, array) => { //doesnt actually do the callbacks in order.
		generateLeagueRegistrationKey(jwtConfigKey, email, name, team, (token) =>{
			tokens.push(token)
			if(idx == array.length-1)//last
				finalTokens(tokens)
		})
	})
}

function generateLeagueRegistrationKey(jwtConfigKey, email, name, team, resultKeyValue){
	jwt.sign(
		{
			iat: (new Date()).getTime(),
			name: name,
			email: email,
			teamNumber: team,
			sub: 'League Registration Key v1'
		},
		jwtConfigKey,
		{
			algorithm: 'HS256'
		},
		(err, token) =>{
		if(err)
			return resultKeyValue('TOKEN GENERATION FAILED!')
		// console.log(token)
		resultKeyValue(token)
	})
}