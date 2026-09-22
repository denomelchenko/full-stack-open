const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

// the current material adds { family: 4 } so Atlas is reached over IPv4
mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: (value) => /^\d{2,3}-\d+$/.test(value),
      message: (props) => props.value + ' is not a valid phone number',
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
module.exports.personSchema = personSchema
