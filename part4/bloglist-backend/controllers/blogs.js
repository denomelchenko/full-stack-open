const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  if (user !== undefined) {
    blog.user = user
  }

  const savedBlog = await blog.save()

  await savedBlog.populate('user', { username: 1, name: 1 })

  response.json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog && blog.user && blog.user.toString() !== request.user._id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete a blog' })
  }

  if (blog) {
    await blog.deleteOne()
  }

  response.status(204).end()
})

module.exports = blogsRouter
