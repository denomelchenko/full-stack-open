import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from 'vitest'
import App from '../App'

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.',
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('anecdotes', () => {
  test('shows the first anecdote initially', () => {
    render(<App />)
    expect(screen.getByText(anecdotes[0])).toBeInTheDocument()
  })

  test('shows the anecdote at the random index when next is clicked', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'next anecdote' }))

    expect(screen.getByText(anecdotes[4])).toBeInTheDocument()
  })

  test('starts with zero votes for the displayed anecdote', () => {
    render(<App />)
    expect(screen.getByText('has 0 votes')).toBeInTheDocument()
  })

  test('a vote increments the vote count of the displayed anecdote', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'vote' }))

    expect(screen.getByText('has 1 votes')).toBeInTheDocument()
  })

  test('votes are tracked per anecdote', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'vote' }))
    await user.click(screen.getByRole('button', { name: 'next anecdote' }))

    expect(screen.getByText(anecdotes[4])).toBeInTheDocument()
    expect(screen.getByText('has 0 votes')).toBeInTheDocument()
  })
})
