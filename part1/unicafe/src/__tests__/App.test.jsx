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

  test('shows No feedback given until feedback is submitted', () => {
    render(<App />)
    expect(screen.getByText('No feedback given')).toBeInTheDocument()
    expect(screen.queryByText('good 0')).not.toBeInTheDocument()
  })

  test('shows the statistics once feedback is submitted', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'good' }))

    expect(screen.queryByText('No feedback given')).not.toBeInTheDocument()
    expect(screen.getByText('good 1')).toBeInTheDocument()
    expect(screen.getByText('total 1')).toBeInTheDocument()
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

  test('shows total, average and positive percentage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'good' }))
    await user.click(screen.getByRole('button', { name: 'good' }))
    await user.click(screen.getByRole('button', { name: 'neutral' }))
    await user.click(screen.getByRole('button', { name: 'bad' }))

    const total = 4
    const average = (2 - 1) / total
    const positive = (2 / total) * 100

    expect(screen.getByText('total ' + total)).toBeInTheDocument()
    expect(screen.getByText('average ' + average)).toBeInTheDocument()
    expect(screen.getByText('positive ' + positive + ' %')).toBeInTheDocument()
  })
})
