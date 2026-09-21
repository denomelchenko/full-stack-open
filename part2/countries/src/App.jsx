import { useEffect, useState } from 'react'
import countriesService from './services/countries'
import Country from './components/Country'
import CountryList from './components/CountryList'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    countriesService.getAll().then((allCountries) => {
      setCountries(allCountries)
    })
  }, [])

  const matches = countries.filter((country) =>
    country.name.common.toLowerCase().includes(query.toLowerCase())
  )

  const details =
    selected !== null ? selected : matches.length === 1 ? matches[0] : null

  return (
    <div>
      <div>
        <label htmlFor="query">find countries</label>
        <input
          id="query"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setSelected(null)
          }}
        />
      </div>

      {query !== '' && matches.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {query !== '' &&
        selected === null &&
        matches.length > 1 &&
        matches.length <= 10 && (
          <CountryList countries={matches} onShow={setSelected} />
        )}

      {details !== null && <Country details={details} />}
    </div>
  )
}

export default App
