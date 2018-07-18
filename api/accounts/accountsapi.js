//accountsapi by Michael Leonffu

module.exports = function(config, app, db){

app.get('/api/accounts', (req, res) => {
	res.status(200).json({message: 'accounts api home'})
})

//Connecting all APIs

require('./accounts')(config, app, db)
// require('./profiles')(config, app, db)

}