import { useState } from 'react'
import { createBlog } from '../reducers/blogsReducer'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from 'react-bootstrap'

const BlogForm = ({ toggleVisibility }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(createBlog(title, author, url))
    dispatch(
      setNotification(`A new blog '${title}' by '${author}' added`, 'info', 5)
    )
    setAuthor('')
    setTitle('')
    setUrl('')
    toggleVisibility()
  }

  return (
    <div>
      <h4>Create a New Blog</h4>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Title:</FormLabel>
          <FormControl
            id='title'
            placeholder='title'
            className="form-control"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <FormLabel>Author:</FormLabel>
          <FormControl
            id='author'
            placeholder='author'
            className="form-control"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <FormLabel>Url:</FormLabel>
          <FormControl
            id='url'
            placeholder='url'
            className="form-control"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button className='custom-button' variant='success' type='submit'>
            create
          </Button>
        </FormGroup>
      </Form>
    </div>
  )
}

export default BlogForm
