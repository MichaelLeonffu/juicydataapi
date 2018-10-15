//generateShortLinks by Michael Leonffu

module.exports = generateShortLinks

function generateShortLinks(db, links, finalLinks){
	let shortLinks = []

	links.forEach((link, idx, array) => {
		addShortLinkToDataBase(db, link, (linkDone) =>{
			shortLinks.push({short: linkDone, orginalLink: link})
			if(idx == array.length-1)//last
				finalLinks(shortLinks)
		})
	})
}

function addShortLinkToDataBase(db, link, linkDone){
	db.collection('shortLinks').insertOne( //TODO: insertmany
		{
			_id: makeShortLinkCode(),
			orginalLink: link //TODO: Check if link shorten already exsist then use that one
		}, (err, result) =>{
			if(err)
				if(err.code == 11000) //dup err
					addShortLinkToDataBase(db, link, linkDone) //recusrivly loop until it works
				else
					console.log('heh gg')
			// console.log(result) //not needed
			linkDone(result.insertedId)
		}
	)
}

function makeShortLinkCode(){
	let code = ''
	for(let i = 0; i < 6; i++){	//6 things long
		let random = Math.floor((Math.random() * (34)) +0)
		if(random < 9)	//if it is 0-8
			code += random + 1
		else
			if(random - 9 + 97 == 111)
				code += String.fromCharCode(122)	//o becomes z
			else
				code += String.fromCharCode(random - 9 + 97)
	}
	return code
}