import { useState } from 'react'

const Blog = ({ blog, user, editBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonStyle = {
    backgroundColor: 'dodgerblue',
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='togglableContent1'>
        {blog.title} {blog.author} <button onClick={toggleVisibility} id='view'>view</button>
      </div>
      <div style={showWhenVisible} className='togglableContent2'>
        <p>{blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button><br />{blog.url}<br />likes: {blog.likes} <button onClick={() => editBlog(blog)} value={blog} id='like'>like</button><br />{user.name}<br /><button onClick={() => deleteBlog(blog)} value='remove' style={buttonStyle} id='remove'>remove</button>
        </p>
      </div>
    </div>

  )}

export default Blog