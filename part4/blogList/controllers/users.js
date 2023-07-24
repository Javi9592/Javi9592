const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.username === undefined) {
    return response.status(400).json({ error: 'username missing' })
  } else if (body.password === undefined) {
    return response.status(400).json({ error: 'password missing' })
  } else if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (body.username.length < 3) {
    return response.status(400).json({ error: 'username min length need to be 3' })
  } else if (body.password.length < 3) {
    return response.status(400).json({ error: 'password min length need to be 3' })
  }

  const users = await User.find({})
  const nameUsersList = users.map(item => item.username)

  if (nameUsersList.includes(body.username)) {
    return response.status(400).json({ error: 'username must be unique' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)}
})

module.exports = usersRouter