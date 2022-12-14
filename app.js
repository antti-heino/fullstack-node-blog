const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/Blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/Login')
const usersRouter = require('./controllers/Users')

const url = config.MONGODB_URI
logger.info('Connecting to: ', url)

mongoose.connect(url, { })
  .then(() => logger.info('Connected to MongoDB.'))
  .catch(error => logger.error('Could not connect to MongoDB: ', error))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenHandler)
app.use('/api/blogs',middleware.userHandler, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app