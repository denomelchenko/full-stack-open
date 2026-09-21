const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return <div className={message.type === 'error' ? 'error' : 'success'}>{message.text}</div>
}

export default Notification
