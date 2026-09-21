const Person = ({ person, onDelete }) => (
  <p>
    {person.name} {person.number}{' '}
    <button onClick={() => onDelete(person)}>delete</button>
  </p>
)

export default Person
