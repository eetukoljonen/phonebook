
const Persons = ({persons, handleClick}) => (
	<>
		{persons.map(person =>
			<p
				key={person.name}>{person.name} {person.number}
				<button onClick={() => handleClick(person.id, person.name)}>
					delete
				</button>
			</p>
		)
		}
	</>
)

export default Persons