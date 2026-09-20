import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import App from '../App'

const byRow = (text) =>
  screen.getByText(
    (_, element) => element?.tagName === 'P' && element.textContent.trim() === text
  )

describe('courseinfo', () => {
  test('renders the course name as a heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Half Stack application development' })
    ).toBeInTheDocument()
  })

  test('renders each part with its exercise count', () => {
    render(<App />)
    expect(byRow('Fundamentals of React 10')).toBeInTheDocument()
    expect(byRow('Using props to pass data 7')).toBeInTheDocument()
    expect(byRow('State of a component 14')).toBeInTheDocument()
  })

  test('renders the total number of exercises', () => {
    render(<App />)
    expect(byRow('Number of exercises 31')).toBeInTheDocument()
  })
})
