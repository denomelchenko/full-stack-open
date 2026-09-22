import { describe, expect, test, vi } from 'vitest'
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

  test('GET /info shows the entry count and the request time', async () => {
    const app = loadApp()

    const response = await request(app).get('/info')

    expect(response.status).toBe(200)
    expect(response.text).toContain('<p>Phonebook has info for 4 people</p>')
    expect(response.text).toContain(String(new Date().getFullYear()))
  })

  test('GET /api/persons/:id returns the matching person', async () => {
    const app = loadApp()

    const response = await request(app).get('/api/persons/1')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: '1',
      name: 'Arto Hellas',
      number: '040-123456',
    })
  })

  test('GET /api/persons/:id returns 404 for an unknown id', async () => {
    const app = loadApp()

    const response = await request(app).get('/api/persons/99')

    expect(response.status).toBe(404)
  })

  test('DELETE /api/persons/:id removes the person', async () => {
    const app = loadApp()

    const deleted = await request(app).delete('/api/persons/2')
    const remaining = await request(app).get('/api/persons')

    expect(deleted.status).toBe(204)
    expect(remaining.body).toHaveLength(3)
    expect(remaining.body.map((person) => person.id)).not.toContain('2')
  })

  test('POST /api/persons adds a person with a generated id', async () => {
    const app = loadApp()

    const created = await request(app)
      .post('/api/persons')
      .send({ name: 'Grace Hopper', number: '040-999999' })
    const all = await request(app).get('/api/persons')

    expect(created.status).toBe(200)
    expect(created.body.name).toBe('Grace Hopper')
    expect(created.body.number).toBe('040-999999')
    expect(created.body.id).toBeDefined()
    expect(all.body).toHaveLength(5)
  })

  test('POST without a name is rejected', async () => {
    const app = loadApp()

    const response = await request(app)
      .post('/api/persons')
      .send({ number: '040-999999' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('name and number are required')
  })

  test('POST without a number is rejected', async () => {
    const app = loadApp()

    const response = await request(app)
      .post('/api/persons')
      .send({ name: 'Grace Hopper' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('name and number are required')
  })

  test('POST with a duplicate name is rejected', async () => {
    const app = loadApp()

    const response = await request(app)
      .post('/api/persons')
      .send({ name: 'Arto Hellas', number: '040-999999' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('name must be unique')
  })

  test('logs every request in the tiny format', async () => {
    const app = loadApp()
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

    await request(app).get('/api/persons')
    await new Promise((resolve) => setTimeout(resolve, 20))

    const logged = write.mock.calls.map((call) => String(call[0])).join('')
    expect(logged).toContain('GET /api/persons 200')
    write.mockRestore()
  })

  test('logs the body of a POST request', async () => {
    const app = loadApp()
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

    await request(app)
      .post('/api/persons')
      .send({ name: 'Grace Hopper', number: '040-999999' })
    await new Promise((resolve) => setTimeout(resolve, 20))

    const logged = write.mock.calls.map((call) => String(call[0])).join('')
    // morgan >= 1.11 escapes string token output so a log line stays
    // line-oriented, so the JSON body is logged with escaped quotes.
    const body = '{"name":"Grace Hopper","number":"040-999999"}'
    expect(logged).toContain(body.replaceAll('"', '\\"'))
    write.mockRestore()
  })
})
