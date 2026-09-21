const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const style = {
    background: 'lightgrey',
    color: notification.type === 'error' ? 'red' : 'green',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div className={'notification ' + notification.type} style={style}>
      {notification.message}
    </div>
  )
}

export default Notification
