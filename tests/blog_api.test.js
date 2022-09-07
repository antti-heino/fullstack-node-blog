const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/Blog')
const Helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
  
    for (let blog of Helper.testBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(6)
  })
  
  test('the first blog is React patterns', async () => {
    const response = await api.get('/api/blogs')
    
    expect(response.body[0].title).toBe('React patterns')
  })

  test('Blog has property id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

describe('POST tests', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'ping pong',
        author: 'Robert C. Martin Jr.',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeofWars.html',
        likes: 1
      }
      
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
    
    const response = await Helper.blogsInDb()
    const contents = response.map(n => n.title)
    expect(response).toHaveLength(7)
    expect(contents).toContain('ping pong')

  })

  test('POST without title & author returns bad request', async () => {
    const newBlog = {
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeofWars.html',
        likes: 1
      }
      
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);

  })

  test('Blog without content is not added', async () => {
    const newBlog = {
      likes : 1
    }
    await api
    .post('/api/blogs')
    .send(newBlog)

    const response = await Helper.blogsInDb()
  
    expect(response).toHaveLength(6)
  })

  test('Verify that likes is 0 if null in post', async () => {
    const newBlog = {
        title: 'ping pong',
        author: 'Robert C. Martin Jr.',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeofWars.html',
      }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    
      const dbBlogs = await Helper.blogsInDb()
      expect(dbBlogs[6].likes).toEqual(0);

  })

})

test('PUT updates likes', async () => {

    const blogs = await Helper.blogsInDb()
    const blog = blogs[0]
    blog.likes = 21


    const updatedBlog = await api
      .put(`/api/blogs/${blog.id}`)
      .send(blog)
      .expect(200)

    expect(updatedBlog.body.likes).toBe(blog.likes)
  })

test('DELETE works', async () => {
    let blogs = await Helper.blogsInDb()
    const blog = blogs[0]
    await api
      .delete(`/api/blogs/${blog.id}`)
      .expect(204)

    blogs = await Helper.blogsInDb()
    const blogsIds = blogs.map((bl) => bl.id)
    expect(blogsIds).not.toContain(blog.id)
  })

afterAll(() => {
  mongoose.connection.close()
})