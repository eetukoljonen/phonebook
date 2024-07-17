require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(note => {
			if (note)
				response.json(note)
			else
				response.status(404).end()
		})
		.catch(error => next((error)))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.get('/info', (request, response) => {
	const timestamp = new Date().toString()
	Person.find({}).then(persons => {
		const length = persons.length
		response.send(
			`<p>Phonebook has info for ${length} people</p>
			<p>${timestamp}</p>`
		)
	})
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

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body
	const id = request.params.id

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
		number: body.number
	}

	Person.findByIdAndUpdate(id, personObject, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
