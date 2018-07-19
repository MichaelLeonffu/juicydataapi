// config.js

//remove "TEMPLATE" from filename; to use config

module.exports = {
	mongodb:{
		//mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
		url: 'mongodb://localhost/'
	},
	api:{
		version: '2.0.0-alpha'
	},
	jwt:{
		key: 'secret'
	},
	permissions:[	//Add more permissions this way or change exsisting permissions
		{
			group: 'admin',
			permissionLevel: 4.0
		},
		{
			group: 'default',
			permissionLevel: 0.0
		}
	]
}