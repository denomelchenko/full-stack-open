import { useParams } from 'react-router-dom'
import { Button, Paper, Stack, Typography } from '@mui/material'

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
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5">{blog.title}</Typography>
      <Typography>{blog.author}</Typography>
      <Typography>
        <a href={blog.url}>{blog.url}</a>
      </Typography>
      <Typography>likes {blog.likes}</Typography>
      <Typography>{blog.user ? blog.user.name : 'unknown'}</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        {user && (
          <Button variant="contained" color="primary" onClick={() => handleLike(blog)}>
            like
          </Button>
        )}
        {own && (
          <Button variant="outlined" color="error" onClick={() => handleDelete(blog)}>
            delete
          </Button>
        )}
      </Stack>
    </Paper>
  )
}

export default Blog
