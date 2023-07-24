const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)

const Blog = require('../models/blog')

let token
beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({ username: 'root', name: 'Master User', password: passwordHash })

  await user.save()

  const userForToken = {
    username: user.username,
    id: user.id,
  }
  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.deleteMany({})
  blogs = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user.id }))
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('all blogs returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Looking the properties', () => {
  test('The id name is "id"', async () => {
    const blogs = await helper.blogsInDb()
    // Verificamos que la propiedad "id" esté definida en lugar de "_id"
    for (const blog of blogs) {
      const result = await blog
      // Hacer algo con el resultado de la promesa
      expect(result.id).toBeDefined()
      expect(result._id).toBeUndefined()
    }
  })
})

describe('addition of a new blog', () => {
  test('succed with valid data and token', async () => {
    const initialResponse = await api.get('/api/blogs')

    const newBlog = {
      title: 'JavaScript closest',
      author: 'David Walsh',
      url: 'https://davidwalsh.name/element-closest',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialResponse.body.length + 1)
  })

  test('can add without likes property', async () => {
    const newBlog = {
      title: 'JavaScript closest',
      author: 'David Walsh',
      url: 'https://davidwalsh.name/element-closest'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)

    expect(response.body.likes).toBeDefined()
  })

  test('fails with status code 400 if data invalid', async () => {
    const newBlog = {
      url: 'https://davidwalsh.name/element-closest',
      likes: 8
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(400)
  })

  test('cannot add blogs without a valid token', async () => {
    const newBlog = {
      title: 'Full Stack',
      author: 'StackMaster',
      url: 'https://stack.com/',
      likes: 1
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', 'wrong token')

    expect(response.status).toBe(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const newBlog = {
      title: 'Full Stack',
      author: 'StackMaster',
      url: 'https://stack.com/',
      likes: 1
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)

    const response = await api.get(`/api/blogs/${result.body.id}`)
    const deleteBlog = await api
      .delete(`/api/blogs/${result.body.id}`)
      .set('Authorization', `bearer ${token}`)
    expect(deleteBlog.status).toBe(204)
  })
})

describe('editing one blog', () => {
  test('succed with valid data', async () => {
    const editBlog = {
      title: 'React Patterns',
      author: 'Michael R Chan',
      url: 'https://reactpatterns.com/',
      likes: 9
    }
    const blogs = await helper.blogsInDb()
    const blogToEdit =  blogs[0]
    console.log(blogToEdit)

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(editBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const editPart = blogsAtEnd.map(r => r.author)
    expect(editPart).toContain(
      'Michael R Chan'
    )
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

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
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})


afterAll(() => {
  mongoose.connection.close()
})