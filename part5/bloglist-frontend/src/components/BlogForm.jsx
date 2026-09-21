import { useState } from 'react'
import { Button, Container, TextField } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Container maxWidth="sm">
      <h2>create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            label="author"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            label="url"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          create
        </Button>
      </form>
    </Container>
  )
}

export default BlogForm
