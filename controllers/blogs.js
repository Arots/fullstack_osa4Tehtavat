const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
	try {
		const blogs = await Blog.find({}, {__v: 0})
		response.json(blogs.map(Blog.format))
	} catch (exception) {
		console.log(exception)
		response.status(400).send({ error: 'Something went wrong' })
	}
})
  
blogRouter.post('/', async (request, response) => {

	try {
		const body = request.body

		if (request.body.title === undefined || request.body.url === undefined ) {
			return response.status(400).send({error: 'Bad request'})
		}

		const user = await User.findById(body.userId)

		const blog = new Blog ({
			title: request.body.title,
			author: request.body.author,
			url: request.body.url,
			likes: request.body.likes ? request.body.likes : 0,
			user: user._id
		})
		
		const savedBlog = await blog.save()

		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		
		response.status(201).json(Blog.format(savedBlog))
			
	} catch (exception) {
		console.log(exception)
		response.status(500).send({ error: 'Post didnt work' })
	}
})

blogRouter.put('/:id', async (req, res) => {

	try {
		const body = req.body

		const user = await User.findById(body.userId)

		const newBlog = {
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes,
			user: user._id
		}

		await Blog.findByIdAndUpdate(req.params.id, newBlog)
		res.status(204).json(Blog.format(newBlog))
	} catch (exception) {
		console.log(exception)
		res.status(400).json({ error: 'malformatted Id' })
	}
})  
  
blogRouter.delete('/:id', async (req, res) => {

	try {
		await Blog.findByIdAndRemove(req.params.id)
		res.status(204).end()
	} catch (exception) {
		console.log(exception)
		res.status(400).json({ error: 'malformatted Id' })
	}
})

module.exports = blogRouter