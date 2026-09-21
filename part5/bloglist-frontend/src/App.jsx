import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Navigation from './components/Navigation'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((loadedBlogs) => setBlogs(loadedBlogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  useEffect(() => {
    if (!notification) {
      return undefined
    }

    const timer = setTimeout(() => setNotification(null), 5000)

    return () => clearTimeout(timer)
  }, [notification])

  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setNotification({ text: 'logged in as ' + loggedUser.name, type: 'success' })
      navigate('/')
    } catch {
      setNotification({ text: 'wrong username or password', type: 'error' })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setNotification({ text: 'logged out', type: 'success' })
    navigate('/')
  }

  const handleCreate = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(createdBlog))
      setNotification({
        text: 'a new blog ' + createdBlog.title + ' by ' + createdBlog.author + ' added',
        type: 'success',
      })
      navigate('/')
    } catch {
      setNotification({ text: 'blog could not be created', type: 'error' })
    }
  }

  const handleLike = async (blog) => {
    const changedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, changedBlog)
      const updatedBlog = { ...returnedBlog, user: blog.user }

      setBlogs(blogs.map((candidate) => (candidate.id === returnedBlog.id ? updatedBlog : candidate)))
    } catch {
      setNotification({ text: 'liking the blog failed', type: 'error' })
    }
  }

  const handleDelete = async (blog) => {
    try {
      await blogService.remove(blog.id)

      setBlogs(blogs.filter((candidate) => candidate.id !== blog.id))
      setNotification({ text: 'blog ' + blog.title + ' removed', type: 'success' })
      navigate('/')
    } catch {
      setNotification({ text: 'deleting the blog failed', type: 'error' })
    }
  }

  const blogsByLikes = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} />
      <Notification message={notification} />
      <Routes>
        <Route path="/" element={<BlogList blogs={blogsByLikes} />} />
        <Route
          path="/login"
          element={user ? <Navigate replace to="/" /> : <LoginForm onLogin={handleLogin} />}
        />
        <Route
          path="/blogs/new"
          element={user ? <BlogForm createBlog={handleCreate} /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog blogs={blogs} user={user} handleLike={handleLike} handleDelete={handleDelete} />
          }
        />
      </Routes>
    </div>
  )
}

export default App
