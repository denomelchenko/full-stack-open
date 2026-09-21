const CountryList = ({ countries, onShow }) => (
  <ul>
    {countries.map((country) => (
      <li key={country.name.common}>
        {country.name.common}{' '}
        <button onClick={() => onShow(country)}>show</button>
      </li>
    ))}
  </ul>
)

export default CountryList
