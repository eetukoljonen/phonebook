const { request } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
	{
		"name": "Ada Lovelace",
		"number": "39-44-5323523",
		"id": "1"
	  },
	  {
		"name": "Dan Abramov",
		"number": "12-43-234345",
		"id": "2"
	  },
	  {
		"name": "Mary Poppendieck",
		"number": "39-23-6423122",
		"id": "3"
	  },
	  {
		"name": "Gary Ibrahimovic",
		"number": "12-14-6423123",
		"id": "4"
	  }
]

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = request.params.id
	const person = persons.find(person => person.id === id)
	if (person)
		response.json(person)
	else
		response.status(404).end()
})

app.get('/info', (request, response) => {
	const timestamp = new Date().toString()
	response.send(
		`<p>Phonebook has info for ${persons.length} people<p/>
		<p>${timestamp}<p/>`
	)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})