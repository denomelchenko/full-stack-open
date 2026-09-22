require('dotenv').config()

const mongoose = require('mongoose')
const Person = require('./models/person')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

if (!password) {
  console.log('usage: node mongo.js <password> <name> <number>')
  console.log('       node mongo.js <password>   (lists every entry)')
  process.exit(1)
}

if (!process.env.MONGODB_URI) {
  console.log('MONGODB_URI is missing - run the wizard so part3/phonebook-backend/.env exists')
  process.exit(1)
}

const main = async () => {
  // getters and setters are applied after connect(), so wait for the connection first
  await mongoose.connection.asPromise()

  if (name && number) {
    const person = new Person({ name, number })
    const saved = await person.save()
    console.log('added ' + saved.name + ' number ' + saved.number + ' to phonebook')
  } else if (name === undefined) {
    const people = await Person.find({})
    console.log('phonebook:')
    people.forEach((person) => {
      console.log(person.name + ' ' + person.number)
    })
  } else {
    console.log('usage: node mongo.js <password> <name> <number>')
    process.exitCode = 1
  }

  await mongoose.connection.close()
}

main().catch((error) => {
  console.error('mongo.js failed:', error.message)
  process.exit(1)
})
