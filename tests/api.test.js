const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')


//beforeAll( async () => {
//await Blog.remove({})


//})

test('Blogs are returned, GET successful', async () => {

	api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})


afterAll(() => {
	server.close()
})