//eventsftcapi by Michael Leonffu

module.exports = function(config, app, db){

app.get('/api/events/ftc', (req, res) => {
	res.status(200).json({message: 'events ftc api home'})
})

//Connecting all APIs

require('./event/eventsftceventapi')(config, app, db)

app.get('/api/events/ftc/seasons', (req, res) => {

	// req = {
	// 	body: {
	// 		season: 'abc',	//season for FTC game; if null; sends all data
	// 		format: false	//true if wanted unmodifyed season data file; defaults to false
	// 	}
	// }

	var fields = {}

	if(!req.body.format)
		fields = {
			'game.period': 1,
			'game.name': 1,
			'game.type': 1
		}

	if(req.body.season)
		db.collection('seasons').findOne(
			{
				_id: {
					season: req.body.season,
					first: 'ftc'
				}
			},
			{fields: fields},
			(err, result) => {
				if(err){
					console.log(err)
					res.status(500).send(err)
					return
				}
				res.status(200).json(seasonFormat(result))
			}
		)
	else
		db.collection('seasons').find(
			{
				'_id.first': 'ftc'
			},
			{fields: fields},
			(err, cursor) => {
				if(err){
					console.log(err)
					res.status(500).send(err)
					return
				}
				cursor.toArray((err, data) => {
					if(err){
						console.log(err)
						res.status(500).send(err)
						return
					}
					for(let i = 0; i < data.length; i++)
						data[i] = seasonFormat(data[i])
					res.status(200).json(data)
				})
			}
		)

	function seasonFormat(seasonData){
		var temp = {
			_id: seasonData._id,
			schema: {}
		}

		seasonData.game.forEach((game) => {
			if(!temp.schema[game.period])
				temp.schema[game.period] = {}
			if(game.type == 'number')
				temp.schema[game.period][game.name] = 123
			if(game.type == 'boolean')
				temp.schema[game.period][game.name] = false
		})

		return temp
	}
})

}