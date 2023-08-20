import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer.js'
import blogsReducer from './reducers/blogsReducer.js'
import loginReducer from './reducers/loginReducer.js'
import usersReducer from './reducers/usersReducer.js'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: loginReducer,
    users: usersReducer
  },
})

export default store
