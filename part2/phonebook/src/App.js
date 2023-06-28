import React, { useState, useEffect } from 'react'
import noteService from './services/phonebook'
import axios from 'axios'

const Filter = ({filter, handleFilterChange}) => <div>filter shown with: <input value={filter} onChange={handleFilterChange}/></div>

const PersonForm = ({addName, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
  <form onSubmit={addName}>        
      <div>name: <input value={newName} onChange={handleNameChange}/></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
  </form>
  )
}

const Persons = ({personsToShow, deletePerson}) => {
  return (
    <>
      { personsToShow.map((item, i) => <h4 key={item.id}>{item.name} {item.number} <button onClick={(e) => deletePerson(e, 'value')} value={item.id} name={item.name}>Delete</button></h4>)}
    </>
  )
}

const Notification = ({ message, style}) => {
  if (message === null) {
    return null
  }

  return (
    <div className="alert" style={style}>
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setNewFilter ] = useState('')
  const [ filterPersons, setFilterPersons ] = useState(persons)
  const [ showAll, setShowAll] = useState(true)
  const [alertMessage, setAlertMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const personsToShow = showAll ? persons : filterPersons

  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setPersons(initialNotes)
  })
  }, [])
  
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    filterPhone(event.target.value)
    if (event.target.value.length > 0) {
      setShowAll(false)
    } else if (event.target.value.length === 0){
      setShowAll(true)
    }
  }

  const deletePerson = (e) => {
    console.log(e.target.value);
    console.log(e.target.name);  
    if (window.confirm(`Delete ${e.target.name}?`)) {
      axios.delete(`http://localhost:3001/persons/${e.target.value}`)
      const copyPersons = persons.filter(item => item.id !== parseInt(e.target.value))
      setPersons(copyPersons);
    }    
  }


  const filterPhone = (filter) => {
    const names = persons.map(item => item.name)
    const regex = new RegExp(filter, "i")
    const filteredListNames = names.filter(item => item.match(regex))
    const copyPersons = persons.filter(item => filteredListNames.includes(item.name))
    setFilterPersons(copyPersons)
  }
  const addName  = (event) => {
    event.preventDefault()
    const alreadyAdded = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
    if (alreadyAdded) {
      if (window.confirm(`${newName} is already added tho phonebook, replace the old number with a new one?`)) {
        const ids = persons.map(item => item.id)
        const indexNew = ids.indexOf(alreadyAdded.id)
        axios.put(`http://localhost:3001/persons/${alreadyAdded.id}`, {name: alreadyAdded.name, number: newNumber})
        .then(response => {
          const copyPersons = persons.toSpliced(indexNew, 1, response.data)
          setPersons(copyPersons)
          setNewFilter('')
          setNewName('')
          setNewNumber('')
          setAlertMessage(
            `${response.data.name} number changed`
          )
          setTimeout(() => {
            setAlertMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log('hello')
          setErrorMessage(`Information of '${alreadyAdded.name}' has already been removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
      }
    } else {

    const name =
      {
        name: newName,
        number: newNumber
      }
      noteService
      .create(name)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewFilter('')
        setNewName('')
        setNewNumber('')
        setAlertMessage(
          `Added ${returnedPerson.name}`
        )
        setTimeout(() => {
          setAlertMessage(null)
        }, 5000)
      })
    }
      
  }

  const setStyle = {
    color: 'red'
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={alertMessage} />
      <Notification message={errorMessage} style={setStyle}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App