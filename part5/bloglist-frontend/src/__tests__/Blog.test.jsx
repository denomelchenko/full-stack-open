import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import Blog from '../components/Blog'

const blog = {
  id: '5f9f1b0b0b0b0b0b0b0b0b0f',
  title: 'Component testing is a wonderful thing',
  author: 'Ada Lovelace',
  url: 'https://example.com/component-testing',
  likes: 5,
  user: { id: 'u1', username: 'mluukkai', name: 'Matti Luukkainen' },
}

const creator = { token: 'token-1', username: 'mluukkai', name: 'Matti Luukkainen' }

const otherUser = { token: 'token-2', username: 'ada', name: 'Ada Lovelace' }

const renderBlog = (user) => {
  const handleLike = vi.fn()
  const handleDelete = vi.fn()

  render(
    <MemoryRouter initialEntries={['/blogs/' + blog.id]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blog blogs={[blog]} user={user} handleLike={handleLike} handleDelete={handleDelete} />
          }
        />
      </Routes>
    </MemoryRouter>
  )

  return { handleLike, handleDelete }
}

describe('Blog', () => {
  test('unauthenticated users see the blog information and the like count but no buttons', () => {
    renderBlog(null)

    expect(screen.getByText(blog.title)).toBeInTheDocument()
    expect(screen.getByText(blog.author)).toBeInTheDocument()
    expect(screen.getByText(blog.url)).toBeInTheDocument()
    expect(screen.getByText('likes 5')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'delete' })).toBeNull()
  })

  test('an authenticated user who is not the creator sees only the like button', async () => {
    const { handleLike, handleDelete } = renderBlog(otherUser)

    expect(screen.getByText(blog.title)).toBeInTheDocument()
    expect(screen.getByText('likes 5')).toBeInTheDocument()

    const likeButton = screen.getByRole('button', { name: 'like' })
    expect(likeButton).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'delete' })).toBeNull()

    const user = userEvent.setup()
    await user.click(likeButton)

    expect(handleLike.mock.calls).toHaveLength(1)
    expect(handleLike.mock.calls[0][0].id).toBe(blog.id)
    expect(handleDelete.mock.calls).toHaveLength(0)
  })

  test('the creator also sees the delete button', async () => {
    const { handleDelete } = renderBlog(creator)

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    const deleteButton = screen.getByRole('button', { name: 'delete' })
    expect(deleteButton).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(deleteButton)

    expect(handleDelete.mock.calls).toHaveLength(1)
    expect(handleDelete.mock.calls[0][0].id).toBe(blog.id)
  })
})
