import { useState } from 'react'
import { Button, Container, TextField } from '@mui/material'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    onLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <Container maxWidth="xs">
      <h2>login to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            name="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </form>
    </Container>
  )
}

export default LoginForm
