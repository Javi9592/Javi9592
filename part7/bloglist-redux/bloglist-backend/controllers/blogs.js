const router = require('express').Router()
const Blog = require('../models/blog')

const { userExtractor } = require('../utils/middleware')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

router.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ? likes : 0,
  })

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  blog.user = user._id

  let createdBlog = await blog.save()

  user.blogs = user.blogs.concat(createdBlog._id)
  await user.save()

  createdBlog = await Blog.findById(createdBlog._id).populate('user')

  response.status(201).json(createdBlog)
})

router.put('/:id', async (request, response) => {
  const { title, url, author, likes } = request.body

  let updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, url, author, likes },
    { new: true }
  )

  updatedBlog = await Blog.findById(updatedBlog._id).populate('user')

  response.json(updatedBlog)
})

router.get('/:id/comments', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user')
    if (!blog) {
      return response.status(404).json({ error: 'Blog no encontrado' })
    }

    response.json(blog.comments)
  } catch (error) {
    response.status(500).json({ error: 'Error al obtener los comentarios' })
  }
})

router.patch('/:id/comments', async (request, response) => {
  const { comment } = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { $push: { comments: comment } },
      { new: true, upsert: true } // Usamos 'upsert: true' para crear el objeto si no existe
    ).populate('user')

    response.json(updatedBlog)
  } catch (error) {
    response.status(500).json({ error: 'Error al agregar el comentario' })
  }
})

router.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const user = request.user

  if (!user || blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  user.blogs = user.blogs.filter((b) => b.toString() !== blog.id.toString())

  await user.save()
  await blog.remove()

  response.status(204).end()
})

module.exports = router
