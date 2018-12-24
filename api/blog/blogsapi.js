//blogsapi by Michael Leonffu

const multer = require('multer')
var upload = multer({dest: '/Users/michaelleonffu/Developer/juicydata/juicydataapi/juicydataapi/data/uploads/'})

module.exports = function(config, app, db){

app.get('/api/blogs', (req, res) => {
	res.status(200).json({message: 'blogs api home'})
})

// app.post('/api/blog/posts/create', upload.fields([{name: 'images'}, {name: 'html'}]), (req, res) => {

// 	console.log(req.body)
// 	console.log(req.files)

// 	res.status(400).json({message: 'HEH'})
// })

// app.get('/api/blog/posts/create', (req, res) => {
// 	console.log(req.query.file)
// 	res.sendFile('/Users/michaelleonffu/Developer/juicydata/juicydataapi/juicydataapi/data/uploads/' + req.query.file)
// })

}