const morgan = require('morgan')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.delete('/api/persons/:id', (request, response) => {
	const id = request.params.id
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})

app.get('/info', (request, response) => {
	const timestamp = new Date().toString()
	response.send(
		`<p>Phonebook has info for ${persons.length} people<p/>
		<p>${timestamp}<p/>`
	)
})

function generateId() {
	return String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
}

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({ 
			error: 'name missing' 
		})
	}

	if (!body.number) {
		return response.status(400).json({ 
			error: 'number missing' 
		})
	}

	if (persons.find(person => person.name === body.name)) {
		return response.status(400).json({ 
			error: `${body.name} already added`
		})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId()
	}

	persons = persons.concat(person)

	response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
	const body = request.body
	const id = request.params.id
	const person = persons.find(person => person.id === id)

	if (!person) {
		return response.status(404).end()
	}

	if (!body.name) {
		return response.status(400).json({ 
			error: 'name missing' 
		})
	}

	if (!body.number) {
		return response.status(400).json({ 
			error: 'number missing' 
		})
	}

	const personObject = {
		name: body.name,
		number: body.number,
		id: person.id
	}

	persons = persons.concat(personObject)

	response.json(personObject)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
