const PersonForm = ({
  onSubmit,
  newName,
  onNameChange,
  newNumber,
  onNumberChange,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      <label htmlFor="name">name</label>
      <input id="name" value={newName} onChange={onNameChange} />
    </div>
    <div>
      <label htmlFor="number">number</label>
      <input id="number" value={newNumber} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

export default PersonForm
