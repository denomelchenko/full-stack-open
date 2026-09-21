const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.init()

    const passwordHash = await bcrypt.hash(helper.initialUsers[0].password, 10)
    const user = new User({
      username: helper.initialUsers[0].username,
      name: helper.initialUsers[0].name,
      passwordHash,
    })

    await user.save()
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('the passwordHash of a user is never returned', async () => {
    const response = await api.get('/api/users').expect(200)

    assert.strictEqual(response.body[0].passwordHash, undefined)
    assert.notStrictEqual(response.body[0].id, undefined)
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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with 400 if the username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with 400 if the username is missing', async () => {
    const newUser = { name: 'No Username', password: 'salainen' }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(result.body.error.includes('required'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation fails with 400 if the username is shorter than 3 characters', async () => {
    const newUser = { username: 'ab', name: 'Short Username', password: 'salainen' }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(result.body.error.includes('at least 3'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation fails with 400 if the password is missing', async () => {
    const newUser = { username: 'nopassword', name: 'No Password' }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(result.body.error.includes('required'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation fails with 400 if the password is shorter than 3 characters', async () => {
    const newUser = { username: 'shortpassword', name: 'Short Password', password: 'ab' }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(result.body.error.includes('at least 3'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('the blogs created by a user are populated in the user list', async () => {
    const user = (await helper.usersInDb())[0]

    const blog = new Blog({
      title: 'a blog written by root',
      author: 'Superuser',
      url: 'https://example.com/root-blog',
      likes: 2,
      user: user.id,
    })

    await blog.save()

    // GET /api/users populates the user's own `blogs` array, so the id has to be stored on the
    // user document too. POST /api/blogs performs this push in the application, but this test
    // creates the blog directly and therefore links it here.
    const rootUser = await User.findOne({ username: 'root' })
    rootUser.blogs = rootUser.blogs.concat(blog._id)
    await rootUser.save()

    const response = await api.get('/api/users').expect(200)

    const root = response.body.find((entry) => entry.username === 'root')

    assert.strictEqual(root.blogs.length, 1)
    assert.strictEqual(root.blogs[0].title, 'a blog written by root')
  })
})

after(async () => {
  await mongoose.connection.close()
})
