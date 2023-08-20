import { useSelector } from 'react-redux'
import { useRef } from 'react'
import Togglable from './Togglable'
import NewBlog from './NewBlog'
import Blog from './Blog'
import { Table } from 'react-bootstrap'

const Blogs = () => {
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()
  const toggleBlogFormVisibility = () => {
    blogFormRef.current.toggleVisibility()
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <>
      <h2>Blog app</h2>
      <Togglable buttonLabel='New blog' ref={blogFormRef}>
        <NewBlog toggleVisibility={toggleBlogFormVisibility} />
      </Togglable>
      <Table striped>
        <tbody>
          {[...blogs].sort(byLikes).map((blog) => (
            <tr key={blog.id}>
              <Blog
                blog={blog}
                canRemove={user && blog.user.username === user.username}
              />
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Blogs
