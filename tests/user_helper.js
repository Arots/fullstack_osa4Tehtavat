const User = require('../models/user')

const formatUsers = (users) => {
	return {
		id: users._id,
		username: users.username,
		name: users.name,
		adult: users.adults        
	}
}

const usersInDb = async () => {
	const users = await User.find({}, { passwordHash: 0 })
	return users.map(formatUsers)
}


module.exports = {
	usersInDb
}