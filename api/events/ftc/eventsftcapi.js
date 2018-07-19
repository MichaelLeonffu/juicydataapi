//eventsftcapi by Michael Leonffu

module.exports = function(config, app, db){

app.get('/api/events/ftc', (req, res) => {
	res.status(200).json({message: 'events ftc api home'})
})

//Connecting all APIs

require('./event/eventsftceventapi')(config, app, db)

}