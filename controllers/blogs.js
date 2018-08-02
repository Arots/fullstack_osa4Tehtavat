const blogRouter = require('express').Router()
const Blog = require('../models/blog')


const formatBlogs = (blog) => {
	return {
		title: blog.title,
		author: blog.author,
		url: blog.url,
		likes: blog.likes,
		id: blog._id

	}
}

blogRouter.get('/', async (request, response) => {
	try {
		const blogs = await Blog.find({}, {__v: 0})
		response.json(blogs.map(formatBlogs))
	} catch (exception) {
		console.log(exception)
		response.status(400).send({ error: 'Something went wrong' })
	}
})
  
blogRouter.post('/', async (request, response) => {
	const blog = new Blog ({
		title: request.body.title,
		author: request.body.author,
		url: request.body.url,
		likes: request.body.likes ? request.body.likes : 0
	})

	try {
		if (request.body.title === undefined || request.body.url === undefined ) {
			return response.status(400).send({error: 'Bad request'})
		}
		
		const savedBlog = await blog.save()
		response.status(201).json(formatBlogs(savedBlog))
			
	} catch (exception) {
		console.log(exception)
		response.status(500).send({ error: 'Post didnt work' })
	}
})

blogRouter.put('/:id', async (req, res) => {
	const body = req.body
	const newBlog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}

	try {
		await Blog.findByIdAndUpdate(req.params.id, newBlog)
		res.status(204).json(formatBlogs(newBlog))
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