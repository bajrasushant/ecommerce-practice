const userRouter = require('express').Router()
const User = require('../models/user')


userRouter.get('/', (request, response) => {
  rser
    .find({})
    .then(users => {
      response.json(users)
    })
})

userRouter.post('/', (request, response) => {
  const user = new User(request.body)

  user
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = userRouter
