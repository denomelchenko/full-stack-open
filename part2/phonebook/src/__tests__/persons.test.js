import { beforeEach, describe, expect, test, vi } from 'vitest'
import axios from 'axios'
import personsService from '../services/persons'

vi.mock('axios')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('persons service', () => {
  test('getAll reads the whole collection', async () => {
    axios.get.mockResolvedValue({ data: [{ name: 'Arto Hellas' }] })

    const result = await personsService.getAll()

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/persons')
    expect(result).toEqual([{ name: 'Arto Hellas' }])
  })

  test('create posts a new person and returns the response', async () => {
    axios.post.mockResolvedValue({ data: { name: 'Ada Lovelace', id: '9' } })

    const result = await personsService.create({
      name: 'Ada Lovelace',
      number: '12-34-5678',
    })

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/persons', {
      name: 'Ada Lovelace',
      number: '12-34-5678',
    })
    expect(result).toEqual({ name: 'Ada Lovelace', id: '9' })
  })

  test('update puts the person to its own URL', async () => {
    axios.put.mockResolvedValue({ data: { name: 'Ada Lovelace', id: '9' } })

    await personsService.update('9', { name: 'Ada Lovelace', number: '99' })

    expect(axios.put).toHaveBeenCalledWith('http://localhost:3001/persons/9', {
      name: 'Ada Lovelace',
      number: '99',
    })
  })

  test('remove deletes the person URL without a body', async () => {
    axios.delete.mockResolvedValue({ data: {} })

    await personsService.remove('9')

    expect(axios.delete).toHaveBeenCalledWith('http://localhost:3001/persons/9')
  })
})
