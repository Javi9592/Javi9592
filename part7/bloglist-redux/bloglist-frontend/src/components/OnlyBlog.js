import { useParams } from 'react-router-dom'
import { likeCount } from '../reducers/blogsReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { removeBlog } from '../reducers/blogsReducer'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { addComment } from '../reducers/blogsReducer'
import { Button } from 'react-bootstrap'

const OnlyBlog = ({ blogs, user }) => {
  const [commentary, setComment] = useState('')
  const id = useParams().id
  const blog = blogs.find((n) => n.id === id)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const like = async (blog) => {
    dispatch(likeCount(blog))
    dispatch(
      setNotification(
        `A like for the blog '${blog.title}' by '${blog.author}'`,
        'info',
        5
      )
    )
  }

  const remove = async (blog) => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`
    )
    if (ok) {
      dispatch(removeBlog(blog.id))
      navigate('/')
    }
  }

  const addCommentary = (blog) => {
    const comment = {
      comment: commentary
    }
    const id = blog.id
    dispatch(addComment(id, comment))
    setComment('')
  }

  if (!blog) {
    return null
  }

  const canRemove = blog.user.username === user.username ? true : false
  return (
    <div>
      <h3>Blog App</h3>
      <h2>{blog.title} {blog.author}</h2>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        {blog.likes} likes <Button className='custom-button' variant='success' type='button' onClick={() => like(blog)}>Like</Button>
      </p>
      <p>added by {blog.user.name}</p>
      {canRemove && <Button className='custom-button' variant='danger' type='button' onClick={() => remove(blog)}>Remove Blog</Button>}
      <h3>Comments</h3>
      <div>
        <div>
          <input
            id='comment'
            value={commentary}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button className='custom-button' variant='info' onClick={() => addCommentary(blog)} type='button'>Add Comment</Button>
        </div>
      </div>
      <ul>
        {blog.comments.length === 0
          ? null
          : blog.comments.map((comment, id) => <li key={id}>{comment}</li>)}
      </ul>
    </div>
  )
}

export default OnlyBlog
