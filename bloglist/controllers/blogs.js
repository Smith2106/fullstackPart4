const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response,next) => {
  const blogs = await Blog.find({}).populate('user', 'username name id');
  response.json(blogs);
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const user = await User.findOne();
    blog.user = user.id;

    user.blogs.push(blog.id);
    console.log(user.blogs)
    await user.save();

    const result = await blog.save();
    response.status(201).json(result);
  }
  catch(exception) {
    next(exception);
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