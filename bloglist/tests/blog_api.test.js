const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');

const api = supertest(app);


beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[3])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[4])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[5])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are six blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body.length).toBe(helper.initialBlogs.length);
})

test('blog post has id property', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
})

test('blog can be added to blog list', async () => {
  const newBlog = {
    title: "Woah Momma",
    author: "Cornelius Rex",
    url: "www.google.com/lame/wow",
    likes: 2000
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  
  expect(response.body.length).toBe(helper.initialBlogs.length + 1);
  newBlog.id = response.body[helper.initialBlogs.length].id
  expect(response.body[helper.initialBlogs.length]).toEqual(newBlog);
});

test('default likes is 0', async () => {
  const newBlog = {
    title: "Wozza Bozza",
    author: "Corn Cab",
    url: "www.game.org/lameo/wowza",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  
  expect(response.body.length).toBe(helper.initialBlogs.length + 1);
  expect(response.body[helper.initialBlogs.length].likes).toBeDefined();
  expect(response.body[helper.initialBlogs.length].likes).toBe(0);
})

test('blog without title and url is invalid', async () => {
  const newBlog = {
    author: "Corn Kabob"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

  const response = await api.get('/api/blogs');
  
  expect(response.body.length).toBe(helper.initialBlogs.length);
})

test('existing blog is deleted', async () => {
  await api
    .delete('/api/blogs/5a422ba71b54a676234d17fb')
    .expect(200);

  const response = await api.get('/api/blogs');
  
  expect(response.body.length).toBe(helper.initialBlogs.length - 1);
})

test('existing blog is updated', async () => {
  const updatedBlog = {
    likes: 100
  }

  await api
    .put('/api/blogs/5a422ba71b54a676234d17fb')
    .send(updatedBlog)
    .expect(200);

  const response = await api.get('/api/blogs');
  
  expect(response.body[4].likes).toBe(100);
})

afterAll(() => {
  mongoose.connection.close();
})