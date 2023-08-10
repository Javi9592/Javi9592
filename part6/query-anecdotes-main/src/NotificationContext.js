import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NEW":
        return `anecdote '${action.data}' added`
    case "VOTE":
        return `anecdote '${action.data}' voted`
    case 'DELETE':
      return null
    case 'SHORT':
      return 'too short anecdote, must have length 5 or more'
    default:
        return state
  }
}
  
  const NotificationContext = createContext()
  
  export const NotificationContextProvider = (props) => {
    const [message, messageDispatch] = useReducer(notificationReducer, null)
  
    return (
      <NotificationContext.Provider value={ [message, messageDispatch] }>
        {props.children}
      </NotificationContext.Provider>
    )
  }

  export const useNotificationValue = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[0]
  }
  
  export const useNotificationDispatch = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[1]
  }
  
  export default NotificationContext