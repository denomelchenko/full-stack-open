import { describe, expect, test, vi } from 'vitest'
import axios from 'axios'
import countriesService from '../services/countries'

vi.mock('axios')

describe('countries service', () => {
  test('getAll fetches the whole list from the course mirror', async () => {
    axios.get.mockResolvedValue({ data: [{ name: { common: 'Finland' } }] })

    const result = await countriesService.getAll()

    expect(axios.get).toHaveBeenCalledWith(
      'https://studies.cs.helsinki.fi/restcountries/api/all'
    )
    expect(result).toEqual([{ name: { common: 'Finland' } }])
  })
})
