import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const personModelPath = require.resolve('../models/person')

// assigned by loadApp(); a binding (not a const) so the closures below are safe
let people = []

const toJson = (document) => ({
  name: document.name,
  number: document.number,
  id: String(document._id),
})

const defineId = (document) => {
  Object.defineProperty(document, 'id', {
    enumerable: false,
    get() {
      return String(this._id)
    },
  })
  return document
}

const defineDocument = (document) => {
  document.toJSON = function () {
    return toJson(this)
  }
  return document
}

// the seed data goes through the same document shape as a saved document
const makeDocument = (data) => {
  const document = { ...data }
  defineDocument(document)
  defineId(document)
  return document
}

const initialPeople = () =>
  [
    { _id: '1', name: 'Arto Hellas', number: '040-123456' },
    { _id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
    { _id: '3', name: 'Dan Abramov', number: '12-43-234345' },
    { _id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' },
  ].map((data) => makeDocument(data))

// these tests use numeric string ids, so anything else behaves like a Mongoose CastError
const isCastError = (id) => !/^\d+$/.test(String(id))

// the real Mongoose rejects with a CastError carrying status 400
const castError = () => {
  const error = new Error('Cast to ObjectId failed for value "' + 'not-an-object-id' + '"')
  error.name = 'CastError'
  error.status = 400
  return error
}

// compiled before the connection is established, exactly like the real model
const FakePerson = function (input) {
  this.name = input.name
  this.number = input.number
  this._id = undefined
  defineDocument(this)
  defineId(this)
}

FakePerson.find = () => Promise.resolve(people)

FakePerson.countDocuments = () => Promise.resolve(people.length)

FakePerson.findById = (id) => {
  if (isCastError(id)) {
    return Promise.reject(castError())
  }
  const found = people.find((person) => person._id === id)
  return Promise.resolve(found === undefined ? null : found)
}

FakePerson.findByIdAndDelete = (id) => {
  if (isCastError(id)) {
    return Promise.reject(castError())
  }
  const index = people.findIndex((person) => person._id === id)
  if (index === -1) {
    return Promise.resolve(null)
  }
  return Promise.resolve(people.splice(index, 1)[0])
}

FakePerson.findByIdAndUpdate = (id, update) => {
  if (isCastError(id)) {
    return Promise.reject(castError())
  }
  const person = people.find((item) => item._id === id)
  if (person === undefined) {
    return Promise.resolve(null)
  }
  if (update.name !== undefined) {
    person.name = update.name
  }
  if (update.number !== undefined) {
    person.number = update.number
  }
  return Promise.resolve(person)
}

FakePerson.create = (input) => new FakePerson(input).save()

FakePerson.exists = (filter) =>
  Promise.resolve(people.some((person) => person.name === filter.name))

FakePerson.prototype.save = function () {
  if (this._id === undefined) {
    this._id = String(people.length + 1)
  }
  people.push(this)
  return Promise.resolve(this)
}

export const loadApp = () => {
  const appPath = require.resolve('../app')
  const testApiPath = require.resolve('./testApi')

  delete require.cache[appPath]
  delete require.cache[testApiPath]

  people = initialPeople()

  require.cache[personModelPath] = {
    id: personModelPath,
    filename: personModelPath,
    loaded: true,
    exports: FakePerson,
  }

  return { app: require('../app'), people, personModelPath, Person: FakePerson }
}
