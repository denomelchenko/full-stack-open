import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

test('<BlogForm /> calls the createBlog handler with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title'), 'Component testing')
  await user.type(screen.getByLabelText('author'), 'Test Author')
  await user.type(screen.getByLabelText('url'), 'https://example.com')

  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Component testing',
    author: 'Test Author',
    url: 'https://example.com',
  })
})
