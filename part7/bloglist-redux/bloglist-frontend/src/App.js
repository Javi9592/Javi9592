import { useEffect } from 'react'
import storageService from './services/storage'
import LoginForm from './components/Login'
import Notification from './components/Notification'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogsReducer'
import { loginUser } from './reducers/loginReducer'
import { Link, Route, Routes } from 'react-router-dom'
import { clearUser } from './reducers/loginReducer'
import { setNotification } from './reducers/notificationReducer'
import { initializeUsers } from './reducers/usersReducer'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import OnlyBlog from './components/OnlyBlog'
import { Button, Navbar, Nav } from 'react-bootstrap'

const App = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const user = storageService.loadUser()
    dispatch(loginUser(user))
  }, [])

  const logout = async () => {
    dispatch(clearUser())
    storageService.removeUser()
    dispatch(setNotification('logged out', 'info', 5))
  }

  if (user === null) {
    return (
      <div className='container'>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  const padding = { paddingRight: 5 }

  return (
    <div className='container'>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='#' as='span'>
              <Link to='/' style={padding} className='no-underline'>
                Blogs
              </Link>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <Link style={padding} to='/users' className='no-underline'>
                Users
              </Link>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <em>{user.name} logged in</em>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <Button
                size='sm'
                variant='warning'
                type='button'
                onClick={logout}
              >
                Logout
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Notification />
      <div>
        <Routes>
          <Route path='/' element={<Blogs />} />
          <Route path='/users' element={<Users Link={Link} users={users} />} />
          <Route path='/users/:id' element={<User users={users} />} />
          <Route
            path='/blogs/:id'
            element={<OnlyBlog blogs={blogs} user={user} />}
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
