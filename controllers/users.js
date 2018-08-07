const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

userRouter.get('/', async (req, res) => {
	try {
		const users = await User
			.find({}, { passwordHash: 0 })
			.populate('blogs', { likes: 1, author: 1, title: 1, url: 1 })
			
		res.status(200).json(users.map(User.format))
	} catch (expression) {
		console.log(expression)
		res.status(400).send({ error: 'something went wrong' })
	}
})

userRouter.post('/', async (req, res) => {
	const body = req.body

	try {
		const existingUser = await User.find({ username: body.username})

		if (body.password.length < 3) {
			return res.status(400).send({ error: 'password is too short!'})
		} else if (existingUser.length > 0) {
			return res.status(400).send({ error: 'name must be unique'})
		}

		const saltRounds = 10
		const passwordHash = await bcrypt.hash(body.password, saltRounds)
		const newUser = new User({
			username: body.username,
			name: body.name,
			passwordHash,
			adult: body.adult === undefined ? true : body.adult,
			blogs: body.blogs
		})
        
		const savedUser = await newUser.save()
		res.status(201).json(User.format(savedUser))
	} catch (exception) {
		console.log(exception)
		res.status(500).send({ error: 'Post didnt work' })
	}
})


module.exports = userRouter