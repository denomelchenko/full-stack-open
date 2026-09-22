const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')
const errorHandler = require('./errorHandler')

const app = express()

// the production frontend build, served before any route
app.use(express.static('dist'))

app.use(express.json())
app.use(cors())
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' },
]

app.get('/info', (request, response) => {
  response.send(
    '<p>Phonebook has info for ' +
      persons.length +
      ' people</p><p>' +
      new Date() +
      '</p>'
  )
})

app.get('/api/persons', async (request, response) => {
  const people = await Person.find({})
  response.json(people)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find((item) => item.id === request.params.id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

app.post('/api/persons', async (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  const duplicate = await Person.exists({ name: body.name })

  if (duplicate) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  const savedPerson = await person.save()
  return response.json(savedPerson)
})

app.put('/api/persons/:id', async (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  const updatedPerson = await Person.findByIdAndUpdate(
    request.params.id,
    { name: body.name, number: body.number },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedPerson) {
    return response.json(updatedPerson)
  }

  return response.status(404).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
