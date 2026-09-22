import { beforeEach, describe, expect, test, vi } from 'vitest'
import axios from 'axios'
import personsService from '../services/persons'

vi.mock('axios')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('persons service against the real backend', () => {
  test('getAll uses the relative /api/persons URL', async () => {
    axios.get.mockResolvedValue({ data: [] })

    await personsService.getAll()

    expect(axios.get).toHaveBeenCalledWith('/api/persons')
  })

  test('create posts to the relative /api/persons URL', async () => {
    axios.post.mockResolvedValue({ data: { id: '9' } })

    await personsService.create({ name: 'Ada Lovelace', number: '12-34-5678' })

    expect(axios.post).toHaveBeenCalledWith('/api/persons', {
      name: 'Ada Lovelace',
      number: '12-34-5678',
    })
  })

  test('update puts to /api/persons/:id', async () => {
    axios.put.mockResolvedValue({ data: { id: '9' } })

    await personsService.update('9', { name: 'Ada Lovelace', number: '99' })

    expect(axios.put).toHaveBeenCalledWith('/api/persons/9', {
      name: 'Ada Lovelace',
      number: '99',
    })
  })

  test('remove deletes /api/persons/:id', async () => {
    axios.delete.mockResolvedValue({ data: {} })

    await personsService.remove('9')

    expect(axios.delete).toHaveBeenCalledWith('/api/persons/9')
  })
})
