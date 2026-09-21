import { describe, expect, test, vi } from 'vitest'
import axios from 'axios'
import weatherService from '../services/weather'

vi.mock('axios')

describe('weather service', () => {
  test('getWeather reads the current conditions of the capital from Open-Meteo', async () => {
    axios.get.mockResolvedValue({
      data: {
        current: { temperature_2m: 14.6, wind_speed_10m: 27, weather_code: 3 },
      },
    })

    const result = await weatherService.getWeather([60.17, 24.94])

    expect(axios.get).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude: 60.17,
          longitude: 24.94,
          current: 'temperature_2m,wind_speed_10m,weather_code',
        },
      }
    )
    expect(result).toEqual({ temperature: 14.6, windSpeed: 27 })
  })
})
