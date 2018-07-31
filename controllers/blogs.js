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

blogRouter.get('/', (request, response) => {
	Blog
		.find({}, {__v: 0})
		.then(blogs => {
			response.json(blogs.map(formatBlogs))
		})
})
  
blogRouter.post('/', (request, response) => {
	const blog = new Blog(request.body)
  
	blog
		.save()
		.then(result => {
			response.status(201).json(result)
		})
})

blogRouter.put('/:id', (req, res) => {
	const body = req.body
	const newBlog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}

	Blog
		.findByIdAndUpdate(req.params.id, newBlog)
		.then(result => {
			res.status(200).end()
		})
		.catch(error => {
			console.log(error)
			res.status(404).send({error: 'malformatted Id'})
		})

})  
  
blogRouter.delete('/:id', (req, res) => {

	Blog
		.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => {
			console.log(error)
			res.status(400).send({error: 'malformatted Id'})
		})
})

module.exports = blogRouter