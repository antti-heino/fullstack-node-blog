const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')


usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body

    
    if (!body.username || !body.password) {
        response.status(400).send({ message: "Must provide both username and password" })
    }
    else if (body.username.length < 3) {
        response.status(400).send({ message: "Username too short" })
    }
    else if (body.password.length < 3) {
        response.status(400).send({ message: "Password too short" })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const returnUser = await user.save()
    console.log('User Saved')
    response.status(201).json(returnUser)
})

module.exports = usersRouter