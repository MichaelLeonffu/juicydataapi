//eventsftceventapi by Michael Leonffu

module.exports = function(config, app, db){

app.get('/api/events/ftc/event', (req, res) => {
	res.status(200).json({message: 'events ftc event api home'})
})

//Connecting all APIs

// require('./event/eventsftceventapi')(config, app, db)

app.get('api/events/ftc/event/upload', (req, res) => {
	res.status(501).json({message: 'upload is not implemented yet'})
})



}