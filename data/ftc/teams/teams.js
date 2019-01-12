//teams by Michael Leonffu
var MongoClient = require('mongodb').MongoClient	//CHANGE
var url = "mongodb://159.89.154.135:27017"	//CHANGE

var axios = require('axios')
var scoreKeeperApi = axios.create({
	baseURL: 'http://localhost/apiv1/',
	timeout: 1000000000,
	headers: {'X-Application-Origin': 'JuicyData'}
})

//Generates the teams collection using TOAs database
//Pulls the complete teams collection then compares it to TOAs database;
//if threre is a differnce then the TOA version is saved
//BUT ACUALLY now it just drops the collection and reinserts it all

scoreKeeperApi.get('teams/').then(teams => {

	let teamsData = []
	let teamNumbers = teams.data.teamNumbers;

	findTeamData(teamsData, teamNumbers, teamsData => {
		saveAll(teamsData)
	})
})

function findTeamData(teamsData, teamNumbers, saveAll){
	if(teamNumbers.length <= 0)
		saveAll(teamsData)
	else
		scoreKeeperApi.get('teams/' + teamNumbers.pop() + '/').then(team => {
			console.log(teamNumbers.length)
			teamInfo = team.data
			teamInfo['_id'] = teamInfo.number
			teamsData[teamsData.length] = teamInfo
			findTeamData(teamsData, teamNumbers, saveAll)
		})
}


function saveAll(teamsData){
	MongoClient.connect(url, (err, client) => {
		if (err) throw err
		var db = client.db('JuicyData')
		db.collection('teams').insertMany(
			teamsData,
			function(err, responce){
				if(err){
					console.log(err),
					client.close()
				}else{
					console.log(responce)
					client.close()
				}
			}
		)
	})
}