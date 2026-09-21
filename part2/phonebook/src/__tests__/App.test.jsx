import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import personsService from '../services/persons'
import App from '../App'

vi.mock('../services/persons', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
  },
}))

const serverPersons = [
  { name: 'Arto Hellas', number: '040-123456', id: '1' },
  { name: 'Ada Lovelace', number: '39-44-5323523', id: '2' },
]

beforeEach(() => {
  vi.clearAllMocks()
  personsService.getAll.mockResolvedValue(serverPersons)
})

describe('phonebook', () => {
  test('renders the persons fetched from the server', async () => {
    render(<App />)

    expect(await screen.findByText('Arto Hellas 040-123456')).toBeInTheDocument()
    expect(screen.getByText('Ada Lovelace 39-44-5323523')).toBeInTheDocument()
    expect(personsService.getAll).toHaveBeenCalledTimes(1)
  })

  test('no longer renders the old local seed', async () => {
    render(<App />)
    await screen.findByText('Arto Hellas 040-123456')

    expect(
      screen.queryByText('Mary Poppendieck 39-23-6423122')
    ).not.toBeInTheDocument()
  })

  test('filters the fetched persons by name, case-insensitively', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Arto Hellas 040-123456')

    await user.type(screen.getByLabelText('filter shown with'), 'aDa')

    expect(screen.getByText('Ada Lovelace 39-44-5323523')).toBeInTheDocument()
    expect(screen.queryByText('Arto Hellas 040-123456')).not.toBeInTheDocument()
  })

  test('does not add a duplicate name and alerts instead', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Arto Hellas 040-123456')

    await user.type(screen.getByLabelText('name'), 'Arto Hellas')
    await user.click(screen.getByRole('button', { name: 'add' }))

    expect(alertSpy).toHaveBeenCalledWith(
      'Arto Hellas is already added to phonebook'
    )
    expect(screen.getAllByText(/Arto Hellas/)).toHaveLength(1)
    alertSpy.mockRestore()
  })

  test('saves a new person to the server and shows the response', async () => {
    personsService.create.mockResolvedValue({
      name: 'Grace Hopper',
      number: '040-999999',
      id: '5',
    })
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Arto Hellas 040-123456')

    await user.type(screen.getByLabelText('name'), 'Grace Hopper')
    await user.type(screen.getByLabelText('number'), '040-999999')
    await user.click(screen.getByRole('button', { name: 'add' }))

    expect(personsService.create).toHaveBeenCalledWith({
      name: 'Grace Hopper',
      number: '040-999999',
    })
    expect(await screen.findByText('Grace Hopper 040-999999')).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toHaveValue('')
    expect(screen.getByLabelText('number')).toHaveValue('')
  })

  test('deletes a person after confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    personsService.remove.mockResolvedValue({})
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Arto Hellas 040-123456')

    const row = screen.getByText(/Arto Hellas/)
    await user.click(within(row).getByRole('button', { name: 'delete' }))

    expect(confirmSpy).toHaveBeenCalledWith('Delete Arto Hellas?')
    expect(personsService.remove).toHaveBeenCalledWith('1')
    expect(screen.queryByText('Arto Hellas 040-123456')).not.toBeInTheDocument()
    confirmSpy.mockRestore()
  })

  test('keeps the person when the confirmation is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Arto Hellas 040-123456')

    const row = screen.getByText(/Arto Hellas/)
    await user.click(within(row).getByRole('button', { name: 'delete' }))

    expect(personsService.remove).not.toHaveBeenCalled()
    expect(screen.getByText('Arto Hellas 040-123456')).toBeInTheDocument()
    confirmSpy.mockRestore()
  })
})
