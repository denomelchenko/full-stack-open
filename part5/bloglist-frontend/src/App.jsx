import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const notificationTimer = useRef(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current)
    }
    notificationTimer.current = setTimeout(() => {
      setNotification(null)
      notificationTimer.current = null
    }, 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      blogFormRef.current.toggleVisibility()
      notify('a new blog ' + createdBlog.title + ' by ' + createdBlog.author + ' added')
    } catch {
      notify('the blog could not be created', 'error')
    }
  }

  const handleLike = async (blogToLike) => {
    try {
      const updatedBlog = await blogService.update(blogToLike.id, blogToLike)
      setBlogs(blogs.map((blog) => {
        if (blog.id !== updatedBlog.id) {
          return blog
        }
        return { ...updatedBlog, user: blog.user }
      }))
    } catch {
      notify('the blog could not be liked', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  const blogsToShow = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogsToShow.map((blog) => (
        <Blog key={blog.id} blog={blog} handleLike={handleLike} />
      ))}
    </div>
  )
}

export default App
