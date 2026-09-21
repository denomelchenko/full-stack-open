import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeBlog = () => {
    handleLike({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    })
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-title-author">
        <span className="blog-title">{blog.title}</span> by <span className="blog-author">{blog.author}</span>
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} className="blog-details">
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">
          likes {blog.likes}
          <button onClick={likeBlog}>like</button>
        </div>
        <div className="blog-user">{blog.user && blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog
