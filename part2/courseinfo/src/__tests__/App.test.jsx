import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import App from '../App'

describe('courseinfo', () => {
  test('renders the course name as a heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Half Stack application development' })
    ).toBeInTheDocument()
  })

  test('renders every part of the course', () => {
    render(<App />)
    expect(screen.getByText('Fundamentals of React 10')).toBeInTheDocument()
    expect(screen.getByText('Using props to pass data 7')).toBeInTheDocument()
    expect(screen.getByText('State of a component 14')).toBeInTheDocument()
    expect(screen.getByText('Redux 11')).toBeInTheDocument()
  })

  test('shows the total number of exercises', () => {
    render(<App />)
    expect(screen.getByText('Total of 42 exercises')).toBeInTheDocument()
  })

  test('renders every course and every course total', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Half Stack application development' })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Node.js' })).toBeInTheDocument()
    expect(screen.getByText('Routing 3')).toBeInTheDocument()
    expect(screen.getByText('Middlewares 7')).toBeInTheDocument()
    expect(screen.getByText('Total of 42 exercises')).toBeInTheDocument()
    expect(screen.getByText('Total of 10 exercises')).toBeInTheDocument()
  })
})
