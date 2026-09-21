import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'

const blog = {
  id: '5a43fde2cbd20b12a2c34e91',
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'https://example.com/component-testing',
  likes: 5,
  user: {
    id: '5a43e6b6c37f3d065eaaa581',
    username: 'tester',
    name: 'Test User',
  },
}

describe('<Blog />', () => {
  test('renders the title and the author but not the url or the likes by default', () => {
    render(<Blog blog={blog} user={blog.user} handleLike={vi.fn()} handleDelete={vi.fn()} />)

    expect(screen.getByText(blog.title)).toBeVisible()
    expect(screen.getByText(blog.author)).toBeVisible()
    expect(screen.getByText(blog.url)).not.toBeVisible()
    expect(screen.getByText('likes ' + blog.likes)).not.toBeVisible()
  })
})
