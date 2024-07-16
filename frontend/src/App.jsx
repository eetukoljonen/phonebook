import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personService from './services/persons'

const Notification = ({ message, className }) => {
	if (message === null) {
		return null
	}

	return (
		<div className={className}>
			{message}
		</div>
	)
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')
	const [notification, setNotification] = useState('')
	const [className, setClassName] = useState('')

	const hook = () => {
		personService
			.getAll()
			.then(initialPersons => {
				setPersons(initialPersons)
			})
	}

	useEffect(hook, [])

	const showNotification = (msg, className) => {
		setClassName(className)
		setNotification(msg)
		setTimeout(() => {
			setNotification(null)
		}, 5000)
	}

	const addNewContact = (event) => {
		event.preventDefault()
		const personObject = {
			name: newName,
			number: newNumber
		}
		const existingPerson = persons.find((person => person.name === newName))
		if (existingPerson) {
			if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`)) {
				personService
				.update(existingPerson.id, personObject)
				.then(returnedPerson => {
					setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
					setNewName('')
					setNewNumber('')
					showNotification(`Changed ${returnedPerson.name} number to ${returnedPerson.number}`, 'success')

				})
				.catch(error => {
					setPersons(persons.filter(person => person.id !== existingPerson.id))
					setNewName('')
					setNewNumber('')
					showNotification(`Information of ${existingPerson.name} has already been removed from server`, 'error')
				})
			}
			return ;
		}

		personService
			.create(personObject)
			.then(returnedPerson => {
				setPersons(persons.concat(returnedPerson))
				setNewName('')
				setNewNumber('')
				showNotification(`Added ${returnedPerson.name}`, 'success')
			})
	}

	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}

	const handleFilterChange = (event) => {
		setFilter(event.target.value)
	}

	const deleteUser = (id, name) => {
		if (window.confirm(`Delete ${name} ?`)) {
			personService
				.deletePerson(id)
				.then(deletedPerson => {
					setPersons(persons.filter(person => person.id !== id))
					showNotification(`Deleted ${deletedPerson.name}`, 'success')
				})
		}
	}

	const filtered = filter
		? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
		: persons
	
	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={notification} className={className}/>
			<Filter filter={filter} handleFilterChange={handleFilterChange} />
			<h2>add a new</h2>
			<PersonForm
				addNewContact={addNewContact}
				handleNameChange={handleNameChange}
				handleNumberChange={handleNumberChange}
				newName={newName}
				newNumber={newNumber}
			/>
			<h2>Numbers</h2>
			<Persons persons={filtered} handleClick={deleteUser}/>
		</div>
	)
}

export default App