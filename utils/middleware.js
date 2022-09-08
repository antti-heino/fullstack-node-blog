const logger = require('./logger')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error:'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  else if (error.name === 'JsonWebTokenError') {
  return response.status(401).json({
    error: 'invalid token'
  })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
  }) 
}
  next(error)
}

const tokenHandler = (request, response, next) => {
  const authorization = request.get('authorization')
console.log('tokenhandler init')
console.log(authorization)
  // Check if there is a token and extract it
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }

  // Check if the token is valid
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.decodedToken = decodedToken
  } catch (error) {
    request.decodedToken = null
  }

  next()
}

const userHandler = (request, response, next) => {
  const decoded = jwt.decode(request.token);
  if (decoded !== null) {
    request.user = decoded.username;
    console.log(`user is: ${request.user}`);
  }

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenHandler,
  userHandler
}