const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/User')
const helper = require('./test_helper')

const api = supertest(app)
beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.testUsers.map(blog => new User(blog))
    const promises = userObjects.map(blog => blog.save())
    await Promise.all(promises)
})


test('user GET', async () => {
    await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('GET returns all users', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.testUsers.length)
})

test('POST works as expected', async () => {
    const user = { username: "pertti", password: "qwerty" }

    await api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const dbUsers = await api.get('/api/users')
    expect(dbUsers.body.length).toBe(helper.testUsers.length + 1)
    const usernames = dbUsers.body.map(r => r.username)
    expect(usernames).toContain(user.username)
})


describe('Negative tests', () => {
    test('username NULL', async () => {
        const user = { password: "qwerty" }

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        expect(response.body.message.toLowerCase()).toContain("username")

        const dbUsers = await api.get('/api/users')
        expect(dbUsers.body.length).toBe(helper.testUsers.length)
    })

    test('invalid username', async () => {
        const user = { username: "ki", password: "kirill" }

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        expect(response.body.message.toLowerCase()).toContain("username")
        expect(response.body.message.toLowerCase()).toContain("short")

        const dbUsers = await api.get('/api/users')
        expect(dbUsers.body.length).toBe(helper.testUsers.length)
    })
})


afterAll(() => {
    mongoose.connection.close()
})