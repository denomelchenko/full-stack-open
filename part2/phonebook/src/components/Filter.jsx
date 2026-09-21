const Filter = ({ value, onChange }) => (
  <div>
    <label htmlFor="filter">filter shown with</label>
    <input id="filter" value={value} onChange={onChange} />
  </div>
)

export default Filter
