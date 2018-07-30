const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoUrl = process.env.MONGODB_URI

mongoose
  .connect(mongoUrl)
  .then( () => {
    console.log('connected to database', process.env.MONGODB_URI)
  })
  .catch(error => {
    console.log(error)
  })

app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogRouter)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})