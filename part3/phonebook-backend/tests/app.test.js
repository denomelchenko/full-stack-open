import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import request from 'supertest'
import { loadApp } from './testApi'

let app
let people

beforeEach(() => {
  const loaded = loadApp()
  app = loaded.app
  people = loaded.people
})

describe('phonebook backend', () => {
  test('GET /api/persons returns the people from the database', async () => {
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

  test('GET /api/persons serves the documents held by the model', async () => {
    const loaded = loadApp()
    const person = new loaded.Person({ name: 'New Person', number: '040-000000' })
    await person.save()

    const response = await request(loaded.app).get('/api/persons')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(5)
    expect(response.body[4].name).toBe('New Person')
  })

  test('GET /info shows the entry count and the request time', async () => {
    const response = await request(app).get('/info')

    expect(response.status).toBe(200)
    expect(response.text).toContain('<p>Phonebook has info for 4 people</p>')
    expect(response.text).toContain(String(new Date().getFullYear()))
  })

  test('GET /api/persons/:id returns the matching person', async () => {
    const response = await request(app).get('/api/persons/1')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: '1',
      name: 'Arto Hellas',
      number: '040-123456',
    })
  })

  test('GET /api/persons/:id returns 404 for an unknown id', async () => {
    const response = await request(app).get('/api/persons/99')

    expect(response.status).toBe(404)
  })

  test('DELETE /api/persons/:id removes the person', async () => {
    const deleted = await request(app).delete('/api/persons/2')

    expect(deleted.status).toBe(204)
  })

  test('POST /api/persons adds a person with a generated id', async () => {
    const created = await request(app)
      .post('/api/persons')
      .send({ name: 'Grace Hopper', number: '040-999999' })

    expect(created.status).toBe(200)
    expect(created.body.name).toBe('Grace Hopper')
    expect(created.body.number).toBe('040-999999')
    expect(created.body.id).toBeDefined()
  })

  test('POST without a name is rejected', async () => {
    const response = await request(app)
      .post('/api/persons')
      .send({ number: '040-999999' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('name and number are required')
  })

  test('POST without a number is rejected', async () => {
    const response = await request(app)
      .post('/api/persons')
      .send({ name: 'Grace Hopper' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('name and number are required')
  })

  test('POST with a duplicate name is rejected', async () => {
    const response = await request(app)
      .post('/api/persons')
      .send({ name: 'Arto Hellas', number: '040-999999' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('name must be unique')
  })

  test('logs every request in the tiny format', async () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

    await request(app).get('/api/persons')
    await new Promise((resolve) => setTimeout(resolve, 20))

    const logged = write.mock.calls.map((call) => String(call[0])).join('')
    expect(logged).toContain('GET /api/persons 200')
    write.mockRestore()
  })

  test('logs the body of a POST request', async () => {
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

  test('responses carry the CORS header', async () => {
    const response = await request(app).get('/api/persons')

    expect(response.headers['access-control-allow-origin']).toBe('*')
  })

  test('serves the built frontend from dist when it exists', async () => {
    const indexFile = join(process.cwd(), 'dist', 'index.html')
    const indexHtml = readFileSync(indexFile, 'utf8')

    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.text).toBe(indexHtml)
  })

  test('every /api/persons response is JSON', async () => {
    const response = await request(app).get('/api/persons')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
  })
})
