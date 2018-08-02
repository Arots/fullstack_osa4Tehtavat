const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

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

describe('when there are some note in the db', async () => {

	test('The post method works', async () => {
		const newBlog = {
			title: 'limbe lomb',
			author: 'linka lanka',
			url: 'http://ligelong.com',
			likes: 29
		}

		const initialLength = await helper.blogsInDb()

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const contents = await helper.blogsInDb()

		expect(contents.length).toBe(initialLength.length + 1)
		const mapping = contents.map(result => result.title)
		expect(mapping).toContain('limbe lomb')

	})
})

describe('addition of a new note', async () => {

	test('A new blog must contain title and url', async () => {
		const newBlog = {
			atuhor: 'linke lonk',
			likes: 99
		}

		const initailBlogs = await helper.blogsInDb()

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)

		const resultBlogs = await helper.blogsInDb()
		expect(resultBlogs.length).toBe(initailBlogs.length)
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
})

describe('deletion of a new note', async () => {
	let blogToDelete

	beforeAll(async () => {
		blogToDelete = new Blog({
			title: 'This will soon be removed',
			author: 'doesnt really matter',
			url: 'www.whocares.com',
			likes: 8
		})
		await blogToDelete.save() 
	})

	test('DELETE resource is succesful with a suitable statuscode', async () => {
		const blogsAtStart = await helper.blogsInDb()

		await api
			.delete(`/api/blogs/${blogToDelete._id}`)
			.expect(204)

		const blogsAfterDelete = await helper.blogsInDb()
		expect(blogsAfterDelete.length).toBe(blogsAtStart.length - 1)
	})
})

afterAll(() => {
	server.close()
})