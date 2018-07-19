//eventsapi by Michael Leonffu

module.exports = function(config, app, db){

app.get('/api/events', (req, res) => {
	res.status(200).json({message: 'events api home'})
})

//Connecting all APIs

require('./ftc/eventsftcapi')(config, app, db)

}