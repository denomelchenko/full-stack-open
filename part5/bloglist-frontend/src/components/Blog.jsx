import { useParams } from 'react-router-dom'

const Blog = ({ blogs, user, handleLike, handleDelete }) => {
  const id = useParams().id
  const blog = blogs.find((candidate) => candidate.id === id)

  // While the blogs are still being fetched (for example on a direct reload of
  // /blogs/:id) there is no blog yet. Returning null instead of dereferencing
  // "blog" is what keeps the page from crashing.
  if (!blog) {
    return null
  }

  const own = user && blog.user && user.username === blog.user.username

  return (
    <div className="blog">
      <h2>{blog.title}</h2>
      <div>{blog.author}</div>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>likes {blog.likes}</div>
      <div>{blog.user ? blog.user.name : 'unknown'}</div>
      {user && (
        <button type="button" onClick={() => handleLike(blog)}>
          like
        </button>
      )}
      {own && (
        <button type="button" onClick={() => handleDelete(blog)}>
          delete
        </button>
      )}
    </div>
  )
}

export default Blog
