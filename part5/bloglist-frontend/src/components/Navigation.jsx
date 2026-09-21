import { Link } from 'react-router-dom'
import { AppBar, Button, Toolbar } from '@mui/material'

const Navigation = ({ user, onLogout }) => (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" component={Link} to="/">
        blogs
      </Button>
      {!user && (
        <Button color="inherit" component={Link} to="/login">
          login
        </Button>
      )}
      {user && (
        <Button color="inherit" component={Link} to="/blogs/new">
          new blog
        </Button>
      )}
      {user && <span>{user.name} logged in</span>}
      {user && (
        <Button color="inherit" onClick={onLogout}>
          logout
        </Button>
      )}
    </Toolbar>
  </AppBar>
)

export default Navigation
