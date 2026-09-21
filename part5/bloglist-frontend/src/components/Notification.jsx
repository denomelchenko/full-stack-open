import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <Alert severity={message.type === 'error' ? 'error' : 'success'} sx={{ mt: 2 }}>
      {message.text}
    </Alert>
  )
}

export default Notification
