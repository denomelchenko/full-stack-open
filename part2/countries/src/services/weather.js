import axios from 'axios'

const baseUrl = 'https://api.open-meteo.com/v1/forecast'

const getWeather = (coordinates) => {
  const [latitude, longitude] = coordinates

  const request = axios.get(baseUrl, {
    params: {
      latitude,
      longitude,
      current: 'temperature_2m,wind_speed_10m,weather_code',
    },
  })

  return request.then((response) => ({
    temperature: response.data.current.temperature_2m,
    windSpeed: response.data.current.wind_speed_10m,
  }))
}

export default { getWeather }
