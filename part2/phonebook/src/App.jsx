import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find((person) => person.name === newName)

    if (existing) {
      if (
        window.confirm(
          newName +
            ' is already added to phonebook, replace the old number with a new one?'
        )
      ) {
        personsService
          .update(existing.id, { ...existing, number: newNumber })
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === existing.id ? returnedPerson : person
              )
            )
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    personsService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
    })
  }

  const handleDelete = (person) => {
    if (window.confirm('Delete ' + person.name + '?')) {
      personsService.remove(person.id).then(() => {
        setPersons(persons.filter((item) => item.id !== person.id))
      })
    }
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        onNumberChange={(event) => setNewNumber(event.target.value)}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={handleDelete} />
    </div>
  )
}

export default App
