const User = require('../models/user')
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  describe('username is invalid', () => {
    test('username is too short', async () => {

      const newUser = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'sal',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.text).toContain('username: Username must be at least 3 characters long')
    })

    test('username is not unique', async () => {

      const newUser = {
        username: 'root',
        name: 'Matti Luukkainen',
        password: 'sal',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(response.text).toEqual(expect.stringContaining('E11000 duplicate key error collection: test.users index: username_1 dup key'))
    })

    test('no username is given', async () => {

      const newUser = {
        name: 'Matti Luukkainen',
        password: 'sal',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.text).toContain('username: Username is required')
    })
  })

  describe('invalid password given', () => {
    test('password is too short', async () => {

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'sa',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.text).toContain('Password must be at least 3 characters long')
    })

    test('no password is given', async () => {

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.text).toContain('Password must be included')
    })
  })
})
