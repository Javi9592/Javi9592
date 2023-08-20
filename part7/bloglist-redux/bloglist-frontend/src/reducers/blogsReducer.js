import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      return state.map((blog) =>
        blog.id !== id ? blog : { ...blog, likes: blog.likes + 1 }
      )
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlog(_state, action) {
      return action.payload
    },
    removeBlogAction(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
    commentAction(state, action) {
      console.log(action)
      const id = action.payload.id
      return state.map((blog) => (blog.id !== id ? blog : action.payload))
    },
  },
})

export const { vote, appendBlog, setBlog, removeBlogAction, commentAction } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlog(blogs))
  }
}

export const createBlog = (title, author, url) => {
  return async (dispatch) => {
    const newObject = {
      title: title,
      author: author,
      url: url,
    }
    const newBlog = await blogService.create(newObject)
    dispatch(appendBlog(newBlog))
  }
}

export const likeCount = (object) => {
  return async (dispatch) => {
    const updatedObject = {
      content: object.content,
      author: object.author,
      url: object.url,
      id: object.id,
      likes: object.likes + 1,
    }
    const updatedBlog = await blogService.update(updatedObject)
    dispatch(vote(updatedBlog.id))
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id)
      dispatch(removeBlogAction(id))
      dispatch(setNotification('Blog removed successfully', 'info', 5))
    } catch (error) {
      // Manejar el error si la eliminación falla
      dispatch(setNotification('Error removing blog', 'error', 5))
    }
  }
}

export const addComment = (id, comment) => {
  return async (dispatch) => {
    try {
      const edit = await blogService.comments(id, comment)
      console.log('response of blogservice.comments in blogsreducer', edit)
      dispatch(commentAction(edit))
      dispatch(setNotification('Comment added', 'info', 5))
    } catch (error) {
      console.log(error)
      dispatch(setNotification('Error adding comment', 'error', 5))
    }
  }
}

export default blogSlice.reducer
