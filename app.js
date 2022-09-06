const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/Blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const url = config.MONGODB_URI
logger.info('Connecting to: ', url)

mongoose.connect(url, { })
  .then(() => logger.info('Connected to MongoDB.'))
  .catch(error => logger.error('Could not connect to MongoDB: ', error))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

//Define baseurl
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app