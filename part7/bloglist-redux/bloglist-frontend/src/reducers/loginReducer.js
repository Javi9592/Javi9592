import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import storageService from '../services/storage'
import { setNotification } from './notificationReducer'

const initialState = null

const notificationSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser(_state, action) {
      return action.payload
    },
    // eslint-disable-next-line no-unused-vars
    clearUser(_state, _action) {
      return null
    },
  },
})

export const { loginUser, clearUser } = notificationSlice.actions

export const setUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      dispatch(loginUser(user))
      storageService.saveUser(user)
      dispatch(setNotification('¡welcome!', 'info', 5))
    } catch (e) {
      dispatch(setNotification('wrong username or password', 'error', 5))
    }
  }
}

export default notificationSlice.reducer
