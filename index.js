const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const config = require('./utils/config')

mongoose
	.connect(config.mongoUrl)
	.then( () => {
		console.log('connected to database', config.mongoUrl)
	})
	.catch(error => {
		console.log(error)
	})

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)

const PORT = config.port || 3003

const server = http.createServer(app)

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
	mongoose.connection.close()
})

module.exports = {
	app,
	server
}