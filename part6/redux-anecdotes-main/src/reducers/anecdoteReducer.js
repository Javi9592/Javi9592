import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : { ...anecdote, votes: anecdote.votes + 1 }
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteCount = (object) => {
  return async dispatch => {
    const updatedObject = {
      content: object.content,
      id: object.id,
      votes: object.votes + 1
    }
    const updatedAnecdote = await anecdoteService.updateVote(updatedObject)
    dispatch(vote(updatedAnecdote.id))
  }
}

export default anecdoteSlice.reducer