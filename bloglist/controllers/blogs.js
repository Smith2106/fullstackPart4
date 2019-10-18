const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response,next) => {
  const blogs = await Blog.find({}).populate('user', 'username name id');
  response.json(blogs);
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const token = request.token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    response.status(201).json(savedBlog)
  }
  catch(exception) {
    next(exception);
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const token = request.token;

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== user.id) {
      return response.status(401).json({ error: 'Only the user that created this blog can delete it.' })
    }

    const result = await blog.delete()
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