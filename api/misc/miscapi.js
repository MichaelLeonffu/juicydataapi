//miscapi by Michael Leonffu

module.exports = function(config, app, db){

app.get('/api/misc', (req, res) => {
	res.status(200).json({message: 'misc api home'})
})

app.get('/api/misc/link-unshorten', (req, res) => {
	
	// req.query = {
	// 	shortLink: 'abc'
	// }

	//6^34; no o or 0 and all lowercase

	//TODO: make sure no link shorterner loops; carry data around. (same thing as spam pervention)

	if(!req || !req.query || !req.query.shortLink)
		return res.status(500).json({link: ''})	//default

	db.collection('shortLinks').findOne(
		{
			_id: req.query.shortLink
		},(err, result) => {
			if(err || !result)
				return res.status(500).json({link: ''})	//default
			res.status(200).json({link: result.orginalLink})
		}
	)
})

}