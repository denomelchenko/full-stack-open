import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import App from '../App'

describe('phonebook', () => {
  test('renders the seeded person', () => {
    render(<App />)
    expect(screen.getByText('Arto Hellas 040-123456')).toBeInTheDocument()
  })

  test('adds a person typed into the form and clears the name input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('name'), 'Ada Lovelace')
    await user.click(screen.getByRole('button', { name: 'add' }))

    expect(screen.getByText(/Ada Lovelace/)).toBeInTheDocument()
    expect(screen.getByLabelText('name')).toHaveValue('')
  })

  test('does not add a duplicate name and alerts instead', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('name'), 'Arto Hellas')
    await user.click(screen.getByRole('button', { name: 'add' }))

    expect(alertSpy).toHaveBeenCalledWith('Arto Hellas is already added to phonebook')
    expect(screen.getAllByText(/Arto Hellas/)).toHaveLength(1)
    alertSpy.mockRestore()
  })

  test('adds a person together with a phone number', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('number'), '12-34-5678')
    await user.click(screen.getByRole('button', { name: 'add' }))

    expect(screen.getByText('Ada Lovelace 12-34-5678')).toBeInTheDocument()
    expect(screen.getByLabelText('number')).toHaveValue('')
  })
})
