const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response,next) => {
  const blogs = await Blog.find({});
  response.json(blogs);
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const result = await blog.save()
    response.status(201).json(result)
  }
  catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndRemove(request.params.id);
    response.status(200).json(result)
  }
  catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, request.body);
    response.status(200).json(result)
  }
  catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter