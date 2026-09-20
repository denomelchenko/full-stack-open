import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import App from '../App'

const statValue = (label) =>
  screen.getByRole('cell', { name: label }).nextElementSibling.textContent

describe('unicafe', () => {
  test('renders the three feedback buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'good' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'neutral' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'bad' })).toBeInTheDocument()
  })

  test('shows No feedback given until feedback is submitted', () => {
    render(<App />)
    expect(screen.getByText('No feedback given')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  test('a click increments only the clicked category', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'good' }))
    await user.click(screen.getByRole('button', { name: 'good' }))
    await user.click(screen.getByRole('button', { name: 'bad' }))

    expect(statValue('good')).toBe('2')
    expect(statValue('neutral')).toBe('0')
    expect(statValue('bad')).toBe('1')
  })

  test('shows total, average and positive percentage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'good' }))
    await user.click(screen.getByRole('button', { name: 'good' }))
    await user.click(screen.getByRole('button', { name: 'neutral' }))
    await user.click(screen.getByRole('button', { name: 'bad' }))

    expect(statValue('total')).toBe('4')
    expect(statValue('average')).toBe(String((2 - 1) / 4))
    expect(statValue('positive')).toBe((2 / 4) * 100 + ' %')
  })

  test('shows the statistics once feedback is submitted', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'good' }))

    expect(screen.queryByText('No feedback given')).not.toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(statValue('good')).toBe('1')
    expect(statValue('total')).toBe('1')
  })
})
