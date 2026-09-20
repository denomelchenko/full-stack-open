import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import App from '../App'

describe('unicafe', () => {
  test('renders the three feedback buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'good' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'neutral' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'bad' })).toBeInTheDocument()
  })

  test('shows a zero count for every category initially', () => {
    render(<App />)
    expect(screen.getByText('good 0')).toBeInTheDocument()
    expect(screen.getByText('neutral 0')).toBeInTheDocument()
    expect(screen.getByText('bad 0')).toBeInTheDocument()
  })

  test('a click increments only the clicked category', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'good' }))
    await user.click(screen.getByRole('button', { name: 'good' }))
    await user.click(screen.getByRole('button', { name: 'bad' }))

    expect(screen.getByText('good 2')).toBeInTheDocument()
    expect(screen.getByText('neutral 0')).toBeInTheDocument()
    expect(screen.getByText('bad 1')).toBeInTheDocument()
  })
})
