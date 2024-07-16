
const Input = ({text, handleChange, value}) => (
	<div>
		{text}	<input
					value={value}
					onChange={handleChange}
				/>
	</div>
)

const PersonForm = ({addNewContact, newName, newNumber, handleNameChange, handleNumberChange}) => (
	<form onSubmit={addNewContact} >
		<Input text={'name:'} handleChange={handleNameChange} value={newName} />
		<Input text={'number:'} handleChange={handleNumberChange} value={newNumber} />
		<div>
			<button type="submit">add</button>
		</div>
	</form>
)

export default PersonForm