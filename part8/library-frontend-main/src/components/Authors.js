import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import { useState } from 'react'
import { EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const authors = useQuery(ALL_AUTHORS).data.allAuthors
  const [changeAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError(error) {
      console.log(JSON.stringify(error))
      const errors = error.graphQLErrors[0].message
      props.setError(errors)
    },
  })


  if (!props.show) {
    return null
  }

  const update = (event) => {
    event.preventDefault()

    changeAuthor({ variables: { name, setBornTo: born } })
    setBorn('')
  }

  const handleChange = (event) => {
    setName(event.target.value)
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.edit ? (
        <>
          {' '}
          <h3>set birthyear</h3>
          <div>
            <select value={name} onChange={handleChange}>
              {authors.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
            <div>
              born
              <input
                value={born}
                onChange={({ target }) => setBorn(parseInt(target.value))}
              />
            </div>
            <button onClick={update}>update author</button>
          </div>{' '}
        </>
      ) : (
        false
      )}
    </div>
  )
}

export default Authors
