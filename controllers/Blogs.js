const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  
  const { title, author, url, likes } = request.body

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0
  })
  await blog.save()
  response.status(201).json(blog)
})

module.exports = blogsRouter