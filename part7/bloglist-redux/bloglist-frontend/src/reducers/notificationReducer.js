import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
  info: ''
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setValue(state, action) {
      state.value = action.payload
    },
    setInfo(state, action) {
      state.info = action.payload
    },
    clearValue(state) {
      state.value = null
    },
    setTimerId(state, action) {
      state.timerId = action.payload
    },
    clearTimerId(state) {
      state.timerId = null
    },
  },
})

export const { setValue, clearValue, setInfo, clearTimerId, setTimerId } = notificationSlice.actions

export const setNotification = (string, info, time) => {
  return async (dispatch, getState) => {
    const { timerId } = getState().notification

    if (timerId) {
      clearTimeout(timerId)  // Cancelar el temporizador anterior
      dispatch(clearTimerId())  // Limpiar el identificador del temporizador
    }

    const newTimerId = setTimeout(() => {
      dispatch(clearValue())
      dispatch(clearTimerId())  // Limpiar el identificador del temporizador
    }, time * 1000)

    dispatch(setTimerId(newTimerId))  // Establecer el identificador del nuevo temporizador
    dispatch(setValue(string))
    dispatch(setInfo(info))
  }
}

export default notificationSlice.reducer
