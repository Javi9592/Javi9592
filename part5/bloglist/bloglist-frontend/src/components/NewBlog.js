import { useState } from 'react'

const NewBlog = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addNewBlog = (event) => {
    event.preventDefault()
    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addNewBlog}>
        <div>title: <input  value={newTitle} onChange={(event) => setNewTitle(event.target.value)} id='newTitle'/></div>
        <div>author: <input value={newAuthor} onChange={(event) => setNewAuthor(event.target.value)} id='newAuthor'/></div>
        <div>url: <input value={newUrl} onChange={(event) => setNewUrl(event.target.value)} id='newUrl'/></div>
        <button type="submit" id='create-button'>create</button>
      </form>
    </>
  )
}

export default NewBlog