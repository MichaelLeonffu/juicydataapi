// config.js

//remove "TEMPLATE" from filename; to use config

module.exports = {
	mongodb:{
		//mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
		url: 'mongodb://localhost/',
		db: 'JuicyData'
	},
	api:{
		version: '2.0.0-alpha'
	},
	jwt:{
		key: 'secret'
	},
	accounts:{
		tenativeTime: 432000000,	//5 days, in milliseconds; to verify email in signup
		passwordChangeTime: 360000,	//30 minutes in millisecounds; to change password in forget or reset password
		saltRounds: 15				//amount of rounds of salt that bycrypt will use
	},
	developer:{
		log:{
			accounts: false
		}
	},
	nodemailer:{
		service: 'email',
		email: 'juicydataemail@email.com',
		password: 'password123ABC'
	},
	permissions:[	//add more permissions this way or change exsisting permissions
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