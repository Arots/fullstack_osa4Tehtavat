const Blog = require('../models/blog')

const format = (blog) => {
	return {
		title: blog.title,
		author: blog.author,
		url: blog.url,
		id: blog._id
	}
}

const nonExistingId = async () => {
	const blog = new Blog()
	await blog.save()
	await blog.remove()

	return blog._id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({}, {__v: 0})
	return blogs.map(format)
}

module.exports = {
	blogsInDb, format, nonExistingId
}