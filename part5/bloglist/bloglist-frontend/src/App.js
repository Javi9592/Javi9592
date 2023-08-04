import { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import GoodNotification from './components/goodNotification'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlog from './components/NewBlog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [succedMessage, setSuccedMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccedMessage(`${user.name} logged in`)
      setTimeout(() => {
        setSuccedMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {

    try {
      const addNew = await blogService.create(blogObject)
      setBlogs(blogs.concat(addNew))
      setSuccedMessage(`a new blog ${blogObject.title} by ${blogObject.author}`)
      setTimeout(() => {
        setSuccedMessage(null)
      }, 5000)
    }
    // eslint-disable-next-line no-unused-vars
    catch(error) {
      setErrorMessage('missing title, author or url')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const editBlog = async (blog) => {
    const blogObject = {
      id: blog.id,
      title: blog.title,
      url: blog.url,
      author: blog.author,
      likes: blog.likes + 1,
    }

    await blogService.update(blog.id, blogObject)
    setBlogs(
      blogs.map((b) => {
        if (blog.id === b.id) {
          return blogObject
        }
        return b
      })
    )
  }

  const deleteBlog = async (blog) => {
    const id = blog.id
    const title = blog.title

    const confirm = window.confirm(`are you sure to delete the blog ${title}`)
    if (confirm) {
      try {
        await blogService.deleteBlog(id)
        const positionDelete = blogs.indexOf(blog)
        setBlogs(blogs.toSpliced(positionDelete, 1))
        setSuccedMessage(`a blog ${title} has been removed`)
      } catch (exception){
        setErrorMessage('Unauthorized to delete')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const styleWrong = {
    color: 'red',
  }

  const styleGreen = {
    color: 'green',
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification errorMessage={errorMessage} style={styleWrong} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification errorMessage={errorMessage} style={styleWrong} />
      <GoodNotification message={succedMessage} style={styleGreen} />
      <p>
        {user.name} logged-in <button onClick={logOut}>logout</button>
      </p>
      <Togglable buttonLabel="newBlog">
        <NewBlog
          addBlog={addBlog}
        />
      </Togglable>
      <Blogs
        user={user}
        blogs={blogs}
        addBlog={addBlog}
        editBlog={editBlog}
        deleteBlog={deleteBlog}
      />
    </div>
  )
}

export default App
