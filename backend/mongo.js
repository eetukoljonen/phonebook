const mongoose = require('mongoose')

const printExample = () => {
  console.log(
    'example usage:\n',
    'node mongo.js <password> === outputs the database\n',
    'node mongo.js <password> <name> <number> === add a new contact'
  )
}

if (process.argv.length < 3 || process.argv.length === 4 || process.argv.length > 5) {
  printExample()
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://eetufullstack:${password}@cluster0.uhv0r0u.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

switch(process.argv.length) {
case 3:
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
  break
case 5:
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
  break
default:
  printExample()
  mongoose.connection.close()
}