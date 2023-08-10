import { createAnecdote } from "../requests"
import { useMutation, useQueryClient } from 'react-query'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onMutate: (newAnecdote) => {
      if (newAnecdote.content.length < 5) {
        throw new Error('Content length should be at least 5 characters')
      }
      // Puedes realizar cualquier otra lógica de preparación aquí si es necesario
        return newAnecdote
      },
    onSuccess: (updateAnecdote) => {
      dispatch({type: 'NEW', data: updateAnecdote.content})
      queryClient.invalidateQueries('anecdotes')
      setTimeout(() => {
        dispatch({type: 'DELETE'})
      }, 5000)
    },
    onError: (error) => {
      if (error.message === 'Content length should be at least 5 characters') {
        dispatch({type: 'SHORT'})
        setTimeout(() => {
          dispatch({type: 'DELETE'})
        }, 5000)
      }
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    newAnecdoteMutation.mutate({ content, votes: 0 })
    event.target.anecdote.value = ''
  }



  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
