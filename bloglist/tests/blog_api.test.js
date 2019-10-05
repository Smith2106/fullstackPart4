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
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('blog post has id property', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
})

// test('the first blog is about react patterns', async () => {
//   const response = await api.get('/api/blogs')

//   expect(response.body[0].title).toBe('React patterns')
// })

// test('a specific blog is within the returned blogs', async () => {
//   const response = await api.get('/api/blogs')

//   const titles = response.body.map(r => r.title)

//   expect(titles).toContain(
//     'Canonical string reduction'
//   )
// })

// test('a valid note can be added ', async () => {
//   const newNote = {
//     content: 'async/await simplifies making async calls',
//     important: true,
//   }

//   await api
//     .post('/api/notes')
//     .send(newNote)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   const response = await api.get('/api/notes')

//   const contents = response.body.map(r => r.content)

//   expect(response.body.length).toBe(helper.initialNotes.length + 1)
//   expect(contents).toContain(
//     'async/await simplifies making async calls'
//   )
// })

// test('note without content is not added', async () => {
//   const newNote = {
//     important: true
//   }

//   await api
//     .post('/api/notes')
//     .send(newNote)
//     .expect(400)

//   const response = await api.get('/api/notes')

//   expect(response.body.length).toBe(initialNotes.length)
// })

afterAll(() => {
  mongoose.connection.close();
})