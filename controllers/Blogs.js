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

blogsRouter.delete('/:id', async (request, response) => {

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {

  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter