const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const userId = request.user
  const user = await User.findById(userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const userId = request.user
  const user = await User.findById(userId)

  const blogToDelete = await Blog.findById(request.params.id)
  console.log('blogtodelete', blogToDelete)

  if (blogToDelete.user.toString() === user._id.toString()){
    await Blog.findByIdAndRemove(request.params.id)
    const update = await User.findByIdAndUpdate(user._id, { $pull: { blogs: request.params.id } }, { new: true })
    console.log('update', update)
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  console.log(blog)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  console.log(updatedBlog)
  response.json(updatedBlog)
})

module.exports = blogsRouter