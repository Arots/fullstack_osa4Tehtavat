const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./user_helper')
const bcrypt = require('bcryptjs')

describe('tests for user validation', async () => {
	test('username is valid', async () => {
		const users = await helper.usersInDb()
        
		const newUser = new User({
			username: 'Timoteus',
			name: 'Teme',
			adult: true,
			passwordHash: 'stringy'
		})
        
		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

		const usersAfterSend = await helper.usersInDb()

		expect(users.length).toBe(usersAfterSend.length)
	})
    
	test('users password is long enough', async () => {
		const users = await helper.usersInDb()

		const newUser = new User({
			username: 'Erilainen',
			name: 'ernu',
			adult: true,
			passwordHash: '12'
		})

		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
	})

	test('an undefined adult value is made true', async () => {
		const users = await helper.usersInDb()

		const newUser = new User({
			username: 'NYT TEHÄÄ UUS',
			name: 'no todellaki tehää',
			passwordHash: '999000'
		})

		const wantedUser = await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
        
		const usersAfterSending = await helper.usersInDb()
		const mapped = usersAfterSending.map(users => users.name)
        
		expect(wantedUser.body.adult).toBe(true)
		expect(usersAfterSending.length).toBe(users.length + 1)
		expect(mapped).toContain('god of teme')

	})
})

afterAll( () => {
	server.close()
})