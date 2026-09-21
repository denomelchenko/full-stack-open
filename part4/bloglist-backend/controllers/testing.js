const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Only mounted when NODE_ENV === 'test' (see app.js). It exists so the
// Playwright suite can start every test from an empty database.
router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
