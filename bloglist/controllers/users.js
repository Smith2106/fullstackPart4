const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response,next) => {
  const users = await User.find({});
  response.json(users);
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    if (!body.password) {
      throw {
        message: 'Password must be included',
        name: 'ValidationError'
      }
    }
    else if (body.password.length < 3) {
      throw {
        message: 'Password must be at least 3 characters long',
        name: 'ValidationError'
      }
    }
    console.log(body)

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  }
  catch(exception) {
    next(exception)
  }
})

module.exports = usersRouter