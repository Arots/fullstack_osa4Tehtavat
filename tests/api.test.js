const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')


//beforeAll( async () => {
//await Blog.remove({})


//})

test('Blogs are returned, GET successful', async () => {

	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

/*test('There are five notes in the database', async () => {
	const result = await api.get('/api/blogs')
	expect(result.body.length).toBe(5)
}) */

test('The post method works', async () => {
	const newBlog = {
		title: 'limbe lomb',
		author: 'linka lanka',
		url: 'http://ligelong.com',
		likes: 29
	}
	
	const initialLength = await api.get('/api/blogs')

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/)
	
	const contents = await api.get('/api/blogs')

	const mapping = contents.body.map(result => result.title)

	expect(mapping).toContain('limbe lomb')
	expect(contents.body.length).toBe(initialLength.body.length + 1)
	
})

test('A new blog must contain title and url', async () => {
	const newBlog = {
		atuhor: 'linke lonk',
		likes: 99
	}
	
	const initailBlogs = await api.get('/api/blogs')

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(400)
	
	const resultBlogs = await api.get('/api/blogs')
	expect(resultBlogs.body.length).toBe(initailBlogs.body.length)
})

test('If no likes are given we give it 0 likes', async () => {
	const newBlog = {
		title: 'Linge longe',
		author: 'lombe lii',
		url: 'Timoteusens.fi'
	}

	const resultBlog = await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
	
	expect(resultBlog.body.likes).toBe(0)
})


afterAll(() => {
	server.close()
})