import { useEffect, useState } from 'react'
import weatherService from '../services/weather'

const Weather = ({ capital, coordinates }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    weatherService.getWeather(coordinates).then((currentWeather) => {
      setWeather(currentWeather)
    })
  }, [coordinates])

  if (weather === null) {
    return null
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature {weather.temperature} °C</p>
      <p>Wind {weather.windSpeed} km/h</p>
    </div>
  )
}

export default Weather
