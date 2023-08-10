import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteCount } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if ( filter === '' ) {
          return anecdotes
        } else {
            return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
        }
    })

    const vote = (anecdote) => {
    dispatch(voteCount(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))

    }
   
    function compareLikes(objectA, objectB) {
    return objectB.votes - objectA.votes
    }
    const sortedAnecdotes = [...anecdotes].sort(compareLikes)

  return(
    <>
        {sortedAnecdotes.map(anecdote =>
            <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => vote(anecdote)}>vote</button>
                </div>
            </div>
        )}
    </>
  )
}

export default AnecdoteList