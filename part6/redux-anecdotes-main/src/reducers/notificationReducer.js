import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setValue(state, action) {
      return action.payload
    },
    clearValue(state, action) {
      return null
    }
  }
})

export const { setValue, clearValue } = notificationSlice.actions

export const setNotification = (string, time) => {
  return async dispatch => {
    dispatch(setValue(string))
    setTimeout(() => {
      dispatch(clearValue())
    }, time * 1000)
  }
}

export default notificationSlice.reducer