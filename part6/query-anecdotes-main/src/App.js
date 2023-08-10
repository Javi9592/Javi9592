import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData('anecdotes', (oldAnecdotes) =>
      oldAnecdotes.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      ))
      dispatch({ type: 'VOTE', data: updatedAnecdote.content })
      setTimeout(() => {
        dispatch({type: 'DELETE'})
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery('anecdotes', getAnecdotes, {
    retry: 1
  })
  console.log(result)

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }
  if ( result.isError ) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
