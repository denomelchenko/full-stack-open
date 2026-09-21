import { Link } from 'react-router-dom'

const Navigation = ({ user, onLogout }) => (
  <div>
    <Link to="/">blogs</Link>
    {' | '}
    {!user && <Link to="/login">login</Link>}
    {user && <span>{user.name} logged in</span>}
    {' '}
    {user && (
      <button type="button" onClick={onLogout}>
        logout
      </button>
    )}
  </div>
)

export default Navigation
