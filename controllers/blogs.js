const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

blogRouter.get('/', async (request, response) => {
	try {
		const blogs = await Blog
			.find({}, {__v: 0})
			.populate('user', { username: 1, name: 1})
		response.json(blogs.map(Blog.format))
	} catch (exception) {
		console.log(exception)
		response.status(400).send({ error: 'Something went wrong' })
	}
})
  
blogRouter.post('/', async (request, response) => {

	try {
		const body = request.body

		const token = getTokenFrom(request)
		const decodedToken = jwt.verify(token, process.env.SECRET)

		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: 'token missing or invalid' })
		}

		if (request.body.title === undefined || request.body.url === undefined ) {
			return response.status(400).send({error: 'Bad request'})
		}

		const user = await User.findById(decodedToken.id)

		const blog = new Blog ({
			title: request.body.title,
			author: request.body.author,
			url: request.body.url,
			likes: request.body.likes ? request.body.likes : 0,
			user: user
		})
		
		const savedBlog = await blog.save()

		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		
		response.status(201).json(Blog.format(savedBlog))
			
	} catch (exception) {
		if (exception.name === 'JsonWebTokenError' ) {
			response.status(401).json({ error: exception.message })
		} else {
			console.log(exception)
			response.status(500).json({ error: 'Post didnt work' })
		}
	}
})

blogRouter.put('/:id', async (req, res) => {

	try {
		const body = req.body

		/*const token = getTokenFrom(req)
		const decodedToken = jwt.verify(token, process.env.SECRET)

		if (!token || !decodedToken.id) {
			return res.status(401).json({ error: 'token missing or invalid' })
		}

		if (req.body.title === undefined || req.body.url === undefined ) {
			return res.status(400).send({error: 'Bad request'})
		}

		const user = await User.findById(decodedToken.id) */

		const user = await User.findById(body.user)

		const newBlog = {
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes,
			user: user
		}

		await Blog.findByIdAndUpdate(req.params.id, newBlog)
		res.status(204).json(Blog.format(newBlog))
	} catch (exception) {
		if (exception.name === 'JsonWebTokenError' ) {
			res.status(401).json({ error: exception.message })
		} else {
			console.log(exception)
			res.status(400).json({ error: 'malformatted Id' })
		}
	}
})  
  
blogRouter.delete('/:id', async (req, res) => {

	try {
		const body = req.body
		const token = getTokenFrom(req)

		const decodedToken = jwt.verify(token, process.env.SECRET)

		if ( !token || !decodedToken.id ) {
			return res.status(401).json({ error: 'token invalid or undefined' })
		}

		const userId = await User.findById(decodedToken.id)
		const blog = await Blog.findById(req.params.id)

		if ( userId.id.toString() === blog.user.toString() ) {
			await Blog.findByIdAndRemove(req.params.id)
			res.status(204).end()
		} else if (blog.user === undefined || null) {
			await Blog.findByIdAndRemove(req.params.id)
			res.status(204).end()
		} else {
			res.status(400).json({ error: 'Ei toiminu deletet' })
		}
	} catch (exception) {
		if (exception.name == 'JsonWebTokenError') {
			res.status(401).json({ error: exception.message})
		} else {
			console.log(exception)
			res.status(400).json({ error: 'malformatted Id' })
		}
	}
})

module.exports = blogRouter