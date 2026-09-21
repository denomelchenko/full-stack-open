import Weather from './Weather'

const Country = ({ details }) => (
  <div>
    <h2>{details.name.common}</h2>
    <p>capital {details.capital.join(', ')}</p>
    <p>area {details.area}</p>
    <h3>languages</h3>
    <ul>
      {Object.values(details.languages || {}).map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>
    <img
      src={details.flags.png}
      alt={details.flags.alt || ''}
      width="150"
    />
    <Weather
      capital={details.capital[0]}
      coordinates={details.capitalInfo.latlng}
    />
  </div>
)

export default Country
