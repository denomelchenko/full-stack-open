import { describe, expect, test } from 'vitest'
import request from 'supertest'
import { loadApp } from './testApi'

describe('phonebook backend', () => {
  test('GET /api/persons returns the hardcoded phonebook', async () => {
    const app = loadApp()

    const response = await request(app).get('/api/persons')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(4)
    expect(response.body[0]).toEqual({
      id: '1',
      name: 'Arto Hellas',
      number: '040-123456',
    })
    expect(response.body[3]).toEqual({
      id: '4',
      name: 'Mary Poppendieck',
      number: '39-23-6423122',
    })
  })
})
